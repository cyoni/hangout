import { getTravelContent } from "../lib/travel"
import Script from "next/script"
import Image from "next/image"

export default function travel({ usr }) {
  console.log("page", usr)

  return (
    <div>
      {usr ? (
        <>
          <div className="intro">
           {/*  <Button variant="contained">Send a message</Button> */}
            <h1>{usr.profile.name}</h1>
            <div>{usr.profile.location.formatted_address}</div>
            <Image
              src={usr.profile.picture}
              alt="pic"
              width={150}
              height={150}
            />
            <h2>Intro</h2>
            {usr.profile.info ? usr.profile.info : "No intro"}
          </div>
          <div>
            <h2>Timeline</h2>
            <div className="timeline">
              {usr.travels.map((item, i) => {
                return (
                  <div key={i}>
                    <div>
                      <b>{item.city}</b>
                    </div>
                    <div>
                      {item.startDate}-{item.endDate}
                    </div>
                    <div>{item.description}</div>
                  </div>
                )
              })}
            </div>
            <div>
              <h2>Past travells</h2>
            </div>
          </div>
        </>
      ) : (
        <div>User was not found</div>
      )}
    </div>
  )
}

export async function getServerSideProps({ query }) {
  let usr
  try {
    const userId = query.userId
    console.log("id", userId)

    if (userId && userId !== undefined) {
      usr = await getTravelContent(userId)
    }

    return {
      props: { usr },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { usr },
    }
  }
}
