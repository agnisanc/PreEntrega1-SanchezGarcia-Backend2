import { userModel } from "../dao/userModel.js";
import { generateToken } from "../utils/jwt.js"

class AuthController {
    async login (req, res) {
        console.log(req.user);

        const payload = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            role: req.user.role,
        };

        const token = generateToken(payload);

        res.cookie("token", token, {
            maxAge: 1000 * 60 * 5,
            httpOnly: true,
        })

        res.status(200).json({ message: "Your login executed succesfuly!"})
    }

    async register(req, res) {
        const { first_name, last_name, email, password, age, role } = req.body;

        if (!first_name || !last_name || !email || !password || !age || !role) {
            return res.status(400).json({
                error: "All fields of information must be completed."
            });
        }

        try {
            const userExist = await userModel.findOne({ email });
            if (userExist) {
                return res.status(400).json({
                    error: "This user already exist."
                });
            }

            const user = new userModel({
                first_name,
                last_name,
                email,
                age,
                password,
                role
            });

            await user.save();
            res.suatus(201).json({ message: "Your user has been created."})
        } catch (error) {
            res.status(500).json({
                error: "An error occured",
            });
        }
    }

    async current(req, res) {
        console.log(req.user);

        res.json({ message: "User logged succesfully.", user: req.user})
    }

    async logout(req, res) {
        req.clearCookie("token");

        res.redirect("/")
    }

    async loginError(req, res) {
        res.status(401).json({ message: "User or password are incorrect."})
    }
}

export default new AuthController();