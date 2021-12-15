import { FC, ComponentProps } from 'react';
import { CardDetail } from './card-detail.component';

import { Card } from 'models';
import { Modal, Surface } from 'features/core/components';

type ModalProps = Omit<ComponentProps<typeof Modal>, 'children'>;

type Props = ModalProps & {
  card: Card | null;
};

export const CardDetailModal: FC<Props> = ({ card, isOpen, onClose }) => (
  <Modal onClose={onClose} isOpen={isOpen} modalContentProps={{ maxW: '2xl' }} isCentered>
    <Surface p={6} minW='xs' minH='xs'>
      {card && <CardDetail id={card.id} />}
    </Surface>
  </Modal>
);
