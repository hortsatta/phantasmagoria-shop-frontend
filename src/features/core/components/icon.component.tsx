import { ComponentProps, FC } from 'react';
import { Icon as ChIcon } from '@chakra-ui/react';
import variables from 'assets/styles/_variables.module.scss';

type Props = ComponentProps<typeof ChIcon> & {
  active?: boolean;
};

export const Icon: FC<Props> = ({ active, as: As, ...moreProps }) => (
  <ChIcon
    w='32px'
    h='32px'
    {...(active && { color: variables.primaryColor })}
    {...(As && { as: asProps => <As {...asProps} weight={active ? 'fill' : 'light'} /> })}
    {...moreProps}
  />
);

Icon.defaultProps = {
  active: false
};
