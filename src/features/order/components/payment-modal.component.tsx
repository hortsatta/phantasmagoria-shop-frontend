import { ComponentProps, FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button, Flex } from '@chakra-ui/react';
import { RocketLaunch } from 'phosphor-react';

import { FormSectionHeading, Icon, LoadingOverlay, Modal, Surface } from 'features/core/components';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  onSubmit: () => void;
  headerLabel?: string;
  isSubmitting?: boolean;
  loading?: boolean;
};

export const PaymentModal: FC<Props> = ({
  isOpen,
  onClose,
  headerLabel,
  isSubmitting,
  loading: formLoading,
  onSubmit
}) => {
  const [elementLoading, setElementLoading] = useState(true);
  const loading = useMemo(() => formLoading || elementLoading, [formLoading, elementLoading]);

  useEffect(() => {
    isOpen && setElementLoading(true);
  }, [isOpen]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: 'xl' }} isCentered>
      <Surface as='form' flexDir='column' p={6} onSubmit={handleSubmit}>
        <FormSectionHeading pt={0} w='100%'>
          {headerLabel || 'Card Details'}
        </FormSectionHeading>
        <Box>
          <Box minH='220px'>
            <LoadingOverlay h='100%' loading={loading}>
              <PaymentElement onReady={() => setElementLoading(false)} />
            </LoadingOverlay>
          </Box>
          <Flex flex={1} mt={6}>
            <Button
              pl={6}
              pr={7}
              flex={1}
              h='50px'
              onClick={handleSubmit}
              leftIcon={<Icon w={6} as={RocketLaunch} />}
              isLoading={loading || isSubmitting}
              disabled={loading}
            >
              Confirm
            </Button>
          </Flex>
        </Box>
      </Surface>
    </Modal>
  );
};

PaymentModal.defaultProps = {
  headerLabel: undefined,
  isSubmitting: false,
  loading: false
};
