import { useEffect } from "react"
import { get } from "../lib/postman"

const x = require("/autoComplete.json")

// You can also use refs in function components using closures.
// String Refs
//  Virtual DOM and reconciliation
// React Fiber
// controlled components
// cloneElement
// lazy function  // React.lazy

export default function Test() {
  // useEffect(() => {
  //   const url =
  //     "https://api.geoapify.com/v1/geocode/autocomplete?text=tel a&apiKey=76627608a79b4529a1d8faca267b7045"
  // https://api.geoapify.com/v2/place-details?place_id=515e8b7159604d534059332aba3f289d3c40f00101f901152b2a0000000000c00208&apiKey=76627608a79b4529a1d8faca267b7045

  //   const x = async () => {
  //     const ans = await get(url)
  //     const result = ans.data

  //     const cities = result.features.map((feature) => {
  //    //   const mapper = ({ city, country }) => ({ city, country })
  //    const mapper = (obj) => ({ ...obj })
  //       return mapper(feature.properties)
  //     })
  //     console.log("cities", cities)
  //   }
  //   x()
  // }, [])
  const fullPlace = "tel aviv, israel"
  const x = fullPlace.replaceAll(/(, | )/g, "-")
  return <> {x}</>
}
