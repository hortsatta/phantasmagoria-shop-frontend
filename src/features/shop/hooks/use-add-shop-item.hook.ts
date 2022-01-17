import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import { messages } from 'config';
import { createCoverImageBlob } from 'services';
import { CREATE_CARD_PRODUCT, UPDATE_CARD_PRODUCT, UPLOAD } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';
import { CardProductFormData } from 'features/card/components';

type Result = {
  isComplete: boolean;
  loading: boolean;
  addShopItem: (cardProdFormData: CardProductFormData) => void;
};

export const useAddShopItem = (): Result => {
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [createCardProduct, { loading: createCardProductLoading }] =
    useMutation(CREATE_CARD_PRODUCT);
  const [updateCardProduct, { loading: updateCardProductLoading }] =
    useMutation(UPDATE_CARD_PRODUCT);
  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);
  const [isComplete, setIsComplete] = useState(false);

  const addShopItem = useCallback(async (cardProdFormData: CardProductFormData) => {
    debounce();

    try {
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
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, []);

  return {
    isComplete,
    loading:
      debounceLoading || createCardProductLoading || updateCardProductLoading || uploadLoading,
    addShopItem
  };
};
