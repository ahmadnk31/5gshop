import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Polyfill.io for legacy browsers */}
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default,fetch" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 