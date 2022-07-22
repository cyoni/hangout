

function Layout({ Component, pageProps, connectedUser }) {
  return (
    <main>
      <Component {...pageProps} connectedUser={connectedUser} />
    </main>
  )
}

export default Layout
