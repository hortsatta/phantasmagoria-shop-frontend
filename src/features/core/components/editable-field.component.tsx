import { FC, useCallback, useState } from 'react';
import {
  Box,
  BoxProps,
  Divider,
  Editable,
  EditablePreview,
  EditableProps,
  EditableInput,
  TextProps,
  Text,
  useEditableControls,
  ButtonGroup,
  Flex
} from '@chakra-ui/react';
import { CheckCircle, PenNib, XCircle } from 'phosphor-react';

import { Icon } from './icon.component';
import { IconButton } from './icon-button.component';

import variables from 'assets/styles/_variables.module.scss';

type Props = EditableProps & {
  label?: string;
  wrapperProps?: BoxProps;
  labelProps?: TextProps;
  onSubmit?: (val: string) => void;
};

type EditableControlsProps = {
  onSubmit?: () => void;
  onCancel?: () => void;
};

const iconProps: any = {
  w: '100%',
  h: '100%',
  boxSizing: 'content-box'
};

const EditableControls: FC<EditableControlsProps> = ({ onSubmit, onCancel }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } =
    useEditableControls();

  const getSubmitProps: any = useCallback(() => {
    const { ref, onClick, ...moreProps }: any = getSubmitButtonProps() || {};

    const handleClick = () => {
      onSubmit && onSubmit();
      onClick && onClick();
    };

    return {
      onClick: handleClick,
      ...moreProps
    };
  }, [getSubmitButtonProps, onSubmit]);

  const getCancelProps: any = useCallback(() => {
    const { ref, onClick, ...moreProps }: any = getCancelButtonProps() || {};

    const handleClick = () => {
      onCancel && onCancel();
      onClick && onClick();
    };

    return {
      onClick: handleClick,
      ...moreProps
    };
  }, [getCancelButtonProps, onCancel]);

  const getEditProps: any = useCallback(() => {
    const { ref, ...moreProps }: any = getEditButtonProps() || {};
    return moreProps;
  }, [getEditButtonProps]);

  return isEditing ? (
    <ButtonGroup justifyContent='center' size='xs'>
      <IconButton icon={<Icon {...iconProps} as={CheckCircle} />} {...getSubmitProps()} />
      <IconButton icon={<Icon {...iconProps} as={XCircle} />} {...getCancelProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent='center'>
      <IconButton size='xs' icon={<Icon {...iconProps} as={PenNib} />} {...getEditProps()} />
    </Flex>
  );
};

export const EditableField: FC<Props> = ({
  label,
  defaultValue,
  wrapperProps,
  labelProps,
  onSubmit,
  ...moreProps
}) => {
  const [value, setValue] = useState(defaultValue || '');

  const handleCancel = useCallback(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  return (
    <Box
      px={4}
      py={3}
      bgColor={variables.inputBgColor}
      borderRadius='4px'
      overflow='hidden'
      {...wrapperProps}
    >
      <Editable
        d='flex'
        justifyContent='space-between'
        alignItems='flex-end'
        lineHeight={1}
        defaultValue={defaultValue}
        submitOnBlur={false}
        isPreviewFocusable={false}
        {...moreProps}
      >
        <Box flex={1} mr={2}>
          <EditablePreview p={0} lineHeight={1} />
          <EditableInput
            px={2}
            bgColor={variables.inputBgFocusColor}
            borderWidth={0}
            outline={0}
            outlineOffset={0}
            borderRadius='2px'
            onChange={(val: any) => setValue(val)}
          />
        </Box>
        <EditableControls onSubmit={() => onSubmit && onSubmit(value)} onCancel={handleCancel} />
      </Editable>
      <Divider my={2} bgColor='rgba(255,255,255,0.1)' />
      <Text
        color='rgba(255,255,255,0.7)'
        fontSize={12}
        textTransform='uppercase'
        lineHeight={1}
        {...labelProps}
      >
        {label}
      </Text>
    </Box>
  );
};

EditableControls.defaultProps = {
  onSubmit: undefined,
  onCancel: undefined
};

EditableField.defaultProps = {
  label: '',
  wrapperProps: undefined,
  labelProps: undefined,
  onSubmit: undefined
};
