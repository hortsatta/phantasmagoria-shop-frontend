import { FC, FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, BoxProps } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Camera, Flask } from 'phosphor-react';

import { CardProduct } from 'models';
import { StepsControl, Surface } from 'features/core/components';
import { UpsertCardProductStep1 } from './upsert-card-product-step-1.component';
import { UpsertCardProductStep2 } from './upsert-card-product-step-2.component';
import { UpsertCardStepDone } from './upsert-card-step-done.component';

type CardProductFormData = Omit<CardProduct, 'slug'>;

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (card: CardProductFormData) => void;
  loading?: boolean;
  isComplete?: boolean;
};

const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative('Cost cannot be negative'),
  cards: z.array(z.object({})).min(1, 'Must select at least 1 card'),
  image: z.any().optional()
});

const defaultValues: CardProductFormData = {
  id: '0',
  name: '',
  description: '',
  price: 0,
  cards: []
};

const steps = [
  { label: 'Cards', icon: Flask, Component: UpsertCardProductStep1 },
  { label: 'Details', icon: Camera, Component: UpsertCardProductStep2 }
];

const UpsertCardProductForm: FC<Props> = ({ onSubmit, loading, isComplete, ...moreProps }) => {
  const methods = useForm<CardProductFormData>({ defaultValues, resolver: zodResolver(schema) });
  const [hasReachedLast, setHasReachedLast] = useState(false);

  const {
    nextStep,
    prevStep,
    reset: resetSteps,
    activeStep,
    setStep
  } = useSteps({ initialStep: 0 });

  const {
    formState: { isDirty },
    handleSubmit: submitForm,
    reset
  } = methods;

  useEffect(() => {
    if (activeStep < steps.length) {
      return;
    }
    setHasReachedLast(true);
  }, [activeStep]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!hasReachedLast) {
      nextStep();
      return;
    }

    submitForm(async (cardProductFormData: CardProductFormData) => {
      setStep(steps.length);
      await onSubmit(cardProductFormData);
    })();
  };

  const handleReset = () => {
    setHasReachedLast(false);
    reset(defaultValues);
    resetSteps();
  };

  return (
    <FormProvider {...methods}>
      <Box {...moreProps}>
        <Steps onClickStep={step => setStep(step)} activeStep={activeStep}>
          {steps.map(({ Component, label, icon }) => (
            <Step key={label} label={label} icon={icon}>
              <Surface p={12}>
                <Component />
              </Surface>
            </Step>
          ))}
        </Steps>
        {activeStep >= steps.length && <UpsertCardStepDone isComplete={isComplete} />}
        <StepsControl
          submitLabel={!hasReachedLast ? 'Proceed' : 'Create Shop Item'}
          submitButtonProps={{ w: '220px' }}
          onPrev={prevStep}
          onNext={nextStep}
          onReset={handleReset}
          onSubmit={handleSubmit}
          prevDisabled={activeStep === 0 || isComplete}
          nextDisabled={activeStep >= steps.length || isComplete}
          resetDisabled={!isDirty || isComplete}
          submitDisabled={isComplete}
          loading={loading}
        />
      </Box>
    </FormProvider>
  );
};

UpsertCardProductForm.defaultProps = {
  loading: false,
  isComplete: false
};

export type { CardProductFormData };
export { UpsertCardProductForm };
