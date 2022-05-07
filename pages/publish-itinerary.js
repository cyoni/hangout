import { useState } from "react";
import randomString from "../lib/randomString";
import styles from "../styles/publish-itinerary.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DesktopDatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/material";

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = {
    dates: e.target.dates.value,
    city: e.target.city.value,
    description: e.target.description.value,
  };
  const JSONdata = JSON.stringify(data);
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

export default function Travelling() {
  const [destinations, setDestinations] = useState([]);
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

  const handlePlusClick = (e) => {
    e.preventDefault();
    const newData = [
      ...destinations,
      { id: randomString(10), date, city, description },
    ];
    console.log(newData);
    setDestinations(newData);
    setDate("");
    setCity("");
    setDescription("");
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

  const [value, setValue] = useState(new Date("2014-08-18T21:11:54"));
  const handleChange = (newValue) => {
    setValue(newValue);
  };
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

      <h1>Post your future travel now</h1>

      {destinations.length > 0 && (
        <div>
          {destinations.map((item, i) => {
            return (
              <div key={i}>
                <h5>
                  {i + 1}: {item.city} (10/5-15/5)
                </h5>
                <div>Date: {item.date}</div>
                <div>Description: {item.description}</div>
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
          <p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={3}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </LocalizationProvider>
          </p>

          <label htmlFor="dates">Dates:</label>
          <input
            type="text"
            className="form-control"
            name="dates"
            id="dates"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <label htmlFor="cities">City:</label>
          <input
            type="text"
            className="form-control"
            name="city"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

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
