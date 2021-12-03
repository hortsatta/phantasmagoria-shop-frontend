import { FC } from 'react';
import { Box, useRadio } from '@chakra-ui/react';
import { Circle, CheckCircle } from 'phosphor-react';

import variables from 'assets/styles/_variables.module.scss';

export const Radio: FC = ({ children, ...moreProps }) => {
  const { getInputProps, getCheckboxProps } = useRadio(moreProps);
  const input: any = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box w='100%' as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        pl='8px'
        pr='12px'
        py='3px'
        d='flex'
        alignItems='center'
        bgColor='none'
        borderRadius='2px'
        boxShadow='md'
        cursor='pointer'
        transition='all 0.2s ease'
        _checked={{ bgColor: variables.accentColor }}
        _hover={{ color: input.checked ? variables.textColor : variables.primaryColor }}
      >
        <Box mr={2}>{input.checked ? <CheckCircle weight='bold' /> : <Circle weight='bold' />}</Box>
        {children}
      </Box>
    </Box>
  );
};
