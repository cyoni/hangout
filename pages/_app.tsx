import "../styles/globals.scss"
import Head from "next/head"
import Script from "next/script"
import Footer from "../components/Footer"
import Layout from "../components/Layout"
import Header from "../components/Header"
import { Toaster } from "react-hot-toast"
import { SessionProvider } from "next-auth/react"
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()
function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Header />

        <div>
          <Toaster />
        </div>

        <div>
          <div>
            <Layout
              Component={Component}
              pageProps={pageProps}
              session={session}
            />
          </div>
          <Footer />
        </div>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default App
