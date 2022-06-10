import { useState } from "react";
import randomString from "../lib/randomString";
import styles from "../styles/publish-itinerary.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { Button, Stack } from "@mui/material";


export default function Travelling() {
  const [destinations, setDestinations] = useState([]);
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      startDate: startDate,
      endDate: endDate,
      city: e.target.city.value,
      description: e.target.description.value,
    };
    const JSONdata = JSON.stringify(destinations);
    console.log("JSONdata", JSONdata)
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

  const handlePlusClick = (e) => {
    e.preventDefault();
    console.log("startDate", startDate);
    const newData = [
      ...destinations,
      {
        id: randomString(10),
        startDate: convertDate(startDate),
        endDate: convertDate(endDate),
        city,
        description,
      },
    ];
    console.log(newData);
    setDestinations(newData);
    setDate("");
    setCity("");
    setDescription("");

    setStartDate(endDate);
    setEndDate(null);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleEdit = (id) => {
    setShowPopup(true);
  };
  const handleRemove = (id) => {
    console.log(id);
    console.log(destinations);
    const newData = destinations.filter((x) => x.id !== id);
    setDestinations(newData);
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <h1>sdfsdf</h1>
            <button onClick={() => setShowPopup(!showPopup)}>close</button>
          </div>
        </div>
      )}

      <h1>Where are you going to travel?</h1>

      {destinations.length > 0 && (
        <div>
          {destinations.map((item, i) => {
            return (
              <div key={i}>
                <h5>
                  {i + 1}: {item.city} ({item.startDate}
                  {item.endDate !== null && <>-{item.endDate}</>})
                </h5>
                {item.description !== "" && (
                  <div>Description: {item.description}</div>
                )}
                <a href="#" onClick={() => handleEdit(item.id)}>
                  Edit
                </a>{" "}
                |{" "}
                <a href="#" onClick={() => handleRemove(item.id)}>
                  Remove
                </a>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} method="post">
        <div className={styles.form_group}>
          <label htmlFor="cities">City / Place:</label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            value={city}
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

          <div>
            <button className="btn btn-primary" onClick={handlePlusClick}>
              +
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
