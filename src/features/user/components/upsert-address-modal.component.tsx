import { ComponentProps, FC, useMemo } from 'react';

import { FormSectionHeading, Modal, Surface } from 'features/core/components';
import { AddressFormData, UpsertAddressForm } from './upsert-address-form.component';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  onSubmit: (data: AddressFormData) => void;
  headerLabel?: string;
  address?: AddressFormData;
  loading?: boolean;
  isSubmitting?: boolean;
};

export const UpsertAddressModal: FC<Props> = ({
  isOpen,
  onClose,
  headerLabel,
  address,
  loading,
  isSubmitting,
  onSubmit
}) => {
  const label = useMemo(() => {
    if (headerLabel) {
      return headerLabel;
    }

    return !address ? 'New Address' : 'Update Address';
  }, [headerLabel]);

  return (
    <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: 'xl' }} isCentered>
      <Surface flexDir='column' p={6}>
        <FormSectionHeading pt={0} w='100%'>
          {label}
        </FormSectionHeading>
        <UpsertAddressForm
          address={address}
          loading={loading}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
        />
      </Surface>
    </Modal>
  );
};

UpsertAddressModal.defaultProps = {
  headerLabel: undefined,
  address: undefined,
  loading: false,
  isSubmitting: false
};
