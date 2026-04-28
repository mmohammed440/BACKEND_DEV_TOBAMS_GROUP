import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { validateLuhn, getCardNetwork } from "./src/utility/luhn_algorithm/luhn";

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

const swaggerSpec = swaggerJsdoc(swaggerOptions);

async function startServer() {
    const app = express();
    const PORT = 3000;

    // Middleware
    app.use(cors());
    app.use(bodyParser.json());

    // Swagger UI
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));




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
    app.post("/api/validate", (req: Request, res: Response) => {
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
        const isValid = validateLuhn(cardNumberStr);
        const network = isValid ? getCardNetwork(cardNumberStr) : "Unknown";

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
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
