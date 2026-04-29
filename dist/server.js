"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vite_1 = require("vite");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const luhn_1 = require("./src/utility/luhn_algorithm/luhn");
// Swagger Definition
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Card Validator API",
            version: "1.0.0",
            description: "A secure API to validate credit card numbers using the Luhn Algorithm.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development Server",
            },
        ],
    },
    apis: ["./server.ts"], // Path to the API docs
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
async function startServer() {
    const app = (0, express_1.default)();
    const PORT = 3000;
    // Middleware
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json());
    // Swagger UI
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    /**
     * @openapi
     * /api/validate:
     *   post:
     *     summary: Validate a credit card number
     *     description: Uses the Luhn Algorithm to check if a card number is valid and identifies the network.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               cardNumber:
     *                 type: string
     *                 example: "4539 1234 5678 9012"
     *     responses:
     *       200:
     *         description: Returns validation result
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 valid:
     *                   type: boolean
     *                 cardNumber:
     *                   type: string
     *                 network:
     *                   type: string
     *                 timestamp:
     *                   type: string
     *       400:
     *         description: Missing or empty input
     *       422:
     *         description: Invalid characters in card number
     */
    app.post("/api/validate", (req, res) => {
        const { cardNumber } = req.body;
        // 1. Check for missing input
        if (cardNumber === undefined || cardNumber === null) {
            return res.status(400).json({
                valid: false,
                error: "Card number is required",
                code: "MISSING_INPUT"
            });
        }
        // 2. Ensure input is a string or number
        const cardNumberStr = String(cardNumber).trim();
        // 3. Check for empty string
        if (cardNumberStr.length === 0) {
            return res.status(400).json({
                valid: false,
                error: "Card number cannot be empty",
                code: "EMPTY_INPUT"
            });
        }
        // 4. Check for invalid characters (non-digits, allowing spaces and hyphens)
        if (/[^0-9\s-]/.test(cardNumberStr)) {
            return res.status(422).json({
                valid: false,
                error: "Card number contains invalid characters. Only digits, spaces, and hyphens are allowed.",
                code: "INVALID_CHARACTERS"
            });
        }
        // 5. Perform validation
        const isValid = (0, luhn_1.validateLuhn)(cardNumberStr);
        const network = isValid ? (0, luhn_1.getCardNetwork)(cardNumberStr) : "Unknown";
        // 6. Return response
        return res.status(200).json({
            valid: isValid,
            cardNumber: cardNumberStr.replace(/\d(?=\d{4})/g, "*"), // Mask for privacy except last 4
            network,
            timestamp: new Date().toISOString()
        });
    });
    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", service: "Card Validator API" });
    });
    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await (0, vite_1.createServer)({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    }
    else {
        const distPath = path_1.default.join(process.cwd(), "dist");
        app.use(express_1.default.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path_1.default.join(distPath, "index.html"));
        });
    }
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
startServer();
//# sourceMappingURL=server.js.map