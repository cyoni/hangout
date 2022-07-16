
type City = {
  city_id: number
  city: string
}

type Country = {
  country_id: number
  country: string
}

type Province = {
  province_id: number
  province: string
}

type Place = {} & City & Country & Province

type JWT = {
  jwt: string
  user: { userId: string; name: string; place: Place }
}
