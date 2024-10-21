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
exports.combinedDataAPI = exports.pieChartOfTheProductRoutes = exports.barChartOfTheProductRoutes = exports.statisticsOfTheProductRoutes = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const asyncHandler_1 = require("../utils/asyncHandler");
const product_model_1 = __importDefault(require("../models/product.model"));
const statisticsOfTheProductRoutes = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['statistics']
    const { month } = req.query;
    if (!month)
        return res.status(400).json({ message: "Provide month" });
    const query = {
        $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, parseInt(month)],
        },
    };
    const data = yield product_model_1.default.find(query);
    const totalSaleAmount = data.reduce((acc, product) => acc + product.price, 0);
    const soldItem = data.filter((product) => product.sold === true).length;
    const notSoldItem = data.filter((product) => product.sold !== true).length;
    const response = {
        totalSaleAmount,
        soldItem,
        notSoldItem,
    };
    return res.status(200).json({ statusCode: 200, response, message: "", success: true });
}));
exports.statisticsOfTheProductRoutes = statisticsOfTheProductRoutes;
const barChartOfTheProductRoutes = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['statistics']
    const { month } = req.query;
    const startDate = new Date(`${month}-01T00:00:00Z`);
    const endDate = new Date(`${month}-31T23:59:59Z`);
    const priceRanges = [
        { range: '0-100', min: 0, max: 100 },
        { range: '101-200', min: 101, max: 200 },
        { range: '201-300', min: 201, max: 300 },
        { range: '301-400', min: 301, max: 400 },
        { range: '401-500', min: 401, max: 500 },
        { range: '501-600', min: 501, max: 600 },
        { range: '601-700', min: 601, max: 700 },
        { range: '701-800', min: 701, max: 800 },
        { range: '801-900', min: 801, max: 900 },
        { range: '901-above', min: 901, max: Infinity }
    ];
    const priceRangeCounts = yield Promise.all(priceRanges.map(({ range, min, max }) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield product_model_1.default.countDocuments({
            dateOfSale: { $gte: startDate, $lte: endDate },
            price: Object.assign({ $gte: min }, (max !== Infinity ? { $lte: max } : {}))
        });
        return { range, count };
    })));
    const response = { priceRangeCounts };
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, response, ""));
}));
exports.barChartOfTheProductRoutes = barChartOfTheProductRoutes;
const pieChartOfTheProductRoutes = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['statistics']
    const { month } = req.query;
    if (!month || isNaN(parseInt(month))) {
        throw new ApiError_1.ApiError(400, "Provide a valid month");
    }
    const query = {
        $expr: {
            $eq: [{ $month: { $toDate: "$dateOfSale" } }, parseInt(month)],
        },
    };
    const categoryCounts = yield product_model_1.default.aggregate([
        { $match: query },
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
            },
        },
    ]);
    const response = categoryCounts.reduce((acc, categoryCount) => {
        acc[categoryCount._id] = categoryCount.count;
        return acc;
    }, {});
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, response, "Successfully retrieved pie chart data."));
}));
exports.pieChartOfTheProductRoutes = pieChartOfTheProductRoutes;
const combinedDataAPI = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //#swagger.tags = ['statistics']
    const { month } = req.query;
    if (!month || isNaN(parseInt(month))) {
        throw new ApiError_1.ApiError(400, "Provide a valid month");
    }
    const URL = `http://localhost:8000/api/v1/analytics/`;
    const [statistics, barChart, pieChart] = yield Promise.all([
        fetch(`${URL}statistics?month=${month}`).then(response => response.json()),
        fetch(`${URL}bar-chart?month=${month}`).then(response => response.json()),
        fetch(`${URL}pie-chart?month=${month}`).then(response => response.json()),
    ]);
    const response = {
        statistics,
        barChart,
        pieChart,
    };
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, response, "Combined data retrieved successfully"));
}));
exports.combinedDataAPI = combinedDataAPI;
