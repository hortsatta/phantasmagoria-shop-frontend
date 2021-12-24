import { FC, FormEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, BoxProps, Button, Divider, Flex, InputRightElement, Stack } from '@chakra-ui/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeClosed } from 'phosphor-react';

import { AuthCredentials } from 'models';
import { Icon, IconButton, Input } from 'features/core/components';

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (identifier: string, password: string) => Promise<void>;
  loading?: boolean;
};

type FormData = AuthCredentials;

const LABEL_WIDTH = '105px';

const schema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(1, 'Password is empty')
});

const defaultValues: FormData = {
  email: '',
  password: ''
};

export const SignInForm: FC<Props> = ({ loading, onSubmit, ...moreProps }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit: submitForm, control } = useForm<FormData>({
    shouldFocusError: false,
    defaultValues,
    resolver: zodResolver(schema)
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    submitForm(async (formData: FormData) => {
      const { email, password } = formData;
      onSubmit(email, password);
    })();
  };

  return (
    <Box {...moreProps}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <Controller
            name='email'
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...moreField }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Email'
                error={errors && errors.email?.message}
                {...moreField}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { ref, ...moreField }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                type={showPassword ? 'text' : 'password'}
                error={errors && errors.password?.message}
                leftComponent='Password'
                rightComponent={
                  <InputRightElement pr={4}>
                    <IconButton
                      opacity={0.6}
                      aria-label='show/hide password'
                      icon={
                        <Icon w={7} boxSizing='content-box' as={showPassword ? Eye : EyeClosed} />
                      }
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                }
                {...moreField}
              />
            )}
          />
        </Stack>
        <Flex flexDir='column' alignItems='center'>
          <Divider my={8} w='90%' />
          <Button w='100%' type='submit' isLoading={loading}>
            Sign Me In
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

SignInForm.defaultProps = {
  loading: false
};
