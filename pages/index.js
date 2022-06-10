import Head from "next/head";
import styles from "../styles/Home.module.css";
import { getAllTravelling, getAllHangouts } from "../lib/travel";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home({ travelling, hangouts }) {
  const router = useRouter();
  console.log("hangouts", hangouts);
  const handleTravelRoute = (userId) => {
    router.push(`/intro?userId=${userId}`);
  };
  console.log("travelling", travelling);

  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className={styles.main}>
        <div className="hangouts">
          <div className={styles.travellingContainer}>
            <h1>Hangouts</h1>
            <div className={styles.travellingSection}>
              {hangouts &&
                hangouts.length > 0 &&
                hangouts.map((x, i) => {
                  return (
                    <div
                      className={styles.travellingBox}
                      onClick={() => handleTravelRoute(x.userId)}
                      key={1 + i * 99}
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
                      {/* city */}
                      <div className="city">
                        Is in <b>{x.city}</b>
                      </div>
                      {/* country */}
                      <div className={styles.upcoming.item}>Country: USA</div>
                      <div className="text-success">3 mins ago</div>
                    </div>
                  );
                })}
            </div>
            <div className={styles.more}>
              <Link href="/more-hangouts">More</Link>
            </div>
          </div>
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
                        {x.itinerary[0].startDate}-
                        {x.itinerary[x.itinerary.length - 1].endDate}
                      </div>
                      {/* country */}
                      <div className={styles.upcoming.item}>Country: USA</div>
                    </div>
                  );
                })}
            </div>
            <div className={styles.more}>
              <Link href="/more-travels">More</Link>
            </div>
          </div>
        </div>
        <div></div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const travelling = await getAllTravelling();
    const hangouts = await getAllHangouts();
    return {
      props: { travelling, hangouts },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { travelling, hangouts: [] },
    };
  }
}
