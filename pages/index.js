import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { getAllTravellingFromLocation } from "../lib/travel";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({ travelling, hangouts, connectedUser }) {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (connectedUser && connectedUser.user.userId !== undefined) {
      console.log("connectedUser#####", connectedUser.userId);

      // get city
      fetch(`api/profile?userId=${connectedUser.user.userId}&path=profileInfo`)
        .then((response) => response.json())
        .then((res) => setLocation(res.data));
    }
  }, [connectedUser]);

  const router = useRouter();
  console.log("hangouts", hangouts);
  const handleTravelRoute = (userId) => {
    return `/intro?userId=${userId}`;
  };
  console.log("travelling", travelling);

  return (
    <div>
      <Head>
        <title>Hangout</title>
      </Head>

      <main className={styles.main}>
        <Link
          href={`publish-itinerary?city=${location?.city}&state=${location?.state}&country=${location?.country}`}
        >
          Publish future travel
        </Link>
        <p>Location: {location?.formatted_address}</p>
        <div className={styles.travellingContainer}>
          <h1>Upcoming</h1>
          <div className={styles.travellingSection}>
            {travelling &&
              travelling.length > 0 &&
              travelling.map((item, i) => {
                return (
                  <a key={i} href={handleTravelRoute(item.userId)}>
                    <div className={styles.travellingBox}>
                      {/* profile image */}
                      <div className={styles.name}>{item.name}</div>
                      <div className={styles.upcoming.profileImage}>
                        {
                          <Image
                            className={styles.profileImage}
                            src={item.picture}
                            alt="pic"
                            width={150}
                            height={150}
                          />
                        }
                      </div>
                      {/* dates */}
                      <div className={styles.upcoming.item}>
                        {item.startDate} - {item.endDate}
                        {/* country */}
                        {item.location?.country && (
                          <div className={styles.upcoming.item}>
                            Country: {item.location.country}
                          </div>
                        )}
                        <div>{item.description}</div>
                      </div>
                    </div>
                  </a>
                );
              })}
          </div>
          <div className={styles.more}>
            <Link href="/more-travels">More</Link>
          </div>
        </div>
        <div></div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const travelling = await getAllTravellingFromLocation(
      "United States",
      "California",
      "Los Angeles"
    );
    // const hangouts = await getAllHangouts();
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
