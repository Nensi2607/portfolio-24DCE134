
require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not configured in .env");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured in .env");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(port, "0.0.0.0", () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });
