import "../styles/globals.scss"
import Head from "next/head"
import Footer from "../components/Layout/Footer"
import Layout from "../components/Layout/Layout"
import Header from "../components/Header/Header"
import { Toaster } from "react-hot-toast"
import { getSession, SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { isNullOrEmpty } from "../lib/scripts/strings"
import App from "next/app"

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

function redirect(ctx, uri) {
  ctx.res.writeHead(302, { Location: uri })
  ctx.res.end()
}
MyApp.getInitialProps = async (context) => {
  console.log("HELLOOOOOOO")
  const appProps = await App.getInitialProps(context)
  const { ctx, router } = context
  const session = await getSession(context)

  if (!session) {
    if (
      !router.route.startsWith("/login") &&
      !router.route.startsWith("/signup")
    ) {
      redirect(ctx, "/login")
    }
  } else if (
    isNullOrEmpty(session.place?.placeId) &&
    !router.route.startsWith("/account/setupaccount")
  ) {
    // user should configure their place
    redirect(ctx, "/account/setupaccount")
  }

  // check inbox here

  return {
    pageProps: { ...appProps, session },
  }
}
export default MyApp
