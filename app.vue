<script lang="ts" setup>
const NO_DATA_TEXT = "No files currently selected for upload"
const fileInput = ref<HTMLInputElement | null>(null)
const preview = ref<HTMLDivElement | null>(null)
const files = ref<FileList | null>(null)

const handleFileUpload = () => {
  files.value = fileInput.value!.files
  if (!files.value || !files.value.length) {
    preview.value!.innerHTML = NO_DATA_TEXT
    return
  }
  handleFilesDisplay(files.value)
}

const handleFilesDisplay = (files: FileList) => {
  preview.value!.innerHTML = ""
  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement("img")
      img.src = e.target!.result as string
      img.width = 200
      img.height = 200
      preview.value!.appendChild(img)
    }
    reader.readAsDataURL(file)
  })
}

const handleSubmit = async () => {
  if (!files.value || !files.value.length) {
    console.log("no files")
    return
  }
  const formData = new FormData()
  Array.from(files.value).forEach((file) => {
    formData.append("image_uploads", file)
  })

  try {
    const res = await $fetch<{
      filesNames: string[]
    }>("/api/upload", {
      method: "POST",
      body: formData
    })
    console.log("res", res)
    console.log("images before", images.value)
    images.value!.push(...res.filesNames)
    console.log("images after", images.value)

    preview.value!.innerHTML = NO_DATA_TEXT
    fileInput.value!.value = ""
  } catch (error) {
    console.log(error)

    alert("Error uploading images")
  }
}

onMounted(() => {
  fileInput.value!.addEventListener("change", handleFileUpload)
})

// Get Images
const { data: images } = useFetch<string[]>("/api/images")
</script>

<template>
  <main>
    <h1>Image Uploader</h1>
    <!-- Upload Images Form - test API -->

    <form
      method="post"
      enctype="multipart/form-data"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label for="image_uploads">Choose images to upload</label>
        <input
          ref="fileInput"
          type="file"
          id="image_uploads"
          name="image_uploads"
          accept="image/*"
          multiple
        />
      </div>

      <div>
        <button>Submit</button>
      </div>

      <div ref="preview" class="preview">
        <p>{{ NO_DATA_TEXT }}</p>
      </div>
    </form>

    <div class="available-images">
      <h2>Available Images</h2>
      <ul class="images-links">
        <li v-for="(image, idx) in images" :key="idx">
          <a :href="`/images/${image}`" target="_blank"> {{ image }} </a>
        </li>
      </ul>
    </div>
  </main>
</template>

<style scoped>
main {
  margin: 0 auto;
  max-width: 800px;
  padding: 1em;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}
input[type="file"] {
  display: none;
}
label {
  display: inline-block;
  padding: 1rem 2rem;
  background: #f7f4f4;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #000;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
label:hover {
  background: #eae7e7;
}

button {
  display: inline-block;
  padding: 1rem 2rem;
  background: #f7f4f4;
  border-radius: 0.25rem;
  cursor: pointer;
  color: #000;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
button:hover {
  background: #eae7e7;
}
.preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  place-items: center;
  width: 100%;
  min-height: 300px;
  border: 1px dashed #999;
  margin: 1rem 0;
}
.preview :deep(img) {
  border: 1px solid #ddd;
  object-fit: contain;
}
.available-images {
  text-align: start;
}
.available-images ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
}
.available-images ul li {
  list-style: square;
  list-style-position: inside;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
