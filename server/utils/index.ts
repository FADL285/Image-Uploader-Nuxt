import path from "path"

const uuid = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36)

export const convertPhotoName = (photoName: string) => {
  const ext = path.extname(photoName)
  const name = path.basename(photoName, ext)

  const readableName = name
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/-$/, "")
    .replace(/^-/, "")
    .toLowerCase()

  return `${readableName}-${uuid()}${ext}`
}
