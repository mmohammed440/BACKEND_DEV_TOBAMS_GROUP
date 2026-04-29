"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLuhn = validateLuhn;
exports.getCardNetwork = getCardNetwork;
/**
 * Implements the Luhn algorithm (also known as the "mod 10" algorithm).
 * Used to validate a variety of identification numbers, such as credit card numbers.
 */
function validateLuhn(cardNumber) {
    // Remove any non-digit characters
    const digits = cardNumber.replace(/\D/g, "");
    // Basic check: Ensure we have digits to work with
    if (digits.length === 0) {
        return false;
    }
    let sum = 0;
    let shouldDouble = false;
    // Loop through the digits from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    // The number is valid if the sum is a multiple of 10
    return sum % 10 === 0;
}
/**
 * Identifies the card network based on the number.
 * This is a bonus feature to provide a better response.
 */
function getCardNetwork(cardNumber) {
    const digits = cardNumber.replace(/\D/g, "");
    if (/^4/.test(digits))
        return "Visa";
    if (/^5[1-5]/.test(digits))
        return "Mastercard";
    if (/^3[47]/.test(digits))
        return "American Express";
    if (/^6(?:011|5)/.test(digits))
        return "Discover";
    if (/^(?:2131|1800|35)/.test(digits))
        return "JCB";
    return "Unknown";
}
//# sourceMappingURL=luhn.js.map