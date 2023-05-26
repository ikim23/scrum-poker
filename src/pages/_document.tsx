import { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'

import { env } from '~/env.mjs'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="dark text-white">
        <Main />
        <NextScript />
        {env.NODE_ENV === 'production' && (
          <Script
            data-id="30cbe9bf-51ff-4725-92cd-33f83c4640bb"
            data-utcoffset="2"
            src="https://cdn.counter.dev/script.js"
            strategy="lazyOnload"
          />
        )}
      </body>
    </Html>
  )
}
