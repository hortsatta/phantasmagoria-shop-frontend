import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { createCoverImageBlob } from 'services';
import { CREATE_CARD_PRODUCT, UPDATE_CARD_PRODUCT, UPLOAD } from 'services/graphql';
import { useDebounce } from 'features/core/hooks';
import { CardProductFormData } from 'features/card/components';

type Return = {
  isComplete: boolean;
  loading: boolean;
  addShopItem: (cardProdFormData: CardProductFormData) => void;
};

export const useAddShopItem = (): Return => {
  const { debounce, loading: debounceLoading } = useDebounce();
  const [createCardProduct, { loading: createCardProductLoading }] =
    useMutation(CREATE_CARD_PRODUCT);
  const [updateCardProduct, { loading: updateCardProductLoading }] =
    useMutation(UPDATE_CARD_PRODUCT);
  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);
  const [isComplete, setIsComplete] = useState(false);

  const addShopItem = async (cardProdFormData: CardProductFormData) => {
    debounce();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, id, cards, ...moreCardProdFormData } = cardProdFormData;
      const cardProduct = {
        ...moreCardProdFormData,
        cards: cards.map(card => card.id)
      };
      // Create initial card product without images.
      const { data } = await createCardProduct({ variables: { cardProduct } });
      const { cardProduct: newCardProduct } = data.createCardProduct;
      // Generate image blob card product image if present.
      const cardProductImageBlob = await createCoverImageBlob(
        image,
        newCardProduct.id,
        newCardProduct.slug
      );
      let cardProductImageResult = null;
      // Upload images if present then apply id to result variables
      if (cardProductImageBlob) {
        const variables = {
          file: cardProductImageBlob,
          refId: newCardProduct.id,
          field: 'image'
        };

        const { data: imageData } = await upload({ variables });
        cardProductImageResult = imageData.upload.id;
      }
      // Finally, update newly created card product with uploaded images.
      const updateCardProductVariables = {
        id: newCardProduct.id,
        cardProduct: {
          image: cardProductImageResult
        }
      };

      await updateCardProduct({ variables: updateCardProductVariables });
      setIsComplete(true);
    } catch (err: any) {
      // TODO
      console.error(JSON.stringify(err));
    }
  };

  return {
    isComplete,
    loading:
      debounceLoading || createCardProductLoading || updateCardProductLoading || uploadLoading,
    addShopItem
  };
};
