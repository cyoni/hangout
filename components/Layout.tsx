import useServices from "./useServices"

function Layout({ Component, pageProps }) {

  useServices()

  return (
    <main>
      <Component {...pageProps} />
    </main>
  )
}

export default Layout
