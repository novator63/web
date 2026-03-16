import BlacklistedToken from "../models/BlacklistedToken.js";

const checkBlacklist = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        
        const blacklisted = await BlacklistedToken.findOne({ where: { token } });

        if (blacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export default checkBlacklist;