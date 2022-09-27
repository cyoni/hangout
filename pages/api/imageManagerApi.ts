import { REMOVE_WRAPPER_IMAGE, UPLOAD_WRAPPER_IMAGE } from "./../../lib/consts"
import { UPLOAD_IMAGE, REMOVE_IMAGE, USERS_COLLECTION } from "../../lib/consts"
import { getToken } from "next-auth/jwt"
import { NextApiResponse } from "next"
import { NextApiRequest } from "next"
import { dbFind, dbUpdateOne } from "../../lib/mongoUtils"
import { IUser, UploadImageRes } from "../typings/typings"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { getImageKit } from "../../lib/ImageKit"
import sharp from "sharp"
import { updateUserPictureInDb } from "../../lib/profileUtils"

type Response = {
  error?: string
}
const DEFAULT_APP_FOLDER = "hangouts"

var imageKit = getImageKit()

async function getCompressedImage(imageSource) {
  try {
    let parts = imageSource.split(";")
    let mimType = parts[0].split(":")[1]
    let imageData = parts[1].split(",")[1]
    var img = Buffer.from(imageData, "base64")
    const resizedImageBuffer = await sharp(img).jpeg({ quality: 60 }).toBuffer()
    const resizedImageData = resizedImageBuffer.toString("base64")
    const resizedBase64 = `data:${mimType};base64,${resizedImageData}`
    return resizedBase64
  } catch (e) {
    return { error: e.message }
  }
}

async function imageKitDelete(pictureId) {
  try {
    if (isNullOrEmpty(pictureId)) return
    const result = await imageKit.deleteFile(pictureId)
    return result
  } catch (e) {
    return { error: `error in imageKitDelete: ${e.message}` }
  }
}
async function imageKitUpload(userId, imageSource): Promise<UploadImageRes> {
  try {
    if (isNullOrEmpty(userId) || isNullOrEmpty(imageSource))
      throw new Error("userId or imageSource is null")

    const compressedImage = await getCompressedImage(imageSource)
    if (compressedImage.error) throw new Error(compressedImage.error)

    const result = await imageKit.upload({
      file: compressedImage,
      fileName: `${userId}.jpg`,
      folder: DEFAULT_APP_FOLDER,
      useUniqueFileName: true,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    })

    return result
  } catch (e) {
    console.log("error in imageKitUpload:", e.message)
    return { error: e.message }
  }
}
async function uploadImage(params, userId, isProfilePicture) {
  try {
    const { base64 } = params

    // wrap picture and profile picture have the same logic.
    const pictureKey = getPictureKey(isProfilePicture)
    const pictureIdKey = getPictureKeyType(isProfilePicture)

    // get picture id from user
    const user: IUser = (await dbFind(USERS_COLLECTION, { userId }))[0]
    const pictureId = user.metadata?.[pictureIdKey]

    // upload new picture
    const uploadImageResponse = await imageKitUpload(userId, base64)
    if (uploadImageResponse.error) throw new Error(uploadImageResponse.error)

    // remove old picture
    if (pictureId) await imageKitDelete(pictureId)

    // update picture id and picture url in user profile
    const dbUploadImageResponse = await updateUserPictureInDb({
      userId,
      name: uploadImageResponse.name,
      fileId: uploadImageResponse.fileId,
      pictureIdKey,
      pictureKey,
    })

    // check if picture was updated in db
    if (dbUploadImageResponse.error) {
      await imageKitDelete(uploadImageResponse.fileId)
      throw new Error("Picture could not be updated in db.")
    }

    return "image was successfully uploaded!"
  } catch (e) {
    console.log(`error in uploadImage: ${e.message}`)
    return { error: `error in uploadImage: ${e.message}` }
  }
}
function getPictureKey(isProfilePicture) {
  return isProfilePicture ? "picture" : "wrapPicture"
}

function getPictureKeyType(isProfilePicture) {
  return isProfilePicture ? "pictureId" : "wrapPictureId"
}

async function removeImage(userId, isProfilePicture) {
  try {
    // get picture id from user
    const user: IUser = (await dbFind(USERS_COLLECTION, { userId }))[0]
    const keyType = getPictureKeyType(isProfilePicture)
    const pictureKey = getPictureKey(isProfilePicture)

    const pictureIdKey = user.metadata[keyType]
    console.log("user.metadata[keyType]", user.metadata[keyType])
    console.log("user.metadata", user.metadata)
    console.log("keyType", keyType)

    // remove old picture from user
    const imageKitDeleteResponse = await imageKitDelete(pictureIdKey)
    if (imageKitDeleteResponse.error)
      throw new Error(imageKitDeleteResponse.error)

    // update picture id and picture url in user profile

    const dbUploadImageResponse = await dbUpdateOne(
      USERS_COLLECTION,
      { userId },
      { $set: { [pictureKey]: null, [`metadata.${keyType}`]: null } },
      {}
    )
    console.log("dbUploadImageResponse", dbUploadImageResponse)
    if (!dbUploadImageResponse.modifiedCount) {
      throw new Error("could not update picture in db")
    }

    return "image was successfully removed!"
  } catch (e) {
    console.log(`error in removeImage: ${e.message}`)
    return { error: `error in removeImage: ${e.message}` }
  }
}

// important for uploads (in use!)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const user = await getToken({ req })
    if (!user?.userId)
      return res.status(400).json({ error: "user is not authenticated" })

    const { method } = req.body

    if (!method) return res.status(400).json({ error: "bad request." })

    let result = null

    switch (method) {
      case UPLOAD_IMAGE:
        result = await uploadImage(req.body, user.userId, true)
        break
      case UPLOAD_WRAPPER_IMAGE:
        result = await uploadImage(req.body, user.userId, false)
        break
      case REMOVE_IMAGE:
        result = await removeImage(user.userId, true)
        break
      case REMOVE_WRAPPER_IMAGE:
        result = await removeImage(user.userId, false)
    }

    if (!result || result.error)
      return res.status(400).json({ error: `error: ${result?.error} ` })

    return res.status(200).json(result)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
