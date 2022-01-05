import { ComponentProps, FC, useMemo, useState } from 'react';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';

import { Address } from 'models';
import { FormSectionHeading, Modal, Scrollbars, Surface } from 'features/core/components';
import { AddressFields } from './address-fields.component';

import variables from 'assets/styles/_variables.module.scss';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  addresses: Address[];
  onSubmit: (address: Address) => void;
  currentAddressId?: string;
  headerLabel?: string;
  loading?: boolean;
};

export const AddressSelectionModal: FC<Props> = ({
  isOpen,
  onClose,
  currentAddressId,
  addresses,
  headerLabel,
  loading,
  onSubmit
}) => {
  const currentAddress = useMemo(
    () => addresses.find(address => address.id === currentAddressId),
    [addresses, currentAddressId]
  );
  const addressesFields = useMemo(
    () => [currentAddress, ...addresses.filter(address => address.id !== currentAddressId)],
    [currentAddress, currentAddressId, addresses]
  );
  const [activeAddress, setActiveAddress] = useState<Address | null>(currentAddress || null);

  const handleSubmit = () => {
    if (!activeAddress) {
      return;
    }

    onSubmit(activeAddress);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '5xl' }} isCentered>
      <Surface flexDir='column' p={6}>
        <FormSectionHeading pt={0} w='100%'>
          {headerLabel || 'Select Address'}
        </FormSectionHeading>
        <Box h='340px'>
          <Scrollbars className='scrollbar' hideVerticalScroll>
            <HStack spacing={2}>
              {addressesFields.map((address: any) => (
                <AddressFields
                  key={address.id}
                  flexShrink={0}
                  p={4}
                  w='md'
                  bgColor={
                    address.id === activeAddress?.id
                      ? variables.accentColor
                      : variables.inputBgColor
                  }
                  borderRadius='4px'
                  cursor='pointer'
                  _hover={{
                    bgColor:
                      address.id === activeAddress?.id
                        ? variables.accentColor
                        : variables.hoverBgColor
                  }}
                  transition='background 0.12s ease'
                  address={address}
                  onClick={() => setActiveAddress(address)}
                />
              ))}
            </HStack>
          </Scrollbars>
        </Box>
        <Flex justifyContent='flex-end' flex={1} mt={6}>
          <Button
            pl={6}
            pr={7}
            w='190px'
            onClick={handleSubmit}
            isLoading={loading}
            disabled={loading}
          >
            Select
          </Button>
        </Flex>
      </Surface>
    </Modal>
  );
};

AddressSelectionModal.defaultProps = {
  currentAddressId: undefined,
  headerLabel: undefined,
  loading: false
};
