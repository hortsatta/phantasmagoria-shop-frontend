import { FC, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, BoxProps, VStack } from '@chakra-ui/react';

import { Address, UserAccount } from 'models';
import { useNotification } from 'features/core/hooks';
import { EditableField, FormSectionHeading, TextField } from 'features/core/components';
import { ShippingAddress } from './shipping-address.component';

import variables from 'assets/styles/_variables.module.scss';

type UserAccountFormData = Omit<UserAccount, 'user' | 'addresses'> & {
  address: any;
};

type Props = Omit<BoxProps, 'onSubmit'> & {
  onUpdateUserAccount: (userAccountFormData: UserAccountFormData) => void;
  onUpdateAddress: (addresses: any[]) => Promise<void>;
  userAccount?: UserAccount;
  loading?: boolean;
};

const wrapperFieldProps = {
  wrapperProps: { w: '100%', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }
};

const schema = z.object({
  id: z.string(),
  fullName: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  address: z.object({
    id: z.string(),
    fullName: z.string(),
    phoneNumber: z.string().min(6),
    region: z.string(),
    province: z.string(),
    city: z.string(),
    barangay: z.string(),
    zipCode: z.number().min(3),
    addressLine: z.string(),
    isDefault: z.boolean()
  })
});

const defaultValues = {
  id: '',
  fullName: '',
  displayName: '',
  address: {}
};

export const EditUserAccountForm: FC<Props> = ({
  userAccount,
  loading,
  onUpdateUserAccount,
  onUpdateAddress,
  ...moreProps
}) => {
  const { notify } = useNotification();
  const { user, addresses: userCurrentAddresses = [] } = userAccount || {};

  const currentUserAccount = useMemo(() => {
    if (!userAccount) {
      return defaultValues;
    }

    const { id, fullName, displayName, addresses = [] } = userAccount || {};
    const address = addresses.find((a: Address) => a.isDefault);

    return { id, fullName, displayName, address };
  }, [userAccount]);

  const { control, watch } = useForm<UserAccountFormData>({
    defaultValues: currentUserAccount,
    resolver: zodResolver(schema)
  });

  const fullName = watch('fullName');
  const displayName = watch('displayName');
  const address = watch('address');

  const handleRemoveAddress = useCallback(
    (targetAddress: Address) => {
      if (address.id === targetAddress.id) {
        notify('error', 'Failed', 'Address is currently set as default.');
        return;
      }

      const newAddresses = userCurrentAddresses.filter(ca => ca.id !== targetAddress.id);
      onUpdateAddress(newAddresses);
    },
    [userCurrentAddresses, address]
  );

  useEffect(() => {
    const ua: any = { id: userAccount?.id, fullName, displayName };
    onUpdateUserAccount(ua);
  }, [userAccount, fullName, displayName]);

  useEffect(() => {
    if (address.id === undefined || !Number(address.id)) {
      return;
    }

    const defaultAddress = userCurrentAddresses.find(ca => ca.isDefault);

    if (defaultAddress?.id === address.id) {
      return;
    }

    onUpdateAddress(userCurrentAddresses.map(ca => ({ ...ca, isDefault: ca.id === address.id })));
  }, [address]);

  return (
    <Box as='form' {...moreProps}>
      <VStack justifyContent='flex-start' alignItems='flex-start' spacing={4}>
        <Box w='100%' mb={4}>
          <FormSectionHeading pt={0}>General Details</FormSectionHeading>
          <VStack
            flexShrink={0}
            p={4}
            w='md'
            bgColor={variables.inputBgColor}
            borderRadius='4px'
            overflow='hidden'
          >
            <TextField {...wrapperFieldProps} label='Email'>
              {user?.email}
            </TextField>
            <Controller
              name='fullName'
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <EditableField
                  {...wrapperFieldProps}
                  label='Full Name'
                  defaultValue={value}
                  onBlur={onBlur}
                  onSubmit={val => onChange(val)}
                />
              )}
            />
            <Controller
              name='displayName'
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <EditableField
                  {...wrapperFieldProps}
                  label='Display Name'
                  defaultValue={value}
                  onBlur={onBlur}
                  onSubmit={val => onChange(val)}
                />
              )}
            />
          </VStack>
        </Box>
        <Box w='100%'>
          <Controller
            name='address'
            control={control}
            render={({ field: { value, onChange } }) => (
              <ShippingAddress
                w='100%'
                value={value as any}
                userCurrentAddresses={userCurrentAddresses}
                changeButtonLabel='Select Default Address'
                editButtonLabel='Edit Current Address'
                loading={loading}
                isSubmitting={loading}
                onUpdateAddress={onUpdateAddress}
                onChange={onChange}
                onRemove={handleRemoveAddress}
              />
            )}
          />
        </Box>
      </VStack>
    </Box>
  );
};

EditUserAccountForm.defaultProps = {
  userAccount: undefined,
  loading: false
};
