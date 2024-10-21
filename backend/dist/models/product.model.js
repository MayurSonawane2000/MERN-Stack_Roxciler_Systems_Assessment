"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    id: { type: "number", required: true, },
    title: { type: "string", required: true, lowercase: true, trim: true, index: true, },
    description: { type: "string", required: true, lowercase: true, trim: true, index: true, },
    price: { type: "number", required: true },
    category: { type: "string", required: true },
    image: { type: "string", required: true },
    sold: { type: "boolean", required: true },
    dateOfSale: { type: "string", required: true },
}, { timestamps: true });
const Product = mongoose_1.models.Product || (0, mongoose_1.model)("Product", productSchema);
exports.default = Product;
