
import { getTravelContent } from "../lib/travel";
import Script from "next/script";


export default function travel({ page }) {

  return (
    <>
      wefwefr
    </>
  );
}

export async function getServerSideProps({ query }) {
  let page = [];
  try {
    const userId = query.userId;
    console.log("id", userId);

    if (userId && userId !== undefined) {
      page = await getTravelContent(userId);
    }

    return {
      props: { page },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { page },
    };
  }
}
