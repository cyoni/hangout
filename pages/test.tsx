import React from "react"
import HeaderImage from "../components/HeaderImage"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import { getUnsplashImageByText } from "../lib/unSplash"
import data from "../lib/cityImages.json"

function test({ photo }) {
  return (
    <div className="">
      <HeaderImage title="City" background={photo} />
    </div>
  )
}

export default test

export async function getServerSideProps(context) {
  
}
