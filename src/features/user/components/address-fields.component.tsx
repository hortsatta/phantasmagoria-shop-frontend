import { FC, useMemo } from 'react';
import {
  Box,
  BoxProps,
  Center,
  Divider,
  Spinner,
  Text,
  TextProps,
  Wrap,
  WrapItem
} from '@chakra-ui/react';

import { Address, SelectOption } from 'models';
import {
  usePhLocationRegion,
  usePhLocationProvince,
  usePhLocationCity,
  usePhLocationBarangay
} from 'features/user/hooks';

import variables from 'assets/styles/_variables.module.scss';

type Props = BoxProps & {
  address: Address | null;
};

const wrapProps = {
  borderColor: 'rgba(255,255,255,0.06)',
  borderWidth: '1px'
};

const textFieldWrapperProps = {
  w: '100%',
  px: 4,
  py: 3,
  bgColor: variables.inputBgColor,
  borderRadius: '4px',
  overflow: 'hidden'
};

const textFieldLabelProps: TextProps = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 12,
  textTransform: 'uppercase',
  lineHeight: 1
};

const TextField: FC<{ label: string }> = ({ label, children }) => (
  <Box {...textFieldWrapperProps}>
    <Text lineHeight={1}>{children}</Text>
    <Divider my={2} bgColor='rgba(255,255,255,0.1)' />
    <Text {...textFieldLabelProps}>{label}</Text>
  </Box>
);

export const AddressFields: FC<Props> = ({ address, ...moreProps }) => {
  const {
    fullName,
    addressLine,
    zipCode,
    phoneNumber,
    region: regionCode = '',
    province: provinceCode = '',
    city: cityCode = '',
    barangay: brgyCode = ''
  } = address || {};

  const { phRegionOptions } = usePhLocationRegion();
  const { phProvinceOptions, loading: phProvinceLoading } = usePhLocationProvince(regionCode);
  const { phCityOptions, loading: phCityLoading } = usePhLocationCity(provinceCode);
  const { phBarangayOptions, loading: phBarangayLoading } = usePhLocationBarangay(cityCode);

  const loading = useMemo(
    () => phProvinceLoading || phCityLoading || phBarangayLoading,
    [phProvinceLoading, phCityLoading, phBarangayLoading]
  );

  const region = useMemo(() => {
    const target = phRegionOptions.find((option: SelectOption) => option.value === regionCode);
    return target && target.label;
  }, [phRegionOptions, regionCode]);

  const province = useMemo(() => {
    const target = phProvinceOptions.find((option: SelectOption) => option.value === provinceCode);
    return target && target.label;
  }, [phProvinceOptions, provinceCode]);

  const city = useMemo(() => {
    const target = phCityOptions.find((option: SelectOption) => option.value === cityCode);
    return target && target.label;
  }, [phCityOptions, cityCode]);

  const barangay = useMemo(() => {
    const target = phBarangayOptions.find((option: SelectOption) => option.value === brgyCode);
    return target && target.label;
  }, [phBarangayOptions, brgyCode]);

  return (
    <Box pos='relative' {...moreProps}>
      {loading && (
        <Center
          top={0}
          left={0}
          pos='absolute'
          d='flex'
          w='100%'
          h='100%'
          alignItems='center'
          bgColor='#300b1e'
          zIndex={2}
        >
          <Spinner size='xl' />
        </Center>
      )}
      <Wrap>
        <WrapItem w='100%' {...wrapProps}>
          <TextField label='Full Name'>{fullName}</TextField>
        </WrapItem>
        <WrapItem w='100%' {...wrapProps}>
          <TextField label='Brgy, City / Munici, Province, Region'>
            {barangay}, {city}, {province}, {region}
          </TextField>
        </WrapItem>
        <WrapItem w='100%' {...wrapProps}>
          <TextField label='Line'>{addressLine}</TextField>
        </WrapItem>
        <WrapItem flex={1} {...wrapProps}>
          <TextField label='Zip Code'>{zipCode}</TextField>
        </WrapItem>
        <WrapItem flex={1} {...wrapProps}>
          <TextField label='Phone No.'>{phoneNumber}</TextField>
        </WrapItem>
      </Wrap>
    </Box>
  );
};
