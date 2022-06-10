require("dotenv")

import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import Head from "next/head";
import { isUserVarified } from "../lib/jwtUtils";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
const x = process.env.ACCESS_TOKEN_SECRET

  const isWindow = typeof window !== "undefined";

  const localStorage = (folder) => {
    const data = window.localStorage.getItem(folder);
    if (data) return JSON.parse(data);
    else return null;
  };


  const [connectedUser, setConnectedUser] = useState("");
  useEffect(() => {
    const xx = localStorage("user")
    const user = isUserVarified(xx.token)
    console.log("user", user)
    if (user) {
      setConnectedUser(user.userId);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="header">
        <h1>Site name</h1>
        <h4>(Default location: Israel)</h4>
        <div className="account_buttons">
          <Link href="/">Home</Link>
          <Link href="login">Login</Link>
          <Link href="signup">Sign up</Link>
          <Link href="publish-hangout">Publish hangout</Link>
          <Link href="publish-itinerary">Publish future travel</Link>
        </div>
        {connectedUser && <div>hello {connectedUser}</div>}
      </header>
      <main className="container">
        <Component {...pageProps} />
      </main>
      <footer className="footer">footer</footer>
    </>
  );
}

export default MyApp;
