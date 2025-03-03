import express from "express";
import Products from "../Modules/Products.js"
import upload from "../Middlewares/ImgFilter.js";
import errorHandling from "../Middlewares/ErrorHandling.js";
import Cloudinary from "../Cloudinary.js";

const router = express.Router();

router.post("/upload-game", upload.single("thumbnail"), errorHandling(async (req, res) => {
    const { title, categoryId, shortDes, description, gameUrl, howToPlay, whoCreated, keywords, orientation } = req.body
    if (!title || !categoryId || !shortDes || !gameUrl || !howToPlay || !orientation || !keywords) return res.status(400).json({ message: "Fields with * should be filled" })

    const existingTitle = await Products.findOne({
        title: { $regex: new RegExp("^" + title + "$", "i") },
    });

    if (existingTitle) return res.status(400).json({ message: "Game with this title already exists" });

    let thumbnail_url;
    if (req.file) {
        const uploadTHumbnail = await Cloudinary.uploader.upload(req.file.path)
        thumbnail_url = uploadTHumbnail.secure_url
    }

    const keywordsArr = keywords.split(",").map((keyword) => keyword.trim())

    const uploadGame = await Products.create({
        title, categoryId, shortDes, description, thumbnail: thumbnail_url, gameUrl, howToPlay, whoCreated, keywords: keywordsArr, orientation
    })

    res.json(uploadGame)

}));

router.get("/uploaded-games", errorHandling(async (req, res) => {
    const uploadedGames = await Products.find().populate("categoryId");
    res.status(200).json(uploadedGames);
}));

router.get("/gameById/:id", errorHandling(async (req, res) => {
    const GetGame = await Products.findById(req.params.id).populate("categoryId");
    if (!GetGame) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json(GetGame);
}));

router.get("/gameByTitle/:title", errorHandling(async (req, res) => {
    const GetGame = await Products.findOne({ title: req.params.title }).populate("categoryId");
    if (!GetGame) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json(GetGame);
}));

router.delete("/delGame/:id", errorHandling(async (req, res) => {
    const DelGame = await Products.findByIdAndDelete(req.params.id);
    if (!DelGame) {
        return res.status(404).json({ message: "Game not found" });
    }
    res.json({ message: "Game deleted successfully" });
}));

router.put("/editGame/:id", upload.single("thumbnail"), errorHandling(async (req, res) => {
    const { title, categoryId, shortDes, description, gameUrl, howToPlay, whoCreated, keywords, orientation } = req.body;

    let newGameData = {}
    if (title) newGameData.title = title
    if (categoryId) newGameData.categoryId = categoryId
    if (shortDes) newGameData.shortDes = shortDes
    if (description) newGameData.description = description
    if (gameUrl) newGameData.gameUrl = gameUrl
    if (howToPlay) newGameData.howToPlay = howToPlay
    if (whoCreated) newGameData.whoCreated = whoCreated
    if (orientation) newGameData.orientation = orientation
    if (keywords) newGameData.keywords = keywords.split(",").map((keyword) => keyword.trim())
    if (req.file) {
        const uploadTHumbnail = await Cloudinary.uploader.upload(req.file.path)
        newGameData.thumbnail = uploadTHumbnail.secure_url
    }

    const gameData = await Products.findByIdAndUpdate(
        req.params.id,
        { $set: newGameData },
        { new: true }
    );

    if (!gameData) return res.status(404).json({ message: "Game not found" })

    res.json(gameData);
}));

export default router;
