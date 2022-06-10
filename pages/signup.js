import styles from "../styles/signup.module.css";

export default function Signup() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      city: e.target.city.value,
      country: e.target.country.value,
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = "api/signup";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();
    console.log("response", result); // if OK redirect
  };

  return (
    <div className={styles.form_group}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit} method="post">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" name="name" id="name" />

          <label htmlFor="email">Email</label>
          <input type="text" className="form-control" name="email" id="email" />
          <label htmlFor="dates">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
          />

          <label htmlFor="city">City</label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
          />

          <label htmlFor="country">Country</label>
          <input
            type="text"
            className="form-control"
            name="country"
            id="country"
          />

          <button type="submit" className="btn btn-primary">
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
