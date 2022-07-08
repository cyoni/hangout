// import { getAllHangouts } from "../lib/travel";
// import styles from "../styles/more-hangouts.module.scss";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import { Button } from "@mui/material";

// export default function MoreHangouts({ hangouts, location }) {
//   const router = useRouter();
//   console.log("hangouts", hangouts);

//   console.log("hangouts", hangouts);
//   const handleTravelRoute = (userId) => {
//     router.push(`/intro?userId=${userId}`);
//   };
//   return (
//     <div>
//       <h1>Looking for hangout now</h1>
//       {hangouts &&
//         hangouts.length > 0 &&
//         hangouts.map((x, i) => {
//           return (
//             <div className={styles.travellingBox} key={1 + i * 99}>
//               {/* profile image */}
//               <div className={styles.upcoming}>
//                 {
//                   <Image
//                     className={styles.profileImage}
//                     src={x.picture}
//                     alt="pic"
//                     width={100}
//                     height={100}
//                   />
//                 }
//               </div>
//               <div className="info">
//                 <div>Name: Yoni</div>
//                 {/* city */}
//                 <div className="city">
//                   Is in <b>{x.city}</b>
//                 </div>
//                 {/* country */}
//                 <div className={styles.upcoming}>Country: USA</div>
//                 <div className="text-success">3 mins ago</div>
//                 <div className={styles.buttons}>
//                   <Button variant="contained">Send message</Button>
//                   <Button
//                     variant="contained"
//                     onClick={() => handleTravelRoute(x.userId)}
//                   >
//                     Visit profile
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//     </div>
//   );
// }

// export async function getServerSideProps(context) {
//   try {
//     const { query } = context;
//     const location = query.location;
//     const hangouts = await getAllHangouts();
//     return {
//       props: { hangouts, location },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { hangouts: [] },
//     };
//   }
// }
