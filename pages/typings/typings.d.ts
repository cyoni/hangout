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

type Place = {} & City & Province & Country

type ResponseObject = {
  data?: any
  error?: string
}

interface TravelingObject {
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

interface MessageObjResponse {
  unreadMsgsIds: string[]
  previewMsgs: MessageObj[]
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
  error?: string
}

interface MongoInsertOneRes {
  acknowledged: boolean
  insertedId: string
}

interface MongoUpdateRes {
  acknowledged?: boolean
  matchedCount?: number
  modifiedCount?: number
  upsertedCount?: number
  error?: string
}

interface IUser {
  id: string
  profile: {
    name: string
    picture: string
  }
}

type Profile = {
  userId: string
  name: string
  picture: string
  cityId: number
  aboutMe: string
  timeline: any
}

type Post = {
  name: string
  userId: string
  timestamp: number
  message: string
}

type MyFollowing = {
  members: { _id: string; profile: Profile; userId: string }[]
  cities: { cityIds: number[] }
}
