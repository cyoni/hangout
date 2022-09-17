import ImageKit from "imagekit"

export const getImageKit = () =>
  new ImageKit({
    publicKey: process.env.PICTURES_SERVICE_PUBLIC_KEY,
    privateKey: process.env.PICTURES_SERVICE_PRIVATE_KEY,
    urlEndpoint: process.env.PICTURES_SERVICE_ENDPOINT,
  })
