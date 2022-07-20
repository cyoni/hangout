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
  province_short: string
}

type Place = {} & City & Country & Province

type JWT = {
  jwt: string
  user: { userId: string; name: string; place: Place }
}
type ResponseObject = {
  isSuccess: boolean
  data?: any
  message?: string
}

interface TravellingObject {
  jwt: string
  cityId: number
  userId: string
  startDate: string
  endDate: string
  description: string
}

interface InnerJoin {
  from: string
  localField: string
  foreignField: string
  as: string
}
interface AggregateReq {
  collection: string
  $match?: {}
  from?: string
  localField?: string
  foreignField?: string
  as?: string
  innerJoin?: InnerJoin
  $project?: {}
  $count?: {}
  $sort?: {}
}

interface PostRequest {
  url: string
  body: any
}
