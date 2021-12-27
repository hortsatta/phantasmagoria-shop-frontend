import numbro from 'numbro';

export const formatPrice = (price: number) =>
  numbro(price).formatCurrency({
    currencySymbol: '\u20B1',
    thousandSeparated: true,
    mantissa: 2
  });
