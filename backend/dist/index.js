"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./db/connectDB"));
const app_1 = require("./app");
dotenv_1.default.config({ path: './env' });
const PORT = process.env.PORT || 8000;
(0, connectDB_1.default)()
    .then(() => {
    app_1.app.listen(PORT, () => {
        console.log(`Server is running at port : http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.log(`MongoDB connection Failed: ${err}`);
});
