import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js";
import bcrypt from "bcrypt"
import User from "../Modules/User.js";
const router = express.Router()

const adminUser = async () => {
    const adminName = "Admin User"
    const adminEmail = "softseedssolution@gmail.com"
    const adminPassword = "Softseeds@@1234"
    const checkAdmin = await User.findOne({ email: adminEmail })
    if (checkAdmin) return null;
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "Admin"
    })
}

adminUser()

router.post("/login-user", errorHandling(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Fields with * should be filled" })
    const checkUserEmail = await User.findOne({ email });
    if (!checkUserEmail) return res.status(404).json({ message: "Credentials did not match" });

    const checkUserPassword = await bcrypt.compare(password, checkUserEmail.password);
    if (!checkUserPassword) return res.status(404).json({ message: "Credentials did not match" });

    res.json(checkUserEmail)
}))

export default router;