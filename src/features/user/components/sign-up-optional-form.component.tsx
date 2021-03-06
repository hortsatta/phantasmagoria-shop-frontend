import { FC, FormEvent, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, BoxProps, Button, ButtonGroup, Flex, HStack, VStack } from '@chakra-ui/react';
import { Rewind, RocketLaunch, SkipForward } from 'phosphor-react';
import Lottie from 'react-lottie-player';

import { Address, SelectOption, UserAccount } from 'models';
import {
  FormSectionHeading,
  Icon,
  Input,
  NumberInput,
  Select,
  SubHeading,
  Surface
} from 'features/core/components';

import lottieDone from 'assets/images/lottie-done.json';
import {
  usePhLocationRegion,
  usePhLocationProvince,
  usePhLocationCity,
  usePhLocationBarangay
} from '../hooks';

const LABEL_WIDTH = '125px';

type AddressFormData = Omit<Address, 'id' | 'fullName' | 'zipCode'> & {
  zipCode: null | number;
};

type UserOptionalFormData = Omit<UserAccount, 'id' | 'user' | 'addresses'> & AddressFormData;

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (data: UserOptionalFormData) => void;
  onSkip?: () => void;
  loading?: boolean;
};

const schema = z.object({
  displayName: z.string(),
  fullName: z.string(),
  phoneNumber: z.string().min(6),
  region: z.string(),
  province: z.string(),
  city: z.string(),
  barangay: z.string(),
  zipCode: z.number().min(3),
  addressLine: z.string(),
  isDefault: z.boolean()
});

const defaultValues: UserOptionalFormData = {
  displayName: '',
  fullName: '',
  phoneNumber: '',
  region: '',
  province: '',
  city: '',
  barangay: '',
  zipCode: null,
  addressLine: '',
  isDefault: true
};

const SignUpOptionalForm: FC<Props> = ({ loading, onSkip, onSubmit, ...moreProps }) => {
  const {
    control,
    handleSubmit: submitForm,
    watch,
    reset,
    setValue
  } = useForm<UserOptionalFormData>({
    defaultValues,
    resolver: zodResolver(schema)
  });
  // Watch region, province, and city/municipality value change
  const regionCode = watch('region');
  const provinceCode = watch('province');
  const cityCode = watch('city');

  const { phRegionOptions } = usePhLocationRegion();
  const { phProvinceOptions, loading: phProvinceLoading } = usePhLocationProvince(regionCode);
  const { phCityOptions, loading: phCityLoading } = usePhLocationCity(provinceCode);
  const { phBarangayOptions, loading: phBarangayLoading } = usePhLocationBarangay(cityCode);

  // Clear current ph location values when code changes
  useEffect(() => {
    setValue('province', '');
    setValue('city', '');
    setValue('barangay', '');
  }, [regionCode]);

  useEffect(() => {
    setValue('city', '');
    setValue('barangay', '');
  }, [provinceCode]);

  useEffect(() => {
    setValue('barangay', '');
  }, [cityCode]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    submitForm(async (data: UserOptionalFormData) => {
      await onSubmit(data);
    })();
  };

  return (
    <Box {...moreProps}>
      <Surface p={12} w='100%'>
        <VStack as='form' onSubmit={handleSubmit} spacing={4}>
          <Flex mt='-20px' alignItems='center'>
            <Lottie
              style={{ flexShrink: 0, marginRight: '8px', width: '120px', height: '120px' }}
              animationData={lottieDone}
              loop={false}
              play
            />
            <SubHeading>
              Your account has been created! Add an address or continue to the shop.
            </SubHeading>
          </Flex>
          <Controller
            name='displayName'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Display Name'
                error={errors && errors.displayName?.message}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name='fullName'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Full Name'
                error={errors && errors.fullName?.message}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          <FormSectionHeading pb={0} w='100%'>
            Address
          </FormSectionHeading>
          <Controller
            name='region'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Select
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Region'
                options={phRegionOptions}
                value={
                  phRegionOptions.find((item: SelectOption) => item.value === value) || {
                    value: ''
                  }
                }
                name={name}
                onBlur={onBlur}
                onChange={(val: any) => onChange(val.value)}
                error={errors && errors.region?.message}
              />
            )}
          />
          <Controller
            name='province'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Select
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Province'
                options={phProvinceOptions}
                value={
                  phProvinceOptions.find((item: SelectOption) => item.value === value) || {
                    value: ''
                  }
                }
                name={name}
                onBlur={onBlur}
                onChange={(val: any) => onChange(val.value)}
                error={errors && errors.province?.message}
                isLoading={phProvinceLoading}
              />
            )}
          />
          <Controller
            name='city'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Select
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='City / Munici.'
                options={phCityOptions}
                value={
                  phCityOptions.find((item: SelectOption) => item.value === value) || { value: '' }
                }
                name={name}
                onBlur={onBlur}
                onChange={(val: any) => onChange(val.value)}
                error={errors && errors.city?.message}
                isLoading={phCityLoading}
              />
            )}
          />
          <Controller
            name='barangay'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Select
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Barangay'
                options={phBarangayOptions}
                value={
                  phBarangayOptions.find((item: SelectOption) => item.value === value) || {
                    value: ''
                  }
                }
                name={name}
                onBlur={onBlur}
                onChange={(val: any) => onChange(val.value)}
                error={errors && errors.barangay?.message}
                isLoading={phBarangayLoading}
              />
            )}
          />
          <Controller
            name='addressLine'
            control={control}
            render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
              <Input
                inputLeftAddonProps={{ w: LABEL_WIDTH }}
                leftComponent='Line'
                placeholder='Street Name, Building, House No.'
                error={errors && errors.addressLine?.message}
                name={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
            )}
          />
          <HStack spacing={4}>
            <Controller
              name='zipCode'
              control={control}
              render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
                <NumberInput
                  inputLeftAddonProps={{ w: LABEL_WIDTH }}
                  leftComponent='Zip Code'
                  name={name}
                  value={value || undefined}
                  onBlur={onBlur}
                  onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
                  error={errors && errors.zipCode?.message}
                />
              )}
            />
            <Controller
              name='phoneNumber'
              control={control}
              render={({ field: { onChange, onBlur, value, name }, formState: { errors } }) => (
                <Input
                  inputLeftAddonProps={{ w: LABEL_WIDTH }}
                  leftComponent='Phone No.'
                  error={errors && errors.phoneNumber?.message}
                  name={name}
                  value={value}
                  onBlur={onBlur}
                  onChange={onChange}
                />
              )}
            />
          </HStack>
        </VStack>
      </Surface>
      <Flex justifyContent='space-between' mt={6} w='100%'>
        <Button
          variant='ghost'
          onClick={() => reset(defaultValues)}
          leftIcon={<Icon as={Rewind} />}
          isLoading={loading}
        >
          Reset
        </Button>
        <ButtonGroup>
          <Button
            variant='ghost'
            onClick={onSkip}
            leftIcon={<Icon as={SkipForward} />}
            isLoading={loading}
          >
            Skip
          </Button>
          <Button
            pl={6}
            pr={7}
            onClick={handleSubmit}
            leftIcon={<Icon w={6} as={RocketLaunch} />}
            isLoading={loading}
          >
            Save Details
          </Button>
        </ButtonGroup>
      </Flex>
    </Box>
  );
};

SignUpOptionalForm.defaultProps = {
  onSkip: undefined,
  loading: false
};

export type { UserOptionalFormData };
export { SignUpOptionalForm };
