import numbro from 'numbro';

const formatPrice = (price: number) =>
  numbro(price).formatCurrency({
    currencySymbol: '\u20B1',
    thousandSeparated: true,
    mantissa: 2
  });

const isString = (value: any) => {
  if (value != null && typeof value.valueOf() === 'string') {
    return true;
  }
  return false;
};

export { formatPrice, isString };
