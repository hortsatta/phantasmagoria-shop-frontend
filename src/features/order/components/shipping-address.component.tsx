import { FC, useCallback, useState } from 'react';
import {
  Box,
  BoxProps,
  HStack,
  VStack,
  Button,
  ButtonProps,
  useDisclosure
} from '@chakra-ui/react';
import { AddressBook, PenNib, PlusCircle } from 'phosphor-react';
import { motion, useAnimation } from 'framer-motion';

import { Address } from 'models';
import { FormSectionHeading, Icon } from 'features/core/components';
import {
  AddressFields,
  AddressFormData,
  AddressSelectionModal,
  UpsertAddressModal
} from 'features/user/components';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  value: Address;
  userCurrentAddresses: Address[];
  onUpdateAddress: (data: AddressFormData[]) => Promise<void>;
  onChange?: (data: AddressFormData) => void;
  isSubmitting?: boolean;
  loading?: boolean;
};

const MotionFlex = motion<Omit<BoxProps, 'transition'>>(Box);

const buttonStyles: ButtonProps = {
  justifyContent: 'flex-start',
  w: '100%',
  variant: 'ghost',
  size: 'sm'
};

export const ShippingAddress: FC<Props> = ({
  value,
  userCurrentAddresses,
  loading,
  isSubmitting,
  onUpdateAddress,
  onChange,
  ...moreProps
}) => {
  // Upsert address modal
  const {
    isOpen: upsertAddressModalIsOpen,
    onOpen: upsertAddressModalOnOpen,
    onClose: upsertAddressModalOnClose
  } = useDisclosure();
  // Address selection modal
  const {
    isOpen: addressSelectionModalIsOpen,
    onOpen: addressSelectionModalOnOpen,
    onClose: addressSelectionModalOnClose
  } = useDisclosure();

  const [isAddressNew, setIsAddressNew] = useState(false);
  const animationAddressFieldsControls = useAnimation();

  const handleUpdateAddress = useCallback(
    async (addressFormData: AddressFormData) => {
      try {
        let targetAddresses: any;
        if (isAddressNew) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: addressId, ...newAddress } = addressFormData;
          targetAddresses = [...userCurrentAddresses, newAddress];
        } else {
          targetAddresses = [
            ...userCurrentAddresses.filter(
              (address: Address) => address.id.toString() !== addressFormData.id.toString()
            ),
            addressFormData
          ];
        }

        await onUpdateAddress(targetAddresses);
        onChange && onChange(addressFormData as Address);
        animationAddressFieldsControls.start({ scale: [1, 0.95, 1] });
      } finally {
        upsertAddressModalOnClose();
      }
    },
    [userCurrentAddresses, isAddressNew, onChange]
  );

  const handleSelectAddress = useCallback(
    (address: Address) => {
      onChange && onChange(address);
      addressSelectionModalOnClose();

      if (address.id !== value.id) {
        animationAddressFieldsControls.start({ scale: [1, 0.95, 1] });
      }
    },
    [value]
  );

  const handleOpenUpdateAddressModal = useCallback(
    (isNew: boolean) => {
      setIsAddressNew(isNew);
      upsertAddressModalOnOpen();
      addressSelectionModalOnClose();
    },
    [setIsAddressNew]
  );

  const handleOpenSelectAddressModal = useCallback(() => {
    addressSelectionModalOnOpen();
    upsertAddressModalOnClose();
  }, []);

  return (
    <>
      <Box {...moreProps}>
        <FormSectionHeading pt={0}>Ship To</FormSectionHeading>
        <HStack alignItems='flex-start' spacing={4}>
          <MotionFlex
            animate={animationAddressFieldsControls}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <AddressFields
              flexShrink={0}
              p={4}
              w='md'
              bgColor={variables.inputBgColor}
              borderRadius='4px'
              overflow='hidden'
              address={value}
            />
          </MotionFlex>
          <VStack flex={1} alignItems='flex-start' py={4} spacing={2}>
            <Button
              {...buttonStyles}
              leftIcon={<Icon w={7} as={AddressBook} />}
              onClick={handleOpenSelectAddressModal}
            >
              Change Address
            </Button>
            <Button
              {...buttonStyles}
              leftIcon={<Icon w={7} as={PenNib} />}
              onClick={() => handleOpenUpdateAddressModal(false)}
            >
              Edit Address
            </Button>
            <Button
              {...buttonStyles}
              leftIcon={<Icon w={7} as={PlusCircle} />}
              onClick={() => handleOpenUpdateAddressModal(true)}
            >
              New Address
            </Button>
          </VStack>
        </HStack>
      </Box>
      <UpsertAddressModal
        onClose={upsertAddressModalOnClose}
        isOpen={upsertAddressModalIsOpen}
        loading={loading}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdateAddress}
        {...(!isAddressNew && { address: value })}
      />
      <AddressSelectionModal
        currentAddressId={value.id}
        addresses={userCurrentAddresses}
        onClose={addressSelectionModalOnClose}
        isOpen={addressSelectionModalIsOpen}
        loading={loading}
        onSubmit={handleSelectAddress}
      />
    </>
  );
};

ShippingAddress.defaultProps = {
  loading: false,
  isSubmitting: false,
  onChange: undefined
};
