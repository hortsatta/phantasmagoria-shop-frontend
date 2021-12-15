import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';

import { createCardImageBlob, createCoverImageBlob } from 'services';
import { CREATE_CARD, UPDATE_CARD, UPLOAD } from 'services/graphql';
import { useDebounce } from 'features/core/hooks';
import { CardFormData } from '../components';

type Result = {
  addCard: (cardFormData: CardFormData) => void;
  loading: boolean;
  isComplete: boolean;
};

export const useAddCard = (): Result => {
  const { debounce, loading: debounceLoading } = useDebounce();
  const [createCard, { loading: createCardLoading }] = useMutation(CREATE_CARD);
  const [updateCard, { loading: updateCardLoading }] = useMutation(UPDATE_CARD);
  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);
  const [isComplete, setIsComplete] = useState(false);

  const addCard = useCallback(async (cardFormData: CardFormData) => {
    debounce();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { coverImage, image, id, offense, defense, cost, ...moreCardFormData } = cardFormData;
      const card = {
        ...moreCardFormData,
        attr: { offense, defense, cost }
      };
      // Create initial card without images.
      const { data } = await createCard({ variables: { card } });
      const { card: newCard } = data.createCard;
      // Generate image blob for both card image and cover image if present.
      const cardImageBlob = await createCardImageBlob(image, newCard.id, newCard.slug);
      const coverImageBlob = await createCoverImageBlob(coverImage, newCard.id, newCard.slug);
      let cardImageResult = null;
      let coverImageResult = null;
      // Upload images if present then apply id to result variables
      if (cardImageBlob) {
        const variables = {
          file: cardImageBlob,
          refId: newCard.id,
          field: 'image'
        };

        const { data: imageData } = await upload({ variables });
        cardImageResult = imageData.upload.id;
      }

      if (coverImageBlob) {
        const variables = {
          file: coverImageBlob,
          refId: newCard.id,
          field: 'coverImage'
        };

        const { data: coverImageData } = await upload({ variables });
        coverImageResult = coverImageData.upload.id;
      }
      // Finally, update newly created card with uploaded images.
      const updateCardVariables = {
        id: newCard.id,
        card: {
          image: cardImageResult,
          coverImage: coverImageResult
        }
      };

      await updateCard({ variables: updateCardVariables });
      setIsComplete(true);
    } catch (err: any) {
      // TODO
      console.error(err);
    }
  }, []);

  return {
    loading: debounceLoading || createCardLoading || updateCardLoading || uploadLoading,
    isComplete,
    addCard
  };
};
