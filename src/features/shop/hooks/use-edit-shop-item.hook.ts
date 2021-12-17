import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { CardProduct } from 'models';
import {
  DELETE_CARD_PRODUCT,
  GET_CARD_PRODUCTS_DETAIL_EDIT,
  UPDATE_CARD_PRODUCT,
  UPLOAD
} from 'services/graphql';
import { useDebounce } from 'features/core/hooks';
import { CardProductFormData } from 'features/card/components';
import { createCardImageBlob } from 'services';

type Result = {
  updateItem: (cardProdFormData: CardProductFormData) => void;
  removeItem: () => void;
  loading: boolean;
  isComplete: boolean;
  currentItem?: CardProduct;
};

export const useEditShopItem = (slug: string): Result => {
  const { debounce, loading: debounceLoading } = useDebounce();
  const [isComplete, setIsComplete] = useState(false);

  const [
    getCardProductsDetail,
    { data: { cardProducts = [] } = {}, loading: getCardProductsDetailLoading }
  ] = useLazyQuery(GET_CARD_PRODUCTS_DETAIL_EDIT);

  const [updateCardProduct, { loading: updateCardProductLoading }] =
    useMutation(UPDATE_CARD_PRODUCT);

  const [deleteCardProduct, { loading: deleteCardProductLoading }] =
    useMutation(DELETE_CARD_PRODUCT);

  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);

  useEffect(() => {
    if (!slug.trim()) {
      return;
    }
    getCardProductsDetail({ variables: { where: { slug } } });
  }, [slug]);

  const updateItem = useCallback(
    async (cardProdFormData: CardProductFormData) => {
      debounce();

      try {
        const { id: cardProductId, image: currentImage } = cardProducts[0] || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, image, cards, ...moreCardProdFormData } = cardProdFormData;

        const cardProduct: any = {
          ...moreCardProdFormData,
          cards: cards.map(card => card.id)
        };

        const imageUrl = (image && image[0]?.source) || null;
        const currentImageUrl = currentImage?.url || null;

        // Upload image if present then apply id to result variables
        if (imageUrl !== currentImageUrl) {
          if (imageUrl) {
            const cardImageBlob = await createCardImageBlob(image, cardProductId, slug);
            const variables = {
              file: cardImageBlob,
              refId: cardProductId,
              field: 'image'
            };

            const { data: imageData } = await upload({ variables });
            cardProduct.image = imageData.upload.id;
          } else {
            cardProduct.image = null;
          }
        }
        // Update newly created card with uploaded images.
        const updateCardProductVariables = { id: cardProductId, cardProduct };
        await updateCardProduct({ variables: updateCardProductVariables });
        setIsComplete(true);
      } catch (err: any) {
        // TODO
        console.error(err);
      }
    },
    [cardProducts]
  );

  const removeItem = useCallback(async () => {
    debounce();
    const { id } = cardProducts[0] || {};

    try {
      await deleteCardProduct({ variables: { id } });
      setIsComplete(true);
    } catch (err: any) {
      // TODO
      console.error(err);
    }
  }, [cardProducts]);

  return {
    updateItem,
    removeItem,
    loading:
      debounceLoading ||
      getCardProductsDetailLoading ||
      updateCardProductLoading ||
      deleteCardProductLoading ||
      uploadLoading,
    isComplete,
    currentItem: cardProducts[0] || null
  };
};
