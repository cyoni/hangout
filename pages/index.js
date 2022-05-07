import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getAllTravelling } from "../lib/travel";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home({ travelling }) {
  const router = useRouter();

  const handleTravelRoute = (userId) => {
    router.push(`/travel?userId=${userId}`);
  };
  console.log("travelling", travelling);

  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className={styles.main}>
        <div className="hangouts">
          <h1>Hangouts</h1>
          empty
        </div>
        <div>
          <div className={styles.travellingContainer}>
            <h1>Upcoming</h1>
            <div className={styles.travellingSection}>
              {travelling &&
                travelling.length > 0 &&
                travelling.map((x, i) => {
                  return (
                    <div
                      className={styles.travellingBox}
                      onClick={() => handleTravelRoute(x.userId)}
                    >
                      {/* profile image */}
                      <div className={styles.upcoming.profileImage}>
                        {
                          <Image
                            className={styles.profileImage}
                            src={x.picture}
                            alt="pic"
                            width={150}
                            height={150}
                          />
                        }
                      </div>
                      {/* dates */}
                      <div className={styles.upcoming.item}>
                        Dates: {x.dates}
                      </div>
                      {/* country */}
                      <div className={styles.upcoming.item}>Country: USA</div>
                    </div>
                  );
                })}
            </div>
            <div className={styles.more}>
              <Link href="/">More</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const travelling = await getAllTravelling();
    return {
      props: { travelling },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { travelling: [] },
    };
  }
}
