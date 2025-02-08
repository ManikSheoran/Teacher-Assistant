import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE_PATH,
})

const uploadToFirebaseStorage = async (filepath, fileName) => {
    try {
        const gcs = storage.bucket("paper-images")
        const storagepath = `storage_folder/${fileName}`
        const result = await gcs.upload(filepath, {
            destination: storagepath,
            predefinedAcl: "publicRead",
            metadata: {
                contentType: "application/plain",
            },
        })
        return result[0].metadata.mediaLink
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
}

const data = await uploadToFirebaseStorage("./Screenshot.png", "Screenshot.png")
console.log(data)