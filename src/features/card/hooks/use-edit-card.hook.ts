import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { messages } from 'config';
import { Card } from 'models';
import { createCardImageBlob, createCoverImageBlob } from 'services';
import { DELETE_CARD, GET_CARDS_DETAIL_EDIT, UPDATE_CARD, UPLOAD } from 'services/graphql';
import { useDebounce, useNotification } from 'features/core/hooks';
import { CardFormData } from '../components';

type Result = {
  updateCard: (cardFormData: CardFormData) => void;
  removeCard: () => void;
  loading: boolean;
  isComplete: boolean;
  currentCard?: Card;
};

export const useEditCard = (slug: string): Result => {
  const { notify } = useNotification();
  const { debounce, loading: debounceLoading } = useDebounce();
  const [updateCurrentCard, { loading: updateCardLoading }] = useMutation(UPDATE_CARD);
  const [deleteCard, { loading: deleteCardLoading }] = useMutation(DELETE_CARD);
  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);
  const [getCardsDetail, { data: { cards = [] } = {}, loading: getCardsDetailLoading }] =
    useLazyQuery(GET_CARDS_DETAIL_EDIT);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!slug.trim()) {
      return;
    }
    getCardsDetail({ variables: { where: { slug } } });
  }, [slug]);

  const updateCard = useCallback(
    async (cardFormData: CardFormData) => {
      debounce();

      try {
        const { id: cardId, image: currentImage, coverImage: currentCoverImage } = cards[0] || {};
        const {
          id,
          coverImage,
          image,
          offense,
          defense,
          cost,
          rarity,
          category,
          types,
          ...moreCardFormData
        } = cardFormData;

        const card: any = {
          ...moreCardFormData,
          attr: { offense, defense, cost },
          rarity: rarity.toString(),
          category: category.toString(),
          types: types.map((type: number) => type.toString())
        };

        const imageUrl = (image && image[0]?.source) || null;
        const coverImageUrl = (coverImage && coverImage[0]?.source) || null;
        const currentImageUrl = currentImage?.url || null;
        const currentCoverImageUrl = currentCoverImage?.url || null;

        // Upload images if present then apply id to result variables
        if (imageUrl !== currentImageUrl) {
          if (imageUrl) {
            const cardImageBlob = await createCardImageBlob(image, cardId, slug);
            const variables = {
              file: cardImageBlob,
              refId: cardId,
              field: 'image'
            };

            const { data: imageData } = await upload({ variables });
            card.image = imageData.upload.id;
          } else {
            card.image = null;
          }
        }

        if (coverImageUrl !== currentCoverImageUrl) {
          if (coverImageUrl) {
            const coverImageBlob = await createCoverImageBlob(coverImage, cardId, slug);
            const variables = {
              file: coverImageBlob,
              refId: cardId,
              field: 'coverImage'
            };

            const { data: coverImageData } = await upload({ variables });
            card.coverImage = coverImageData.upload.id;
          } else {
            card.coverImage = null;
          }
        }
        // Update newly created card with uploaded images.
        const updateCardVariables = { id: cardId, card };
        await updateCurrentCard({ variables: updateCardVariables });
        setIsComplete(true);
      } catch (err) {
        notify('error', 'Failed', messages.problem);
      }
    },
    [cards]
  );

  const removeCard = useCallback(async () => {
    debounce();
    const { id, cardProducts } = cards[0] || {};

    if (cardProducts?.length) {
      notify('error', 'Failed', 'Card has an active item on the shop.');
      return;
    }

    try {
      await deleteCard({ variables: { id } });
      setIsComplete(true);
    } catch (err) {
      notify('error', 'Failed', messages.problem);
    }
  }, [cards]);

  return {
    updateCard,
    removeCard,
    loading:
      debounceLoading ||
      updateCardLoading ||
      deleteCardLoading ||
      uploadLoading ||
      getCardsDetailLoading,
    isComplete,
    currentCard: cards[0] || null
  };
};
