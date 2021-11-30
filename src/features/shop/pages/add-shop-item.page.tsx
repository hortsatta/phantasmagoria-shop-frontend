import { FC, useContext, useEffect, useState } from 'react';
import { useMutation, useReactiveVar } from '@apollo/client';
import { Center, Heading } from '@chakra-ui/react';

import { appModulesVar } from 'config';
import { createCoverImageBlob } from 'services';
import { CREATE_CARD_PRODUCT, UPDATE_CARD_PRODUCT, UPLOAD } from 'services/graphql';
import { PageContext } from 'features/core/contexts';
import { useDebounce } from 'features/core/hooks';
import { PageBox } from 'features/core/components';
import { CardProductFormData, UpsertCardProductForm } from 'features/card/components';

export const AddShopItemPage: FC = () => {
  const { changePage } = useContext(PageContext);
  const { debounce, loading: debounceLoading } = useDebounce();
  const [createCardProduct, { loading: createCardProductLoading }] =
    useMutation(CREATE_CARD_PRODUCT);
  const [updateCardProduct, { loading: updateCardProductLoading }] =
    useMutation(UPDATE_CARD_PRODUCT);
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

  const handleSubmit = async (cardProdFormData: CardProductFormData) => {
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

  return (
    <PageBox pt={8}>
      <Center mb={6}>
        <Heading as='h2' fontSize='4xl'>
          Conjure New Item
        </Heading>
      </Center>
      <UpsertCardProductForm
        m='0 auto'
        maxW='4xl'
        w='100%'
        onSubmit={handleSubmit}
        loading={
          debounceLoading || createCardProductLoading || updateCardProductLoading || uploadLoading
        }
        isComplete={isComplete}
      />
    </PageBox>
  );
};
