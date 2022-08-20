function Layout({ Component, pageProps, session }) {
  return (
    <main>
      <Component {...pageProps} session={session} />
    </main>
  )
}

export default Layout
