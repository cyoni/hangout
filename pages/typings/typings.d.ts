import { ObjectId } from "mongodb"

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
  profile: Profile[]

  message: string
  receiverId: string
  senderId: string
  sharedToken: string
  theirId: string
  timestamp: number
}

interface MongoInsertRes {
  acknowledged?: boolean
  insertedCount?: number
  insertedIds?: {}
  error?: string
}

interface MongoInsertOneRes {
  acknowledged?: boolean
  insertedId?: {}
  error?: {}
}

type MongoUpdateRes = {
  acknowledged?: boolean
  matchedCount?: number
  modifiedCount?: number
  upsertedCount?: number
  error?: string
}

type IUser = {
  _id: ObjectId
  metadata: {
    pictureId: string
  }
  userId: string
  name: string
  picture: string
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
  _id: string
  name: string
  userId: string
  timestamp: number
  message: string
}

type MyFollowing = {
  members: { _id: string; profile: Profile; userId: string }[]
  cities: { cityIds: number[] }
}

type IComment = {
  _id: string
  name: string
  message: string
  profile: []
  timestamp: number
}

type UploadImageRes = {
  fileId: string
  name: string
  size: number
  filePath: string
  url: string
  fileType: string
  height: number
  width: number
  thumbnailUrl: string
  AITags: any
  extensionStatus: { "google-auto-tagging": string }
}

type Member = {
  _id: string
  userId: string
  profile: Profile
}

type Following = {
  members: Member[]
  cities: { cityIds: number[] }
}
