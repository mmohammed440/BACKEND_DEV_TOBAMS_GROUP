import React, { useState } from 'react';
import { CreditCard, CheckCircle2, XCircle, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValidationResponse {
    valid: boolean;
    cardNumber?: string;
    network?: string;
    error?: string;
    code?: string;
    timestamp?: string;
}

export default function App() {
    const [cardNumber, setCardNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ValidationResponse | null>(null);

    const validateCard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cardNumber.trim()) return;

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
        } catch (error) {
            setResult({
                valid: false,
                error: 'Failed to connect to the server. Please try again.',
                code: 'NETWORK_ERROR'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCardNumber('');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-500 p-2 rounded-lg">
                            <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Card Validator</h1>
                    </div>
                    <p className="text-slate-400 text-sm">Verify card authenticity using Luhn's algorithm.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={validateCard} className="space-y-6">
                        <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-slate-700 mb-2">
                                Card Number
                            </label>
                            <div className="relative">
                                <input
                                    id="cardNumber"
                                    type="text"
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                    disabled={loading}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Layers className="w-5 h-5 text-slate-300" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading || !cardNumber.trim()}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    'Validate Now'
                                )}
                            </button>
                            {result && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-xl transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </form>

                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-8 overflow-hidden"
                            >
                                <div className={`p-6 rounded-2xl border ${result.valid
                                        ? 'bg-emerald-50 border-emerald-100'
                                        : 'bg-rose-50 border-rose-100'
                                    }`}>
                                    <div className="flex items-start gap-4">
                                        {result.valid ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                                        ) : result.code === 'NETWORK_ERROR' || result.code === 'MISSING_INPUT' ? (
                                            <AlertCircle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-6 h-6 text-rose-600 mt-1 flex-shrink-0" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold text-lg ${result.valid ? 'text-emerald-900' : 'text-rose-900'
                                                }`}>
                                                {result.valid ? 'Valid Card Number' : 'Invalid Card Number'}
                                            </h3>

                                            {result.error ? (
                                                <p className="text-rose-700 text-sm mt-1">{result.error}</p>
                                            ) : (
                                                <div className="mt-3 space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Masked</span>
                                                        <span className="font-mono font-medium text-slate-700">{result.cardNumber}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Network</span>
                                                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-xs font-semibold uppercase">
                                                            {result.network}
                                                        </span>
                                                    </div>
                                                    <div className="pt-2 mt-2 border-t border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest text-center">
                                                        Verified via Luhn Algorithm
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <footer className="mt-12 text-slate-400 text-sm">
                <p>&copy; 2026 Backend Assessment &bull; Secure Validation System</p>
            </footer>
        </div>
    );
}

