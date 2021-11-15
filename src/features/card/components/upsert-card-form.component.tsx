import { FC, FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, BoxProps } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from 'models';
import { StepsControl, Surface } from 'features/core/components';
import { UpsertCardStep1 } from './upsert-card-step-1.component';

import { Camera, Flask } from 'phosphor-react';

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: () => void;
  loading?: boolean;
};

type CardFormData = Omit<Card, 'slug' | 'attributes'> & {
  offense: number;
  defense: number;
  cost: number;
};

const schema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  offense: z.number().int(),
  defense: z.number().int(),
  cost: z.number().int(),
  rarity: z.number().positive(),
  category: z.number().positive(),
  type: z.array(z.number().positive('Type is Required')).min(1, 'Type is Required'),
  image: z.string().optional(),
  coverImage: z.string().optional()
});

const defaultValues: CardFormData = {
  id: 0,
  name: '',
  description: '',
  offense: 0,
  defense: 0,
  cost: 0,
  rarity: 0,
  category: 0,
  type: [0]
};

const steps = [
  { label: 'Details', icon: Flask, Component: UpsertCardStep1 },
  { label: 'Images', icon: Camera, Component: UpsertCardStep1 }
];

const UpsertCardForm: FC<Props> = ({ onSubmit, ...moreProps }) => {
  const methods = useForm<CardFormData>({ defaultValues, resolver: zodResolver(schema) });

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    submitForm(async (CardFormData: CardFormData) => {
      console.log(CardFormData);
      onSubmit();
    })();
  };

  const handleReset = () => {
    reset(defaultValues);
    resetSteps();
  };

  return (
    <FormProvider {...methods}>
      <Box {...moreProps}>
        <Steps onClickStep={step => setStep(step)} activeStep={activeStep}>
          {steps.map(({ Component, label, icon }) => (
            <Step key={label} label={label} icon={icon}>
              <Surface p={8}>
                <Component />
              </Surface>
            </Step>
          ))}
        </Steps>
        <StepsControl
          onPrev={prevStep}
          onNext={nextStep}
          onReset={handleReset}
          onSubmit={handleSubmit}
          prevDisabled={activeStep === 0}
          nextDisabled={activeStep >= steps.length}
          resetDisabled={isDirty}
        />
      </Box>
    </FormProvider>
  );
};

UpsertCardForm.defaultProps = {
  loading: false
};

export type { CardFormData };
export { UpsertCardForm };
