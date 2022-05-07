
import styles from "../styles/login.module.css";

export default function Login() {
    return (
      <div className={styles.form_group} >
        <h1>Log in</h1>
        <form onSubmit={"handleSubmit"} method="post">
          <div >
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              className="form-control"
              name="email"
              id="email"
            />
            <label htmlFor="dates">Password:</label>
            <input type="password" className="form-control" name="password" id="password" />

            <button type="submit" className="btn btn-primary">
              Log in
            </button>
          </div>
        </form>
      </div>
    );
  }
  