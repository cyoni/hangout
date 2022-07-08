import styles from "./_.module.scss";
import { getAllTravellingFromLocation } from "../../lib/travel";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "@mui/material";

export default function More({ travelling, location }) {
  const router = useRouter();

  const handleTravelRoute = (userId) => {
    router.push(`/intro?userId=${userId}`);
  };
  return (
    <div>
      <h1>Looking for travellers to {location?.city}</h1>
      <div>Showing {travelling.length} travellers</div>
      {travelling &&
        travelling.length > 0 &&
        travelling.map((result, i) => {
          {
            console.log("usr travel", result);
          }
          return (
            <div className={styles.travellingBox} key={1 + i * 99}>
              {/* profile image */}
              <div className={styles.upcoming}>
                {
                  <Image
                    className={styles.profileImage}
                    src={result.picture}
                    alt="pic"
                    width={100}
                    height={100}
                  />
                }
              </div>
              <div className="info">
                <div className="">{result.name}</div>
                <div>{`${result.startDate}-${result.endDate}`}</div>
                {/* country */}
                <div className={styles.upcoming}>
                  {result.location?.formatted_address}
                </div>
                <div>{result.description}</div>

                <div className={styles.buttons}>
                  <div className="">
                    <button className="btn btn-primary">Message</button>
                    <button
                      className=" btn btn-primary"
                      onClick={() => handleTravelRoute(result.userId)}
                    >
                      Visit profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { query } = context;
    const { country, state, city } = query;
    const location = { country, state, city };
    const travelling = await getAllTravellingFromLocation(country, state, city);
    return {
      props: { travelling, location },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { travelling: [] },
    };
  }
}
