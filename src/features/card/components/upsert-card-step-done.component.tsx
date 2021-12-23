import { FC, useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

import { SubHeading, Surface } from 'features/core/components';
import lottieSpoopy from 'assets/images/lottie-spoopy.json';
import lottieDone from 'assets/images/lottie-done.json';

type Props = {
  isComplete?: boolean;
};

const LOTTIE_STYLES = { marginTop: '-50px', width: '270px', height: '270px' };

const LottieSpoopy: FC = () => {
  const [reverse, setReverse] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current?.setSpeed(0.5);
  }, []);

  useEffect(() => {
    reverse ? ref.current?.playSegments([38, 65], true) : ref.current?.playSegments([65, 38], true);
  }, [reverse]);

  return (
    <Lottie
      style={LOTTIE_STYLES}
      animationData={lottieSpoopy}
      lottieRef={ref}
      onComplete={() => setReverse(!reverse)}
      autoPlay={false}
      loop={false}
    />
  );
};

export const UpsertCardStepDone: FC<Props> = ({ isComplete }) => (
  <Surface flexDir='column' justifyContent='center' alignItems='center' p={12}>
    {isComplete ? (
      <Lottie style={LOTTIE_STYLES} animationData={lottieDone} loop={false} />
    ) : (
      <LottieSpoopy />
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
