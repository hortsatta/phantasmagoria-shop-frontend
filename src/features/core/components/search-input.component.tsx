import { FC, ReactNode } from 'react';
import { Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react';
import { Planet } from 'phosphor-react';

import { Icon } from './icon.component';

type Props = InputProps & {
  rightComponent?: ReactNode;
};

export const SearchInput: FC<Props> = ({ rightComponent, ...moreProps }) => (
  <InputGroup borderRadius={999} overflow='hidden'>
    <InputLeftElement px={3} height='100%' boxSizing='content-box' pointerEvents='none'>
      <Icon as={Planet} w={6} opacity={0.7} />
    </InputLeftElement>
    <Input pl={14} h='44px' placeholder='Find an entity...' {...moreProps} />
    {rightComponent}
  </InputGroup>
);

SearchInput.defaultProps = {
  rightComponent: undefined
};
