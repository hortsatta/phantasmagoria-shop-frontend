import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, BoxProps } from '@chakra-ui/react';
import { Step, Steps, useSteps } from 'chakra-ui-steps';
import { Camera, Flask } from 'phosphor-react';

import { Card, CardType } from 'models';
import { RemoveButton, StepsControl, Surface } from 'features/core/components';
import { UpsertCardStep1 } from './upsert-card-step-1.component';
import { UpsertCardStep2 } from './upsert-card-step-2.component';
import { UpsertCardStepDone } from './upsert-card-step-done.component';

type CardFormData = Omit<Card, 'slug' | 'attr' | 'rarity' | 'category' | 'types'> & {
  offense: number;
  defense: number;
  cost: number;
  rarity: number;
  category: number;
  types: number[];
};

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (card: CardFormData) => void;
  onRemove?: () => void;
  card?: Card;
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
  isActive: z.boolean(),
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
  types: [0],
  isActive: true
};

const steps = [
  { label: 'Details', icon: Flask, Component: UpsertCardStep1 },
  { label: 'Images', icon: Camera, Component: UpsertCardStep2 }
];

const UpsertCardForm: FC<Props> = ({
  onSubmit,
  onRemove,
  card,
  loading,
  isComplete,
  ...moreProps
}) => {
  // Replace default values if card parameter is present
  const currentCard = useMemo(() => {
    if (!card) {
      return defaultValues;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { attr, rarity, category, types, slug, image, coverImage, ...moreCard } = card;

    return {
      ...moreCard,
      ...attr,
      rarity: parseInt(rarity.id, 10),
      category: parseInt(category.id, 10),
      types: types.map((type: CardType) => parseInt(type.id, 10)),
      ...(image && { image: image.url }),
      ...(coverImage && { coverImage: coverImage.url })
    };
  }, [card]);

  const methods = useForm<CardFormData>({
    shouldFocusError: false,
    defaultValues: currentCard,
    resolver: zodResolver(schema)
  });

  const [hasReachedLast, setHasReachedLast] = useState(false);
  const submitLabel = useMemo(() => {
    if (!hasReachedLast) {
      return 'Proceed';
    }

    return card ? 'Update Card' : 'Create Card';
  }, [card, hasReachedLast]);

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

    submitForm(async (cardFormData: CardFormData) => {
      setStep(steps.length);
      await onSubmit(cardFormData);
    })();
  };

  const handleReset = () => {
    setHasReachedLast(false);
    reset(currentCard);
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
          submitLabel={submitLabel}
          submitButtonProps={{ w: '190px' }}
          onPrev={prevStep}
          onNext={nextStep}
          onReset={handleReset}
          onSubmit={handleSubmit}
          prevDisabled={activeStep === 0 || isComplete}
          nextDisabled={activeStep >= steps.length || isComplete}
          resetDisabled={!isDirty || isComplete}
          submitDisabled={isComplete}
          loading={loading}
          {...(onRemove && { leftElement: <RemoveButton onRemove={onRemove} /> })}
        />
      </Box>
    </FormProvider>
  );
};

UpsertCardForm.defaultProps = {
  onRemove: undefined,
  card: undefined,
  loading: false,
  isComplete: false
};

export type { CardFormData };
export { UpsertCardForm };
