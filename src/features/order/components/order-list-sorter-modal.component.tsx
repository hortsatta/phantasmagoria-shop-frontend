import { ComponentProps, FC } from 'react';

import { Modal, Surface, FormSectionHeading } from 'features/core/components';
import { OrderListSorter } from './order-list-sorter.component';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  sort: any;
  onSortChange: any;
  headerLabel?: string;
  loading?: boolean;
};

export const OrderListSorterModal: FC<Props> = ({
  sort,
  isOpen,
  loading,
  onClose,
  onSortChange,
  headerLabel
}) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: 'md' }} isCentered>
    <Surface flexDir='column' p={6}>
      <FormSectionHeading pt={0} w='100%'>
        {headerLabel}
      </FormSectionHeading>
      <OrderListSorter value={sort} loading={loading} onChange={onSortChange} />
    </Surface>
  </Modal>
);

OrderListSorterModal.defaultProps = {
  headerLabel: 'Sort Purchases',
  loading: false
};
