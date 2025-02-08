import { Storage } from '@google-cloud/storage'
import dotenv from 'dotenv'

dotenv.config({
    path: "./.env"
})

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE_PATH,
})

console.log(process.env.GCP_PROJECT_ID)

const uploadToFirebaseStorage = async (filepath, fileName) => {
    try {
        const gcs = storage.bucket("paper-images"); // Removed "gs://" from the bucket name
        const storagepath = `storage_folder/${fileName}`;
        const result = await gcs.upload(filepath, {
            destination: storagepath,
            predefinedAcl: "publicRead", // Set the file to be publicly readable
            metadata: {
                contentType: "application/plain", // Adjust the content type as needed
            },
        });
        return result[0].metadata.mediaLink;
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

const data = await uploadToFirebaseStorage("./Screenshot.png", "Screenshot.png")
console.log(data)