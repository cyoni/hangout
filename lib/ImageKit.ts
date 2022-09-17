import ImageKit from "imagekit"

export const getImageKit = () =>
  new ImageKit({
    publicKey: "public_idOZtkpuJiCLONFbXtx3KckAuuc=",//process.env.PICTURES_SERVICE_PUBLIC_KEY,
    privateKey: "private_5VcOwCODjQo3rwFb4OBzXPA7mB4",//process.env.PICTURES_SERVICE_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/dldkzlucu/"// process.env.PICTURES_SERVICE_ENDPOINT,
  })
