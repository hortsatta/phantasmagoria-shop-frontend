import { FC } from 'react';
import { Divider as CRDivider, DividerProps } from '@chakra-ui/react';

export const Divider: FC<DividerProps> = props => <CRDivider opacity={0.06} {...props} />;
