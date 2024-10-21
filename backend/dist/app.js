"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./json/swagger_output.json"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
app.use((0, cookie_parser_1.default)());
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
app.use("/api/v1/product", product_routes_1.default);
app.use("/api/v1/analytics", analytics_routes_1.default);
// app.get("*", (req: Request, res: Response) => {
//   res.sendFile(
//     path.join(__dirname, "../../frontend/dist/index.html")
//   );
// })
const options = { explorer: true, };
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, options));
