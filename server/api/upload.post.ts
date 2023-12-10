import path from "path"
import fs from "fs"
import { convertPhotoName } from "../utils"

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  const filesPaths: string[] = []
  const filesNames: string[] = []

  if (!files) {
    setResponseStatus(event, 400)
    return {
      error: "No files found"
    }
  }

  files?.forEach((file) => {
    const fileName = convertPhotoName(file.filename as string)
    const filePath = path.join(process.cwd(), "public", "images", fileName)
    console.log("filePath ::: ", filePath)

    fs.writeFileSync(filePath, file.data)
    filesPaths.push(`/images/${fileName}`)
    filesNames.push(fileName)
  })

  setResponseStatus(event, 201)
  return {
    message: "Files uploaded successfully",
    filesPaths,
    filesNames
  }
})
