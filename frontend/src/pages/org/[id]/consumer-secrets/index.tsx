/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from "react-i18next";
import Head from "next/head";

import { ConsumerSecretsPage } from "@app/views/ConsumerSecretsPage/ConsumerSecretsPage";

export default function ConsumerSecrets() {
  // const { t } = useTranslation();
  // TODO: figure out translation

  return (
    <>
      <Head>
        <title>Consumer secrets</title>
        <link rel="icon" href="/infisical.ico" />
      </Head>
      <ConsumerSecretsPage />
    </>
  );
}

ConsumerSecrets.requireAuth = true;
