import { FC, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { WarningCircle, TrashSimple } from 'phosphor-react';

import { Icon } from './icon.component';

type Props = { onRemove: () => void };

export const RemoveButton: FC<Props> = ({ onRemove }) => {
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleCardRemove = () => {
    onRemove && onRemove();
    setConfirmRemove(false);
  };

  return confirmRemove ? (
    <Button
      px={5}
      color='orange.400'
      variant='ghost'
      size='xs'
      onClick={handleCardRemove}
      onBlur={() => setConfirmRemove(false)}
      leftIcon={<Icon w={6} as={WarningCircle} />}
    >
      Click again to remove
    </Button>
  ) : (
    <Button
      px={5}
      variant='ghost'
      size='sm'
      onClick={() => setConfirmRemove(true)}
      leftIcon={<Icon w={6} as={TrashSimple} />}
    >
      Remove
    </Button>
  );
};
