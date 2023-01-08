import "../styles/globals.scss"
import Head from "next/head"
import Footer from "../components/Layout/Footer"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import { Toaster } from "react-hot-toast"
import { SessionProvider, useSession } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useEffect } from "react"

const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps: { ...pageProps } }) => {
  console.log("pageProps", pageProps)
  console.log("my app session", pageProps.session)
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Auth Component={Component} pageProps={pageProps} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  )
}

function Auth({ Component, pageProps }) {
  const session = useSession()
  console.log("session.status", session.status)
  if (session.status !== "loading") {
    return (
      <>
        <Header session={session} />
        <Toaster />
        <Layout Component={Component} pageProps={pageProps} session={session} />
        <Footer />
      </>
    )
  }
}
export default MyApp
