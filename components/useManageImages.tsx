import React, { useEffect, useState } from "react"

interface ImageMetaData {
  method: "UPLOAD_IMAGE" | "REMOVE_IMAGE"
  base64: string
}
function useManageImages() {
  const [imageMetadata, setImageMetadata] = useState<ImageMetaData>(null)

  // listener
  useEffect(() => {
    if (imageMetadata) {
      console.log("got: ", imageMetadata.method)
      setImageMetadata(null)
    }
  }, [imageMetadata])

  return { imageMetadata, setImageMetadata }
}

export default useManageImages
