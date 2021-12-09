import { FC, FormEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, BoxProps, Button, Flex, InputRightElement, VStack } from '@chakra-ui/react';
import { Eye, EyeClosed, RocketLaunch } from 'phosphor-react';

import { AuthCredentials } from 'models';
import { Icon, IconButton, Input, SubHeading, Surface } from 'features/core/components';

const LABEL_WIDTH = '165px';

type UserFormData = AuthCredentials & {
  confirmPassword: string;
};

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (user: UserFormData) => void;
  loading?: boolean;
};

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6)
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords does not match',
    path: ['confirmPassword']
  });

const defaultValues: UserFormData = {
  email: '',
  password: '',
  confirmPassword: ''
};

const SignUpForm: FC<Props> = ({ loading, onSubmit, ...moreProps }) => {
  const { control, handleSubmit: submitForm } = useForm<UserFormData>({
    defaultValues,
    resolver: zodResolver(schema)
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    submitForm(async (userFormData: UserFormData) => {
      await onSubmit(userFormData);
    })();
  };

  return (
    <Box {...moreProps}>
      <Surface p={12} w='100%'>
        <VStack as='form' flex={1} spacing={4} onSubmit={handleSubmit}>
          <SubHeading pb={4}>
            Create an account using a valid email and set your password with a minimum of 6
            characters.
          </SubHeading>
          <Controller
            name='email'
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Email'
                error={errors && errors.email?.message}
                type='email'
                {...moreFields}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Password'
                error={errors && errors.password?.message}
                type={showPassword ? 'default' : 'password'}
                rightComponent={
                  <InputRightElement pr={4}>
                    <IconButton
                      aria-label='Show/Hide Password'
                      icon={
                        <Icon w={6} boxSizing='content-box' as={showPassword ? Eye : EyeClosed} />
                      }
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                }
                {...moreFields}
              />
            )}
          />
          <Controller
            name='confirmPassword'
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Confirm Password'
                error={errors && errors.confirmPassword?.message}
                type={showPassword ? 'default' : 'password'}
                {...moreFields}
              />
            )}
          />
        </VStack>
      </Surface>
      <Flex justifyContent='flex-end' mt={6}>
        <Button
          pl={6}
          pr={7}
          onClick={handleSubmit}
          leftIcon={<Icon w={6} as={RocketLaunch} />}
          isLoading={loading}
          type='submit'
        >
          Create Account
        </Button>
      </Flex>
    </Box>
  );
};

SignUpForm.defaultProps = {
  loading: false
};

export type { UserFormData };
export { SignUpForm };
