import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ApolloProvider } from '@apollo/client';

import { APP_TITLE, client } from 'config';
import { App } from './features/app/app';
import reportWebVitals from './reportWebVitals';

import './index.scss';

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta charSet='utf-8' />
        <title>{APP_TITLE}</title>
        <link rel='canonical' href={process.env.REACT_APP_BASE_URI} />
      </Helmet>
      <ApolloProvider client={client}>
        <Router>
          <App />
        </Router>
      </ApolloProvider>
    </HelmetProvider>
  </StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
