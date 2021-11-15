import { FC, FormEvent } from 'react';
import { Button, ButtonGroup, Divider, Flex } from '@chakra-ui/react';
import { CaretCircleLeft, CaretCircleRight, Rewind, RocketLaunch } from 'phosphor-react';

import { Icon } from './icon.component';

type Props = {
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSubmit: (event: FormEvent) => void;
  prevDisabled: boolean;
  nextDisabled: boolean;
  resetDisabled: boolean;
  submitLabel?: string;
};

export const StepsControl: FC<Props> = ({
  onPrev,
  onNext,
  onReset,
  onSubmit,
  prevDisabled,
  nextDisabled,
  resetDisabled,
  submitLabel
}) => (
  <Flex justifyContent='space-between' mt={6} w='100%'>
    <ButtonGroup isAttached>
      <Button
        variant='ghost'
        onClick={onPrev}
        leftIcon={<Icon as={CaretCircleLeft} />}
        disabled={prevDisabled}
      >
        Prev
      </Button>
      <Divider opacity={0.2} orientation='vertical' />
      <Button
        variant='ghost'
        onClick={onNext}
        rightIcon={<Icon as={CaretCircleRight} />}
        disabled={nextDisabled}
      >
        Next
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button
        variant='ghost'
        onClick={onReset}
        leftIcon={<Icon as={Rewind} disabled={resetDisabled} />}
      >
        Reset
      </Button>
      <Button
        pl={6}
        pr={7}
        onClick={onSubmit}
        leftIcon={<Icon w={6} as={RocketLaunch} disabled={resetDisabled} />}
      >
        {submitLabel || 'Submit'}
      </Button>
    </ButtonGroup>
  </Flex>
);

StepsControl.defaultProps = {
  submitLabel: undefined
};
