# Card Validator Pro - Backend Intern Assessment

A secure, high-performance API for validating credit card numbers using the industry-standard **Luhn Algorithm**.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server (Full-stack: API + UI):
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

### Running Tests
To verify the validation logic directly:
```bash
npx tsx src/utility/tests/luhn.test.ts
```

---

## 🛠 Project Structure

The project is architected to separate concerns, making it maintainable and testable:

- **`server.ts`**: The entry point. It sets up an Express server and integrates Vite as middleware to serve the frontend React application.
- **`src/utility/luhn_algorithm/luhn.ts`**: Contains the core domain logic. It implements the Luhn algorithm for validation and a network identifier function.
- **`src/utility/tests/luhn.test.ts`**: A dedicated test suite for the domain logic.
- **`src/App.tsx`**: A modern React frontend that interacts with the API, providing a user-friendly interface for testing.

---

## 📡 API Documentation

### POST `/api/validate`

**Request Body:**
```json
{
  "cardNumber": "string"
}
```

**Response (Success - 200 OK):**
```json
{
  "valid": true,
  "cardNumber": "************1234",
  "network": "Visa",
  "timestamp": "2026-04-27T21:10:00Z"
}
```

**Response (Error - 400/422):**
```json
{
  "valid": false,
  "error": "Card number contains invalid characters.",
  "code": "INVALID_CHARACTERS"
}
```

---

## 💡 Decisions & Assumptions

### 1. The Validation Logic: Luhn Algorithm
I chose the **Luhn Algorithm** (also known as Mod 10) because it is the global standard used by major card networks (Visa, Mastercard, Amex) to verify the integrity of card numbers. It efficiently catches single-digit errors and most transpositions.

### 2. Tech Stack: Express + TypeScript
While NestJS is powerful for large enterprise systems, I selected **Express** for this assessment to demonstrate a clear understanding of Node.js fundamentals without the abstraction "magic" of a heavy framework. TypeScript with `strict: true` ensures type safety and prevents common runtime errors.

### 3. Error Handling & Status Codes
- **400 Bad Request**: Used for missing inputs or empty strings.
- **422 Unprocessable Entity**: Used when the input format is fundamentally wrong (e.g., non-numeric characters). This follows RESTful best practices by distinguishing between "structure" errors and "data" errors.
- **Graceful Failures**: The API never crashes on malformed input; it returns a structured JSON error response.

### 4. Security & Privacy
In the API response, I implemented **masking**. The full card number is never returned back; only the last 4 digits are visible, following PCI-DSS principles even in a mock environment.

### 5. Bonus: Network Identification
I added a network identification feature based on IIN (Issuer Identification Number) ranges to provide a more "production-ready" feel to the feedback.
