import { FC, ComponentProps } from 'react';

import { FormSectionHeading, Modal, Surface } from 'features/core/components';
import { CardFilters } from './card-filters.component';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  filters: any;
  onFiltersChange: any;
  headerLabel?: string;
  loading?: boolean;
};

export const CardFiltersModal: FC<Props> = ({
  filters,
  isOpen,
  loading,
  onClose,
  onFiltersChange,
  headerLabel
}) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '2xl' }} isCentered>
    <Surface flexDir='column' p={6}>
      <FormSectionHeading pt={0} w='100%'>
        {headerLabel}
      </FormSectionHeading>
      <CardFilters value={filters} loading={loading} onChange={onFiltersChange} />
    </Surface>
  </Modal>
);

CardFiltersModal.defaultProps = {
  headerLabel: 'Filters',
  loading: false
};
