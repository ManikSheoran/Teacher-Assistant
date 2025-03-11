import app from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);
})