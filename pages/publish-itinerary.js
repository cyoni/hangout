import { useState } from "react";
import randomString from "../lib/randomString";
import styles from "../styles/publish-itinerary.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";

export default function Travelling({ city, state, country, connectedUser }) {
  console.log("connectedUser",connectedUser)
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      userId: connectedUser.userId,
      jwt: connectedUser.jwt,
      startDate: startDate,
      endDate: endDate,
      country,
      state,
      city,
      description: e.target.description.value,
    };

    const JSONdata = JSON.stringify(data);

    console.log("JSONdata", JSONdata);
    const endpoint = "api/publishTravelling";
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

  const convertDate = (date) => {
    if (date === null) return null;
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div>
      <h1>Where are you going to travel?</h1>

      <form onSubmit={handleSubmit} method="post">
        <div className={styles.form_group}>
          <label htmlFor="cities">City:</label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            value={`${city}, ${state}, ${country}`}
            onChange={(e) => setCity(e.target.value)}
          />
          <div className={styles.datePickers}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Start date"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="End date"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <label htmlFor="description">Description:</label>
          <textarea
            className="form-control"
            rows="5"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <Button type="submit" className="btn btn-primary">
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { country, state, city } = context.query;
    return {
      props: { country, state, city },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { country: null, state: null, city: null },
    };
  }
}
