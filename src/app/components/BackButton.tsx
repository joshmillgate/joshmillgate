"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

export default function BackButton() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className="back-button-wrapper"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
        >
            <Link href="/" className="back-button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>Back</span>
            </Link>
        </motion.div>
    );
}
