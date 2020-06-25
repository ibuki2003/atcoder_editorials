import React from "react";
import { AppProps } from "next/app";
import LoadingBar from "@/components/loadingbar";

import "@/scss/main.scss";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <div>
      <LoadingBar height={3} color="white" />
      <Component {...pageProps}></Component>
    </div>
  );
};

export default MyApp;
