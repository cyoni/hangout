type City = {
  city: string
}

type Country = {
  countryCode: string
  country: string
}

type State = {
  state: string
  //state_code: string
}

type Place = {
  _id: string
  placeId: string
  cityId?: string
  resultType: "city" | "country"
  lon: number
  lat: number
  formatted: string
} & City &
  State &
  Country

type ResponseObject = {
  data?: any
  error?: string
}

interface TravelingObject {
  placeId: number
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
  isRead: boolean
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
  placeId: string
}

type Profile = {
  userId: string
  name: string
  picture: string
  wrapPicture: string
  placeId: string
  aboutMe: string
  timeline: any
}

type Post = {
  _id: string
  name: string
  userId: string
  timestamp: number
  message: string
  profile: Profile[]
}

type MyFollowing = {
  members: { _id: string; profile: Profile; userId: string }[]
  cities: { placeIds: number[] }
}

declare type IComment = {
  _id: string
  name: string
  message: string
  profile: Profile[]
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
  cities: { placeIds: number[] }
}

interface ResultHandler {
  isSuccess?: boolean
  value?: any
  error?: string
}

interface SignupRes {
  codeId: string
}
