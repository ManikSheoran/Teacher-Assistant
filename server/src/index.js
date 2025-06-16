import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

// Add health check endpoint for Docker
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Use PORT environment variable for Back4App compatibility
const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
