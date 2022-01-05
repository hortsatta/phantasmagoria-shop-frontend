import { FC, FormEvent, useCallback, useEffect, useMemo } from 'react';
import { Box, BoxProps, Button, ButtonGroup, Center, Spinner, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Rewind, RocketLaunch } from 'phosphor-react';

import { Address, SelectOption } from 'models';
import {
  usePhLocationRegion,
  usePhLocationProvince,
  usePhLocationCity,
  usePhLocationBarangay
} from 'features/user/hooks';
import { Icon, Input, NumberInput, Select } from 'features/core/components';

import variables from 'assets/styles/_variables.module.scss';

const LABEL_WIDTH = '125px';

type AddressFormData = Omit<Address, 'zipCode'> & {
  zipCode: null | number;
};

type Props = Omit<BoxProps, 'onSubmit'> & {
  onSubmit: (data: AddressFormData) => void;
  address?: AddressFormData;
  loading?: boolean;
  isSubmitting?: boolean;
};

const schema = z.object({
  id: z.string(),
  fullName: z.string().min(1),
  phoneNumber: z.string().min(6),
  region: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  barangay: z.string().min(1),
  zipCode: z.number().min(3),
  addressLine: z.string().min(1),
  isDefault: z.boolean()
});

const defaultValues: AddressFormData = {
  id: '0',
  fullName: '',
  phoneNumber: '',
  region: '',
  province: '',
  city: '',
  barangay: '',
  zipCode: null,
  addressLine: '',
  isDefault: false
};

const UpsertAddressForm: FC<Props> = ({
  address,
  loading: formLoading,
  isSubmitting,
  onSubmit,
  ...moreProps
}) => {
  const currentAddress = useMemo(() => address || defaultValues, [address]);

  const {
    control,
    handleSubmit: submitForm,
    setValue,
    reset,
    watch,
    formState: { dirtyFields }
  } = useForm<AddressFormData>({
    shouldFocusError: false,
    defaultValues: currentAddress,
    resolver: zodResolver(schema)
  });

  const submitLabel = useMemo(() => (address ? 'Update Address' : 'Create Address'), [address]);

  // Watch region, province, and city/municipality value change
  const regionCode = watch('region');
  const provinceCode = watch('province');
  const cityCode = watch('city');

  const { phRegionOptions } = usePhLocationRegion();
  const { phProvinceOptions, loading: phProvinceLoading } = usePhLocationProvince(regionCode);
  const { phCityOptions, loading: phCityLoading } = usePhLocationCity(provinceCode);
  const { phBarangayOptions, loading: phBarangayLoading } = usePhLocationBarangay(cityCode);

  const loading = useMemo(
    () => formLoading || (phBarangayLoading && !Object.keys(dirtyFields).length),
    [formLoading, phBarangayLoading, dirtyFields]
  );

  // Clear current ph location values when code changes
  useEffect(() => {
    const { region } = dirtyFields || {};

    if (!region) {
      return;
    }

    setValue('province', '');
    setValue('city', '');
    setValue('barangay', '');
  }, [regionCode]);

  useEffect(() => {
    const { province } = dirtyFields || {};

    if (!province) {
      return;
    }

    setValue('city', '');
    setValue('barangay', '');
  }, [provinceCode]);

  useEffect(() => {
    const { city } = dirtyFields || {};

    if (!city) {
      return;
    }

    setValue('barangay', '');
  }, [cityCode]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      submitForm((addressFormData: AddressFormData) => {
        onSubmit(addressFormData);
      })();
    },
    [submitForm, onSubmit]
  );

  return (
    <Box as='form' pos='relative' onSubmit={handleSubmit} {...moreProps}>
      {loading && (
        <Center
          top={0}
          left={0}
          pos='absolute'
          d='flex'
          w='100%'
          h='100%'
          alignItems='center'
          bgColor={variables.surfaceColor}
          zIndex={2}
        >
          <Spinner size='xl' />
        </Center>
      )}
      <VStack spacing={4}>
        <Controller
          name='fullName'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
            <Input
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Full Name'
              error={errors && errors?.fullName?.message}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='region'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Region'
              options={phRegionOptions}
              value={
                phRegionOptions.find((item: SelectOption) => item.value === value) || {
                  value: ''
                }
              }
              error={errors && errors?.region?.message}
              onChange={(val: any) => onChange(val.value)}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='province'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Province'
              options={phProvinceOptions}
              value={
                phProvinceOptions.find((item: SelectOption) => item.value === value) || {
                  value: ''
                }
              }
              error={errors && errors?.province?.message}
              onChange={(val: any) => onChange(val.value)}
              isLoading={phProvinceLoading}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='city'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='City / Munici.'
              options={phCityOptions}
              value={
                phCityOptions.find((item: SelectOption) => item.value === value) || { value: '' }
              }
              error={errors && errors?.city?.message}
              onChange={(val: any) => onChange(val.value)}
              isLoading={phCityLoading}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='barangay'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, onChange, value, ...moreFields }, formState: { errors } }) => (
            <Select
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Barangay'
              options={phBarangayOptions}
              value={
                phBarangayOptions.find((item: SelectOption) => item.value === value) || {
                  value: ''
                }
              }
              error={errors && errors?.barangay?.message}
              onChange={(val: any) => onChange(val.value)}
              isLoading={phBarangayLoading}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='addressLine'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
            <Input
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Line'
              placeholder='Street Name, Building, House No.'
              error={errors && errors?.addressLine?.message}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='zipCode'
          control={control}
          render={({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            field: { onChange, value, ref, ...moreFields },
            formState: { errors }
          }) => (
            <NumberInput
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Zip Code'
              error={errors && errors?.zipCode?.message}
              onChange={val => onChange(!val.trim() ? 0 : parseInt(val, 10))}
              value={value || undefined}
              {...moreFields}
            />
          )}
        />
        <Controller
          name='phoneNumber'
          control={control}
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field: { ref, ...moreFields }, formState: { errors } }) => (
            <Input
              inputLeftAddonProps={{ w: LABEL_WIDTH }}
              leftComponent='Phone No.'
              error={errors && errors?.phoneNumber?.message}
              {...moreFields}
            />
          )}
        />
      </VStack>
      <ButtonGroup
        w='100%'
        justifyContent='space-between'
        alignItems='center'
        flex={1}
        mt={6}
        isDisabled
      >
        <Button
          variant='ghost'
          leftIcon={<Icon as={Rewind} />}
          onClick={() => reset(currentAddress)}
          disabled={loading || isSubmitting}
        >
          Reset
        </Button>
        <Button
          pl={6}
          pr={7}
          w='190px'
          onClick={handleSubmit}
          leftIcon={<Icon w={6} as={RocketLaunch} />}
          isLoading={loading || isSubmitting}
          disabled={loading || isSubmitting}
        >
          {submitLabel}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

UpsertAddressForm.defaultProps = {
  address: undefined,
  loading: false,
  isSubmitting: false
};

export type { AddressFormData };
export { UpsertAddressForm };
