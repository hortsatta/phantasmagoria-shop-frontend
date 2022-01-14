import { ComponentProps, FC } from 'react';

import { Order } from 'models';
import { Modal, Surface } from 'features/core/components';
import { OrderItemDetail } from './order-item-detail.component';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  order: Order | null;
};

export const OrderItemDetailModal: FC<Props> = ({ order, isOpen, onClose }) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '3xl' }} isCentered>
    <Surface p={6} minW='xs' minH='xs'>
      {order && <OrderItemDetail mb={4} w='100%' id={order.id} />}
    </Surface>
  </Modal>
);
