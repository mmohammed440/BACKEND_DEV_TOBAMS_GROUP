import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
export default function App() {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const validateCard = async (e) => {
        e.preventDefault();
        if (!cardNumber.trim())
            return;
        setLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardNumber }),
            });
            const data = await response.json();
            setResult(data);
        }
        catch (error) {
            setResult({
                valid: false,
                error: 'Failed to connect to the server. Please try again.',
                code: 'NETWORK_ERROR'
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleReset = () => {
        setCardNumber('');
        setResult(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden", children: [_jsxs("div", { className: "bg-slate-900 p-8 text-white", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "bg-blue-500 p-2 rounded-lg", children: _jsx(CreditCard, { className: "w-6 h-6 text-white" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Card Validator" })] }), _jsx("p", { className: "text-slate-400 text-sm", children: "Verify card authenticity using Luhn's algorithm." })] }), _jsxs("div", { className: "p-8", children: [_jsxs("form", { onSubmit: validateCard, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "cardNumber", className: "block text-sm font-medium text-slate-700 mb-2", children: "Card Number" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "cardNumber", type: "text", placeholder: "xxxx xxxx xxxx xxxx", value: cardNumber, onChange: (e) => setCardNumber(e.target.value), className: "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none", disabled: loading }), _jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: _jsx(Layers, { className: "w-5 h-5 text-slate-300" }) })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "submit", disabled: loading || !cardNumber.trim(), className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: loading ? (_jsx(RefreshCw, { className: "w-5 h-5 animate-spin" })) : ('Validate Now') }), result && (_jsx("button", { type: "button", onClick: handleReset, className: "bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-colors", children: _jsx(RefreshCw, { className: "w-5 h-5" }) }))] })] }), _jsx(AnimatePresence, { children: result && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "mt-8 overflow-hidden", children: _jsx("div", { className: `p-6 rounded-2xl border ${result.valid
                                            ? 'bg-emerald-50 border-emerald-100'
                                            : 'bg-rose-50 border-rose-100'}`, children: _jsxs("div", { className: "flex items-start gap-4", children: [result.valid ? (_jsx(CheckCircle2, { className: "w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" })) : result.code === 'NETWORK_ERROR' || result.code === 'MISSING_INPUT' ? (_jsx(AlertCircle, { className: "w-6 h-6 text-amber-600 mt-1 flex-shrink-0" })) : (_jsx(XCircle, { className: "w-6 h-6 text-rose-600 mt-1 flex-shrink-0" })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: `font-bold text-lg ${result.valid ? 'text-emerald-900' : 'text-rose-900'}`, children: result.valid ? 'Valid Card Number' : 'Invalid Card Number' }), result.error ? (_jsx("p", { className: "text-rose-700 text-sm mt-1", children: result.error })) : (_jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Masked" }), _jsx("span", { className: "font-mono font-medium text-slate-700", children: result.cardNumber })] }), _jsxs("div", { className: "flex justify-between items-center text-sm", children: [_jsx("span", { className: "text-slate-500", children: "Network" }), _jsx("span", { className: "px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-xs font-semibold uppercase", children: result.network })] }), _jsx("div", { className: "pt-2 mt-2 border-t border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest text-center", children: "Verified via Luhn Algorithm" })] }))] })] }) }) })) })] })] }), _jsx("footer", { className: "mt-12 text-slate-400 text-sm", children: _jsx("p", { children: "\u00A9 2026 Backend Assessment \u2022 Secure Validation System" }) })] }));
}
