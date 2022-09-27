import { ActionTypes } from "@mui/base"
import { useMutation } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { IMAGE_MANAGER_API } from "../../lib/consts/apis"
import { post } from "../../lib/postman"

interface ImageMetaData {
  method:
    | "UPLOAD_IMAGE"
    | "REMOVE_IMAGE"
    | "UPLOAD_WRAPPER_IMAGE"
    | "REMOVE_WRAPPER_IMAGE"
  base64?: string
}
function useManageImages() {
  const [imageMetadata, triggerImage] = useState<ImageMetaData>(null)

  const triggerImageMutation = () => {
    return post({
      url: IMAGE_MANAGER_API,
      body: {
        method: imageMetadata.method,
        base64: imageMetadata.base64,
      },
    })
  }

  const imageMutation = useMutation(triggerImageMutation)

  const action = async () => {
    try {
      await imageMutation.mutateAsync()
    } catch (e) {
      console.log("image mutation, error", e)
    }
  }

  // listeners
  useEffect(() => {
    if (imageMetadata) {
      console.log("got: ", imageMetadata.method)
      action()
      triggerImage(null)
    }
  }, [imageMetadata])

  return { imageMetadata, triggerImage, imageMutation }
}

export default useManageImages
