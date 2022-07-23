import Head from "next/head"
import HeaderImage from "../components/HeaderImage"

interface Props {
  place: Place
}
export default function Home() {
  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className="">
        <HeaderImage title="Home" />
        Welcome
      </main>
    </div>
  )
}
