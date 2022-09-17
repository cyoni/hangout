import { ActionTypes } from "@mui/base"
import { useMutation } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { IMAGE_MANAGER_API } from "../lib/consts/apis"
import { post } from "../lib/postman"

interface ImageMetaData {
  method: "UPLOAD_IMAGE" | "REMOVE_IMAGE"
  base64: string
}
function useManageImages() {
  const [imageMetadata, setImageMetadata] = useState<ImageMetaData>(null)

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

  // listener
  useEffect(() => {
    if (imageMetadata) {
      console.log("got: ", imageMetadata.method)
      action()
      setImageMetadata(null)
    }
  }, [imageMetadata])

  return { imageMetadata, setImageMetadata, imageMutation }
}

export default useManageImages
