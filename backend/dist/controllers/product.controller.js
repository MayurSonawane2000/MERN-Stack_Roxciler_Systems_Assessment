"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.getAllProductsData = exports.initDataHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const product_model_1 = __importDefault(require("../models/product.model"));
const api_1 = require("../api/api");
const initDataHandler = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['Products ']
    const existingProducts = yield product_model_1.default.find();
    if (existingProducts.length > 0) {
        return res.status(200).json(new ApiResponse_1.ApiResponse(200, existingProducts, "Database already initialized with seed data"));
    }
    const response = yield (0, api_1.getProductData)();
    // console.log(response);
    const product = yield product_model_1.default.insertMany(response);
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, product, "Database initialized with seed data"));
}));
exports.initDataHandler = initDataHandler;
const getAllProductsData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['Products ']
    const products = yield product_model_1.default.find().sort({ id: 'asc' });
    if (products.length === 0) {
        throw new ApiError_1.ApiError(404, "No products found");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, products, "Products retrieved successfully"));
}));
exports.getAllProductsData = getAllProductsData;
const searchProduct = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['Products ']
    // console.log(req.query)
    const query = constructorSearchQuery(req.query);
    const pageSize = 10;
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
    if (isNaN(pageNumber) || pageNumber < 1) {
        throw new ApiError_1.ApiError(400, "Invalid page number");
    }
    const skip = (pageNumber - 1) * pageSize;
    const product = yield product_model_1.default
        .find(query)
        .skip(skip)
        .limit(pageSize);
    const total = yield product_model_1.default.countDocuments();
    const response = {
        data: product,
        pagination: {
            total,
            page: pageNumber,
            pages: Math.ceil(total / pageSize)
        }
    };
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, response, "Products retrieved successfully"));
}));
exports.searchProduct = searchProduct;
const constructorSearchQuery = (queryParams) => {
    const { searchText, selectedMonth } = queryParams;
    let constructedQuery = {};
    if (searchText) {
        constructedQuery.$or = [
            { title: new RegExp(searchText, "i") },
            { description: new RegExp(searchText, "i") },
            { price: !isNaN(parseFloat(searchText)) ? parseFloat(searchText) : null },
        ];
    }
    if (selectedMonth) {
        const startDate = new Date(`${selectedMonth}-01T00:00:00Z`);
        const endDate = new Date(`${selectedMonth}-31T23:59:59Z`);
        constructedQuery.dateOfSale = { $gte: startDate, $lte: endDate };
    }
    return constructedQuery;
};
