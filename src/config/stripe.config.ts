import { loadStripe } from '@stripe/stripe-js';
import variables from 'assets/styles/_variables.module.scss';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

const stripeElementsOptions: any = (clientSecret: string) => ({
  clientSecret,
  appearance: {
    theme: 'night',
    labels: 'floating',
    variables: {
      colorPrimary: variables.primaryColor,
      colorText: variables.textColor,
      colorDanger: variables.errorColor,
      colorBackground: variables.inputBgColor,
      fontFamily: variables.textFont
    }
  }
});

export { stripePromise, stripeElementsOptions };
