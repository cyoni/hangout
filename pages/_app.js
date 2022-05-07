import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <h1>Site name</h1>
        <div className="account_buttons">
            <Link href="/">Home</Link>
            <Link href="login">Login</Link>
            <Link href="signup">Sign up</Link>
            <Link href="publish-itinerary">Publish hangout</Link>
            <Link href="publish-itinerary">Publish future travel</Link>
          
        </div>
      </header>
      <main className="container">
        <Component {...pageProps} />
      </main>
      <footer className="footer">footer</footer>
    </>
  );
}

export default MyApp;
