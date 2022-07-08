import styles from "../styles/login.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    window.localStorage.removeItem("user");
    router.push("/");
  }, []);
  return <div>Logging you out...</div>;
}
