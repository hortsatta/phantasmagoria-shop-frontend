import { FC } from 'react';
import Lottie from 'react-lottie-player';

import { SubHeading, Surface } from 'features/core/components';
import lottieSpoopy from 'assets/images/lottie-spoopy.json';
import lottieDone from 'assets/images/lottie-done.json';

type Props = {
  isComplete?: boolean;
};

const LOTTIE_STYLES = { marginTop: '-50px', width: '270px', height: '270px' };

export const UpsertCardStepDone: FC<Props> = ({ isComplete }) => (
  <Surface flexDir='column' justifyContent='center' alignItems='center' p={12}>
    {isComplete ? (
      <Lottie style={LOTTIE_STYLES} animationData={lottieDone} loop={false} play />
    ) : (
      <Lottie style={LOTTIE_STYLES} animationData={lottieSpoopy} play />
    )}
    <SubHeading w='70%' textAlign='center' lineHeight={1.2}>
      You&apos;re almost done, given you&apos;ve populated the required fields. Just tap the save
      button to complete the procedure.
    </SubHeading>
  </Surface>
);

UpsertCardStepDone.defaultProps = {
  isComplete: false
};
