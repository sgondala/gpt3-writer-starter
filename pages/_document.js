import { Html, Head, Main, Script, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Startup Advisor" key="title"/>
        <meta property="og:description" content="Think of it like a startup mentor" key="description"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
