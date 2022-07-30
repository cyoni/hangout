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

type ResponseObject = {
  isSuccess: boolean
  data?: any
  message?: string
}

interface TravellingObject {
  cityId: number
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
  params: any[]
  // params: [
  // $group?: {}
  // $match?: {}
  // from?: string
  // localField?: string
  // foreignField?: string
  // as?: string
  // innerJoin?: InnerJoin
  // $project?: {}
  // $count?: {}
  // $sort?: {}
  // ]
}

interface PostRequest {
  url: string
  body: any
}

interface MessageObj {
  _id: string
  message: string
  profile: { name: string; place: Place }
}

interface MongoInsertRes {
  acknowledged?: boolean
  insertedCount?: number
  insertedIds?: {}
  error?: {}
}

interface IUser {
  id: string
  profile: {
    name: string
    picture: string
  }
}
