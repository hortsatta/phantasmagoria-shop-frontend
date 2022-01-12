import { FC, ReactElement, useState } from 'react';
import { WarningCircle, XCircle } from 'phosphor-react';

import { IconButton, Icon } from 'features/core/components';

type Props = {
  onClick: () => void;
  icon?: ReactElement;
  disabled?: boolean;
};

export const RemoveIconButton: FC<Props> = ({ onClick, icon, disabled }) => {
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRemove = () => {
    onClick && onClick();
    setConfirmRemove(false);
  };

  return confirmRemove ? (
    <IconButton
      aria-label='confirm remove'
      color='orange.400'
      icon={<Icon as={WarningCircle} w={7} />}
      onBlur={() => setConfirmRemove(false)}
      onClick={handleRemove}
      disabled={disabled}
    />
  ) : (
    <IconButton
      aria-label='remove'
      icon={icon || <Icon as={XCircle} w={7} />}
      onClick={() => setConfirmRemove(true)}
      disabled={disabled}
    />
  );
};

RemoveIconButton.defaultProps = {
  icon: undefined,
  disabled: false
};
