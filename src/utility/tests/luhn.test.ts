
/**
 * Simple test suite for the Luhn algorithm validation.
 * Run this with: npx tsx src/utils/luhn.test.ts
 */

import { validateLuhn } from "../luhn_algorithm/luhn.ts";

const testCases = [
    { number: "79927398713", expected: true, description: "Standard valid Luhn number" },
    { number: "79927398710", expected: false, description: "Invalid check digit" },
    { number: "49927398716", expected: true, description: "Valid Visa-like number" },
    { number: "1234567812345678", expected: false, description: "Simple invalid sequence" },
    { number: "1234567812345670", expected: true, description: "Valid 16-digit sequence" },
    { number: "abc", expected: false, description: "Non-numeric input" },
    { number: "   ", expected: false, description: "Empty space" },
];

console.log("🚀 Starting Validation Tests...\n");

let passedCount = 0;

testCases.forEach((test, index) => {
    const result = validateLuhn(test.number);
    const status = result === test.expected ? "✅ PASS" : "❌ FAIL";

    if (result === test.expected) passedCount++;

    console.log(`[Test ${index + 1}] ${status}`);
    console.log(`  Description: ${test.description}`);
    console.log(`  Input: "${test.number}"`);
    console.log(`  Expected: ${test.expected} | Actual: ${result}\n`);
});

console.log(`📊 Summary: ${passedCount}/${testCases.length} tests passed.`);

if (passedCount === testCases.length) {
    console.log("✨ All tests passed successfully!");
    process.exit(0);
} else {
    console.error("⚠️ Some tests failed.");
    process.exit(1);
}
