import { FC, FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, BoxProps } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Camera, Flask } from 'phosphor-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from 'models';
import { StepsControl, Surface } from 'features/core/components';
import { UpsertCardStep1 } from './upsert-card-step-1.component';
import { UpsertCardStep2 } from './upsert-card-step-2.component';
import { UpsertCardStepDone } from './upsert-card-step-done.component';

type CardFormData = Omit<Card, 'slug' | 'attributes' | 'rarity' | 'category' | 'types'> & {
  offense: number;
  defense: number;
  cost: number;
  rarity: number;
  category: number;
  types: number[];
};

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (card: CardFormData) => void;
  loading?: boolean;
  isComplete?: boolean;
};

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  offense: z.number().int().nonnegative('Offense cannot be negative'),
  defense: z.number().int().nonnegative('Defense cannot be negative'),
  cost: z.number().int().nonnegative('Cost cannot be negative'),
  rarity: z.number().positive(),
  category: z.number().positive(),
  types: z.array(z.number().positive('Type is Required')).min(1, 'Type is Required'),
  image: z.any().optional(),
  coverImage: z.any().optional()
});

const defaultValues: CardFormData = {
  id: '0',
  name: '',
  description: '',
  offense: 0,
  defense: 0,
  cost: 0,
  rarity: 0,
  category: 0,
  types: [0]
};

const steps = [
  { label: 'Details', icon: Flask, Component: UpsertCardStep1 },
  { label: 'Images', icon: Camera, Component: UpsertCardStep2 }
];

const UpsertCardForm: FC<Props> = ({ onSubmit, loading, isComplete, ...moreProps }) => {
  const methods = useForm<CardFormData>({ defaultValues, resolver: zodResolver(schema) });
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

    submitForm(async (CardFormData: CardFormData) => {
      setStep(steps.length);
      onSubmit(CardFormData);
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
          submitLabel={!hasReachedLast ? 'Proceed' : 'Create Card'}
          submitButtonProps={{ w: '190px' }}
          onPrev={prevStep}
          onNext={nextStep}
          onReset={handleReset}
          onSubmit={handleSubmit}
          prevDisabled={activeStep === 0 || isComplete}
          nextDisabled={activeStep >= steps.length || isComplete}
          resetDisabled={isDirty || isComplete}
          submitDisabled={isComplete}
          loading={loading}
        />
      </Box>
    </FormProvider>
  );
};

UpsertCardForm.defaultProps = {
  loading: false,
  isComplete: false
};

export type { CardFormData };
export { UpsertCardForm };
