import "../styles/globals.scss"
import Head from "next/head"
import Footer from "../components/Footer"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header"
import { Toaster } from "react-hot-toast"
import { getSession, SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
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

        <Header session={session} />

        <Toaster />

        <Layout Component={Component} pageProps={pageProps} session={session} />
        <Footer />

        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  )
}
MyApp.getInitialProps = async (context) => {
  const session = await getSession(context)
  if (!session) {
    // context.res.writeHead(302, {
    //   Location: '/some_url',
    //   'Content-Type': 'text/html; charset=utf-8',
    // });
    // context.res.end();

    // redirect to login page (if this is not login or signup pages)
  }
  // check inbox here

  return {
    pageProps: { session },
  }
}
export default MyApp
