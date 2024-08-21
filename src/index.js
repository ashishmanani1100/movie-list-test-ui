import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { ToastContainer } from "react-toastify";

import App from './App';
import reportWebVitals from './reportWebVitals';
import "./i18n";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const link = createUploadLink({
  uri: process.env.REACT_APP_API_URL + "/graphql",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
      <ToastContainer autoClose={2000} limit={5} />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
