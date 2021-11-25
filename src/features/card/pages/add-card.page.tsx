import { FC, useContext, useEffect, useState } from 'react';
import { Center, Heading } from '@chakra-ui/react';
import { useMutation, useReactiveVar } from '@apollo/client';

import { appModulesVar } from 'config';
import { createCardImageBlob, createCoverImageBlob } from 'services';
import { CREATE_CARD, UPDATE_CARD, UPLOAD } from 'services/graphql';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { PageBox } from 'features/core/components';
import { CardFormData, UpsertCardForm } from '../components';

export const AddCardPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce, loading: debounceLoading } = useDebounce();
  const [createCard, { loading: createCardLoading }] = useMutation(CREATE_CARD);
  const [updateCard, { loading: updateCardLoading }] = useMutation(UPDATE_CARD);
  const [upload, { loading: uploadLoading }] = useMutation(UPLOAD);
  const appModules: any = useReactiveVar(appModulesVar);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect to main shop page if process is fully complete.
  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const shopListNav = appModules.shop.children?.list;
    changePage(shopListNav?.key, shopListNav?.path);
  }, [isComplete]);

  const handleSubmit = async (cardFormData: CardFormData) => {
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
  };

  return (
    <PageBox pt={8}>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Add New Card
        </Heading>
      </Center>
      <UpsertCardForm
        m='0 auto'
        maxW='4xl'
        w='100%'
        onSubmit={handleSubmit}
        loading={debounceLoading || createCardLoading || updateCardLoading || uploadLoading}
        isComplete={isComplete}
      />
    </PageBox>
  );
};
