import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <title>Scrum Poker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(App);
