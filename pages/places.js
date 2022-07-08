import styles from "../styles/signup.module.css";
import { PlacesAutocomplete } from "../lib/PlacesAutoComplete";
import { useState } from "react";
import { Client } from "@googlemaps/google-maps-services-js";
import { Location } from "../components/Location";

export default function Places({ location }) {
  console.log("received from server", location);
  return (
    <div>
      <Location location={location} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const locationUrl = context.query.location;

  const getValueFromAddress = (addressComponents, type) => {
    for (let i = 0; i < addressComponents.length; i++) {
      if (addressComponents[i].types.includes(type)) {
        const longName = addressComponents[i].long_name;
        return longName;
      }
    }
    return "";
  };

  const client = new Client({});

  const location = await client
    .geocode({
      params: {
        address: locationUrl,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    })
    .then((r) => {
      console.log("result", r.data.results[0]);
      if (r.data.results[0] != null && r.data.results[0] != undefined) {
        const addressComponents = r.data.results[0].address_components;

        const country = getValueFromAddress(addressComponents, "country");
        const state = getValueFromAddress(
          addressComponents,
          "administrative_area_level_1"
        );
        const city = getValueFromAddress(addressComponents, "locality");

        console.log("country", country);
        console.log("state", state);
        console.log("city", city);
        const formatted_address = r.data.results[0].formatted_address;
        const latLng = r.data.results[0].geometry.location;

        return { country, state, city, formatted_address, latLng };
      }
    })
    .catch((e) => {
      console.log("error: ", e);
    });

  return {
    props: { location },
  };
}
