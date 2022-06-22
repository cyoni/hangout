import styles from "../styles/login.module.css";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

    const JSONdata = JSON.stringify(data);
    const endpoint = "api/login";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();
    console.log("response", result);

    if (result.isSuccess) {
      window.localStorage.setItem(
        "user",
        JSON.stringify({ userId: result.userId, token: result.token })
      );
      router.push("/");
    }
    else {
      console.log("could not login in, try again")
    }
  };

  return (
    <div className={styles.form_group}>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit} method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="text" className="form-control" name="email" id="email" />
          <label htmlFor="dates">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
          />

          <button type="submit" className="btn btn-primary">
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}
