import { FC, ReactNode } from 'react';
import {
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalContentProps,
  ModalFooter,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react';

type Props = ModalProps & {
  modalContentProps?: ModalContentProps;
  footerComponent?: ReactNode;
};

export const Modal: FC<Props> = ({
  modalContentProps,
  footerComponent,
  children,
  ...moreProps
}) => (
  <ChakraModal isCentered {...moreProps}>
    <ModalOverlay />
    <ModalContent bg='rgba(0,0,0,0)' {...modalContentProps}>
      <ModalCloseButton _focus={{ boxShadow: 0 }} />
      <ModalBody p={0}>{children}</ModalBody>
      {footerComponent && <ModalFooter>{footerComponent}</ModalFooter>}
    </ModalContent>
  </ChakraModal>
);

Modal.defaultProps = {
  modalContentProps: undefined,
  footerComponent: undefined
};
