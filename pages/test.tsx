import { useEffect } from "react"
import { get } from "../lib/postman"

export default function Test() {
  useEffect(() => {
    const url =
      "https://api.geoapify.com/v1/geocode/autocomplete?text=tel a&apiKey=76627608a79b4529a1d8faca267b7045"

    const x = async () => {
      const ans = await get(url)
      const result = ans.data
      76627608a79b4529a1d8faca267b704fun
      const cities = result.features.map((feature) => {
     //   const mapper = ({ city, country }) => ({ city, country })
     const mapper = (obj) => ({ ...obj })
        return mapper(feature.properties)
      })
      console.log("cities", cities)
    }
    x()
  }, [])

  return <>helpp</>
}
