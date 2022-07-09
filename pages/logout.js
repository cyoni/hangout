import styles from "../styles/login.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    window.localStorage.removeItem("user");
    window.location = "/"
  }, []);
  return <div>Logging you out...</div>;
}
