"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

export default function Work() {
    const shouldReduceMotion = useReducedMotion();

    const getInitial = (variant: "hidden" | false) =>
        shouldReduceMotion ? false : variant;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <main className="flex-1 px-6 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={getInitial("hidden")}
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                    >
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
                            Work
                        </h1>
                        <p className="text-lg text-muted mb-12">
                            A collection of projects and experiments.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={getInitial("hidden")}
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut, delay: 0.1 }}
                        className="grid gap-4"
                    >
                        <Link
                            href="/work/file-upload"
                            className="group flex items-center justify-between p-5 border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
                        >
                            <div>
                                <h2 className="text-lg font-medium mb-1 group-hover:text-foreground transition-colors">
                                    File Upload
                                </h2>
                                <p className="text-sm text-muted">
                                    Drag and drop file upload interaction
                                </p>
                            </div>
                            <span className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-150">
                                →
                            </span>
                        </Link>
                        <Link
                            href="/work/photo-stack"
                            className="group flex items-center justify-between p-5 border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
                        >
                            <div>
                                <h2 className="text-lg font-medium mb-1 group-hover:text-foreground transition-colors">
                                    Photo Stack
                                </h2>
                                <p className="text-sm text-muted">
                                    Photo stack interaction
                                </p>
                            </div>
                            <span className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-150">
                                →
                            </span>
                        </Link>
                        <Link
                            href="/work/trash-can"
                            className="group flex items-center justify-between p-5 border border-border rounded-lg hover:border-foreground/20 transition-colors duration-150"
                        >
                            <div>
                                <h2 className="text-lg font-medium mb-1 group-hover:text-foreground transition-colors">
                                    Trash Can
                                </h2>
                                <p className="text-sm text-muted">
                                    Trash can interaction
                                </p>
                            </div>
                            <span className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all duration-150">
                                →
                            </span>
                        </Link>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-6 py-8 border-t border-border">
                <div className="max-w-4xl mx-auto flex items-center justify-between text-sm text-muted">
                    <span className="font-mono">boilerplate</span>
                    <span>Built with care</span>
                </div>
            </footer>
        </div>
    );
}
