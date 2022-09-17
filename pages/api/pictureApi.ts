import {
  UPLOAD_IMAGE,
  REMOVE_IMAGE,
  USERS_COLLECTION,
} from "./../../lib/consts"
import { getToken } from "next-auth/jwt"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"
import { error } from "console"
import { dbFind, dbUpdateOne } from "../../lib/mongoUtils"
import { IUser } from "../typings/typings"
import ImageKit from "imagekit"
import { isNullOrEmpty } from "../../lib/scripts/strings"

type Response = {
  error?: string
}

var imageKit = new ImageKit({
  publicKey: "public_idOZtkpuJiCLONFbXtx3KckAuuc=", //process.env.PICTURES_SERVICE_PUBLIC_KEY,
  privateKey: "private_5VcOwCODjQo3rwFb4OBzXPA7mB4=", //process.env.PICTURES_SERVICE_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/dldkzlucu", // process.env.PICTURES_SERVICE_ENDPOINT,
})

async function imageKitDelete(pictureId) {
  try {
    if (isNullOrEmpty(pictureId)) throw new Error("pictureId is null or empty")
    const result = await imageKit.deleteFile(pictureId)
    return result
  } catch (e) {
    return { error: `error in imageKitDelete: ${e.message}` }
  }
}
async function imageKitUpload(userId, imageSource) {
  try {
    if (isNullOrEmpty(userId) || isNullOrEmpty(imageSource))
      throw new Error("userId or imageSource is null")

    const result = await imageKit.upload({
      file: imageSource, //required
      fileName: `${userId}.jpg`, //required
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    })
    console.log("imageKitUpload: ", result)
    return result
  } catch (e) {
    console.log("error in imageKitUpload:", e.message)
    return { error: e.message }
  }
}
async function uploadImage(params, userId) {
  try {
    const { imageInBase64 } = params

    // get picture id from user
    const user: IUser = (await dbFind(USERS_COLLECTION, { userId }))[0]
    const pictureId = user.metadata?.pictureId

    // upload new picture

    const uploadImageResponse = await imageKitUpload(userId, imageInBase64)
    if (uploadImageResponse.error) throw new Error(uploadImageResponse.error)

    // update picture id and picture url in user profile

    const dbUploadImageResponse = await dbUpdateOne(
      USERS_COLLECTION,
      { userId },
      { ...user, picture: "test..", metadata: { pictureId: "##" } },
      {}
    )

    // remove old picture from user
    const imageKitDeleteResponse = await imageKitDelete(pictureId)
    if (imageKitDeleteResponse.error)
      throw new Error(imageKitDeleteResponse.error)

    return "image was successfully uploaded!"
  } catch (e) {
    console.log(`error in uploadImage: ${e.message}`)
    return { error: `error in uploadImage: ${e.message}` }
  }
}

async function removeImage(userId) {
  try {
    // get picture id from user
    const user: IUser = (await dbFind(USERS_COLLECTION, { userId }))[0]
    const pictureId = user.metadata?.pictureId

    // remove old picture from user
    const imageKitDeleteResponse = await imageKitDelete(pictureId)
    if (imageKitDeleteResponse.error)
      throw new Error(imageKitDeleteResponse.error)

    // update picture id and picture url in user profile

    const dbUploadImageResponse = await dbUpdateOne(
      USERS_COLLECTION,
      { userId },
      { ...user, picture: null, metadata: { pictureId: null } },
      {}
    )

    return "image was successfully removed!"
  } catch (e) {
    console.log(`error in removeImage: ${e.message}`)
    return { error: `error in removeImage: ${e.message}` }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const user = await getToken({ req })
    if (!user)
      return res.status(400).json({ error: "user is not authenticated" })

    const { method } = req.body
    if (!method) return res.status(400).json({ error: "bad request" })

    let result = null

    switch (method) {
      case UPLOAD_IMAGE:
        result = await uploadImage(req.body, user.userId)
      case REMOVE_IMAGE:
        result = await removeImage(user.userId)
    }

    if (!result || result.error)
      return res.status(400).json({ error: `error: ${result?.error} ` })

    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
