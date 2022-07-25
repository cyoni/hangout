require("dotenv")

import "../styles/globals.scss"
import Head from "next/head"
import Script from "next/script"
import Footer from "../components/Footer"
import Layout from "../components/Layout"
import Header from "../components/Header"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <Toaster />

      <div>
        <div>
          <Layout Component={Component} pageProps={pageProps} />
        </div>
        <Footer />
      </div>
    </SessionProvider>
  )
}

export default App
