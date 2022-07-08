import { useState } from "react";
import randomString from "../lib/randomString";
import styles from "../styles/publish-itinerary.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

export default function Hangout() {

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      city: e.target.city.value,
      description: e.target.description.value,
    };
    console.log("data", data)
    const JSONdata = JSON.stringify(data);
    console.log("JSONdata", JSONdata);
    const endpoint = "api/publishHangout";
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
    <div>
      <h1>Meet locals now</h1>

      <form onSubmit={handleSubmit} method="post">
        <div className={styles.form_group}>
          <label htmlFor="cities">City / Place:</label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
          />

          <label htmlFor="description">Description:</label>
          <textarea
            className="form-control"
            rows="5"
            name="description"
            id="description"
          ></textarea>

          <Button type="submit" variant="contained">Publish</Button>
        </div>
      </form>
    </div>
  );
}
