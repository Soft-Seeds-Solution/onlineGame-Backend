import express from "express";
import cors from "cors"
import connectToMongoDb from "./db.js";
import productController from "./Controllers/ProductController.js";
import GameCatController from "./Controllers/GameCatController.js";
import UserController from "./Controllers/UserController.js";
const app = express()
app.use(cors({
    origin: "*"
}))
app.use(express.json())
connectToMongoDb()

app.use("/api/gameCat", GameCatController)
app.use("/api/games", productController)
app.use("/api/user", UserController)

app.listen(8000, () => {
    console.log("App listing at http://localhost:8000");
})