import { FC, ComponentProps } from 'react';
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react';

type Props = ModalProps & {
  modalContentProps?: ModalContentProps;
};

export const Modal: FC<Props> = ({ modalContentProps, children, ...moreProps }) => (
  <ChakraModal isCentered {...moreProps}>
    <ModalOverlay />
    <ModalContent bg='rgba(0,0,0,0)' {...modalContentProps}>
      <ModalCloseButton _focus={{ boxShadow: 0 }} />
      <ModalBody p={0}>{children}</ModalBody>
    </ModalContent>
  </ChakraModal>
);

Modal.defaultProps = {
  modalContentProps: undefined
};
