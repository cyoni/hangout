type city = {
  city_id: number
  city: string
  country_id: number
  country: string
  province_id: number
  province: string
}
type place = {
  city_id: string
  province_id: string
  country_id: string
}

type jwt = {
  jwt: string
  user: { userId: string; name: string; place: place }
}
