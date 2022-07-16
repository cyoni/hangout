import React from "react"
import HeaderWrapper from "../components/HeaderWrapper"
import { getPhotoByPhotoRef, getPhotoReference } from "../lib/googlePlaces"
import { getUnsplashImageByText } from "../lib/unSplash"
import data from "../lib/cityImages.json"

function test({ photo }) {
  return (
    <div className="">
      <HeaderWrapper title="City" background={photo} />
    </div>
  )
}

export default test

export async function getServerSideProps(context) {
  
}
