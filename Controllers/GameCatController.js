import express from "express";
import errorHandling from "../Middlewares/ErrorHandling.js"
import GameCategory from "../Modules/GameCategory.js";
const router = express.Router();

router.post("/addCategory", errorHandling(async (req, res) => {
    const { category } = req.body;

    if (!category) return res.status(400).json({ message: "Category not found" })

    const existingCategory = await GameCategory.findOne({
        category: { $regex: new RegExp("^" + category + "$", "i") },
    });

    if (existingCategory) return res.status(400).json({ message: "Category already exists" });

    const Allategory = await GameCategory.create({ category });
    res.json(Allategory);
}));

router.get("/getCategory", errorHandling(async (req, res) => {
    const Getcategory = await GameCategory.find({});
    res.json(Getcategory);
}));

router.get("/categoryById/:id", errorHandling(async (req, res) => {
    const Getcategory = await GameCategory.findById(req.params.id);
    if (!Getcategory) {
        return res.status(404).json({ message: "Dont find Category" });
    }
    res.json(Getcategory);

}));

router.delete("/delCategory/:id", errorHandling(async (req, res) => {
    const Getcategory = await GameCategory.findByIdAndDelete(req.params.id);
    if (!Getcategory) {
        return res.status(404).json({ message: "Don't find Category" });
    }
    res.json({ message: "Category deleted successfully" });
}));

router.put("/editCategory/:id", errorHandling(async (req, res) => {
    const { category } = req.body;

    const gameCategory = await GameCategory.findByIdAndUpdate(
        req.params.id,
        { category },
        { new: true }
    );

    if (!gameCategory) return res.status(404).json("Category not found")

    res.json(gameCategory);
}));

router.get("/blogCategoryCount", errorHandling(async (req, res) => {
    const categoryCount = await GameCategory.countDocuments({})
    res.json(categoryCount)
}))

export default router;
