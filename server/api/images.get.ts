import { promises as fs } from "fs"
export default defineEventHandler(async (event) => {
  // Get all image names from 'public/images' folder
  const images = await fs.readdir("public/images")
  // Return the image names
  return images
})
