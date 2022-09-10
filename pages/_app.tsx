import "../styles/globals.scss"
import Head from "next/head"
import Script from "next/script"
import Footer from "../components/Footer"
import Layout from "../components/Layout"
import Header from "../components/Header"
import { Toaster } from "react-hot-toast"
import { getSession, SessionProvider } from "next-auth/react"
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  console.log("my app session", session)
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Header />

        <Toaster />

        <Layout Component={Component} pageProps={pageProps} />
        <Footer />

        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  )
}
MyApp.getInitialProps = async (context) => {
  const session = await getSession(context)

  // check inbox here
  
  return {
    pageProps: { session },
  }
}
export default MyApp
