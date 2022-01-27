import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import PlausibleProvider from "next-plausible";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: { Component: any, pageProps: any }) {
  return (
    <PlausibleProvider domain="example.com">
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </PlausibleProvider>
  );
}
