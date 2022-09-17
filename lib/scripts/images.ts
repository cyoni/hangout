async function getBase64(file) {
  return new Promise((resolve) => {
    let baseURL = ""
    // Make new FileReader
    let reader = new FileReader()

    // Convert the file to base64 text
    reader.readAsDataURL(file)

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result
      resolve(baseURL)
    }
  })
}

export async function convertToBase64(e) {
  let file = e.target.files[0]
  const result = await getBase64(file)
  return result
}
