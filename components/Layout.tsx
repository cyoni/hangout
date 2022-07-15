

function Layout({ Component, pageProps, connectedUser }) {
  return (
    <main className="">
      <Component {...pageProps} connectedUser={connectedUser} />
    </main>
  )
}

export default Layout
