"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
class JWTService {
    static generateTokenForUser(user) {
        const payload = {
            user
        };
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables.");
        }
        const JWTtoken = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
        return JWTtoken;
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
}
exports.default = JWTService;
