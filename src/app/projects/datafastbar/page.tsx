"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import BackButton from "../../components/BackButton";
import "./styles.css";

const EASING: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

const stagger = {
    visible: {
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.08,
        },
    },
};

const CONFETTI_COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#45B7D1", "#96CEB4", "#FF8A5C", "#A78BFA", "#F472B6"];

interface ConfettiPiece {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
    shape: "square" | "rect" | "circle";
}

function generateConfetti(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 0.6,
        duration: 1.5 + Math.random() * 1.5,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
        shape: (["square", "rect", "circle"] as const)[Math.floor(Math.random() * 3)],
    }));
}

function MenuBarDemo() {
    return (
        <div className="dfb-menubar">
            <div className="dfb-menubar-header">
                <div className="dfb-menubar-brand">
                    <div className="dfb-menubar-icon">
                        <svg width="24" height="24" viewBox="0 0 721 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M360.419 0C559.473 0 720.838 161.365 720.838 360.419C720.838 559.473 559.473 720.838 360.419 720.838C161.365 720.838 0.000264033 559.473 0 360.419C0.000131948 161.365 161.365 0 360.419 0ZM365.094 94.3213C365.094 64.1795 341.414 39.821 311.742 45.124C257.546 54.8101 172.349 84.5003 105.83 174.126C30.4466 275.695 43.3438 386.598 57.0566 442.128C62.5403 464.334 83.1625 478.05 106.035 478.05H308.637C340.22 478.05 365.783 503.731 365.637 535.314L365.225 624.07C365.08 655.242 390.162 680.216 420.76 674.264C462.784 666.088 521.596 646.859 572.112 601.686C612.501 565.569 637.196 529.03 652.156 499.67C667.904 468.764 643.233 438.05 608.546 438.05H422.094C390.614 438.05 365.094 412.53 365.094 381.05V94.3213Z" fill="currentColor"/>
                        </svg>
                    </div>
                    <div>
                        <div className="dfb-menubar-name">Datafast</div>
                        <div className="dfb-menubar-site">ultramock.io</div>
                    </div>
                </div>
                <div className="dfb-menubar-period">
                    Today
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </div>
            </div>

            <div className="dfb-stats-grid">
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">👥</span> Visitors
                    </div>
                    <div className="dfb-stat-value">2,182</div>
                </div>
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">💰</span> Revenue
                    </div>
                    <div className="dfb-stat-value">$100</div>
                </div>
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">↗</span> Conversion
                    </div>
                    <div className="dfb-stat-value">0.1%</div>
                </div>
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">↩</span> Bounce Rate
                    </div>
                    <div className="dfb-stat-value">99.5%</div>
                </div>
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">⏱</span> Session
                    </div>
                    <div className="dfb-stat-value">2s</div>
                </div>
                <div className="dfb-stat-card">
                    <div className="dfb-stat-label">
                        <span className="dfb-stat-label-icon">💲</span> Rev/Visitor
                    </div>
                    <div className="dfb-stat-value">$0.05</div>
                </div>
            </div>

            <div className="dfb-chart">
                <div className="dfb-chart-legend">
                    <div className="dfb-chart-legend-item">
                        <span className="dfb-chart-legend-dot" style={{ background: "#3B82F6" }} />
                        Visitors
                    </div>
                    <div className="dfb-chart-legend-item">
                        <span className="dfb-chart-legend-dot" style={{ background: "#F59E0B" }} />
                        Revenue
                    </div>
                </div>
                <svg className="dfb-chart-area" viewBox="0 0 300 90">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* Revenue bars */}
                    <rect x="88" y="22" width="14" height="52" rx="4" fill="#F59E0B" opacity="0.2" />
                    <rect x="108" y="14" width="14" height="60" rx="4" fill="#F59E0B" opacity="0.25" />
                    <rect x="128" y="32" width="14" height="42" rx="4" fill="#F59E0B" opacity="0.15" />
                    {/* Area fill */}
                    <path
                        d="M 0 68 C 20 66, 50 62, 80 55 C 95 48, 105 22, 115 18 C 125 14, 132 28, 145 36 C 160 45, 175 50, 195 52 L 195 74 L 0 74 Z"
                        fill="url(#lineGradient)"
                    />
                    {/* Visitor line */}
                    <path
                        d="M 0 68 C 20 66, 50 62, 80 55 C 95 48, 105 22, 115 18 C 125 14, 132 28, 145 36 C 160 45, 175 50, 195 52"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Glow dot */}
                    <circle cx="195" cy="52" r="6" fill="#3B82F6" opacity="0.2" filter="url(#glow)" className="dfb-chart-dot-glow" />
                    <circle cx="195" cy="52" r="3.5" fill="#3B82F6" className="dfb-chart-dot" />
                    <circle cx="195" cy="52" r="1.5" fill="#fff" opacity="0.6" />
                    {/* X-axis labels */}
                    <text x="0" y="88" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="var(--font-geist)">00</text>
                    <text x="70" y="88" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="var(--font-geist)">06</text>
                    <text x="140" y="88" fill="currentColor" opacity="0.25" fontSize="9" fontFamily="var(--font-geist)">12</text>
                </svg>
            </div>

            <div className="dfb-live">
                <span className="dfb-live-dot" />
                7 live
            </div>

            <div className="dfb-live-row">
                <span className="dfb-live-flag">🇮🇩</span>
                <div>
                    <div className="dfb-live-location">Jakarta, ID-JK</div>
                    <div className="dfb-live-page">Homepage</div>
                </div>
                <span className="dfb-live-device">📱</span>
            </div>
            <div className="dfb-live-row">
                <span className="dfb-live-flag">🇵🇱</span>
                <div>
                    <div className="dfb-live-location">Warsaw, PL-14</div>
                    <div className="dfb-live-page">Pricing</div>
                </div>
                <span className="dfb-live-device">🖥</span>
            </div>

            <div className="dfb-menubar-footer">
                <div className="dfb-menubar-footer-icons">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                </div>
                <span className="dfb-menubar-footer-link">
                    Dashboard ↗
                </span>
                <div className="dfb-menubar-footer-icons">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

function PageConfetti({ confetti }: { confetti: ConfettiPiece[] }) {
    return (
        <div className="dfb-page-confetti">
            {confetti.map((piece) => (
                <div
                    key={piece.id}
                    className="dfb-confetti-piece"
                    style={{
                        left: `${piece.x}%`,
                        backgroundColor: piece.color,
                        width: piece.shape === "rect" ? piece.size * 0.6 : piece.size,
                        height: piece.shape === "rect" ? piece.size * 1.4 : piece.size,
                        borderRadius: piece.shape === "circle" ? "50%" : "2px",
                        animationDelay: `${piece.delay}s`,
                        animationDuration: `${piece.duration}s`,
                        transform: `rotate(${piece.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

export default function DatafastBarPage() {
    const shouldReduceMotion = useReducedMotion();
    const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
    const [showToast, setShowToast] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasAutoPlayed = useRef(false);

    const triggerConfetti = useCallback(() => {
        setConfetti(generateConfetti(50));
        setShowToast(true);

        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }

        setTimeout(() => {
            setShowToast(false);
            setConfetti([]);
        }, 3500);
    }, []);

    useEffect(() => {
        audioRef.current = new Audio("/audio/cha-ching.wav");
        audioRef.current.volume = 0.5;
    }, []);

    useEffect(() => {
        if (hasAutoPlayed.current) return;
        hasAutoPlayed.current = true;
        const timer = setTimeout(triggerConfetti, 1200);
        return () => clearTimeout(timer);
    }, [triggerConfetti]);

    return (
        <div className="dfb-page">
            <PageConfetti confetti={confetti} />
            <div className="dfb-sale-toast-wrapper">
                <motion.div
                    className="dfb-sale-toast-fixed"
                    style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
                    initial={{ opacity: 0, y: -60 }}
                    animate={showToast ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }}
                    transition={{ duration: 0.5, ease: EASING }}
                >
                    <span className="dfb-sale-emoji">🎉</span>
                    You made a sale! $49.99
                </motion.div>
            </div>
            <BackButton />
            <motion.main
                className="dfb-main"
                variants={stagger}
                initial={shouldReduceMotion ? false : "hidden"}
                animate="visible"
            >
                <motion.div
                    className="dfb-icon"
                    variants={fadeUp}
                    transition={{ duration: 0.4, ease: EASING }}
                >
                    <svg width="28" height="27" viewBox="0 0 309 292" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M151.34 0.114329C152.027 0.087579 152.713 0.0665773 153.4 0.0515773C164.119 -0.180173 174.663 0.0355797 182.588 8.05408C189.431 14.9776 191.224 21.9551 191.224 31.2148C191.225 49.0356 191.225 66.8263 191.225 84.6268L191.228 191.476L191.232 241.292L191.229 256.142C191.211 266.434 190.798 274.737 182.927 282.647C175.268 290.347 167.189 291.037 156.887 291.102C152.926 291.117 149.019 291.124 145.061 291.009C128.075 290.514 116.756 277.802 116.692 261.017C116.627 243.587 116.663 226.107 116.664 208.652L116.663 106.172L116.647 53.5136L116.635 38.0121C116.635 33.9401 116.559 29.0028 117.102 24.9883C117.901 18.8326 120.664 13.0983 124.98 8.63683C133.006 0.325829 141.005 0.337079 151.34 0.114329Z" fill="#E8734A" />
                        <path d="M27.8293 66.8446C32.8008 66.6394 37.7735 66.7811 42.737 66.7036C50.796 66.5779 58.03 68.2649 64.3398 73.4444C70.0285 78.1086 73.5938 84.8719 74.227 92.2011C74.5905 96.2794 74.5123 101.095 74.5323 105.262L74.5555 125.849L74.5605 188.378L74.553 239.524L74.5 254.867C74.4823 258.682 74.5348 262.379 74.1135 266.179C72.8843 277.262 65.1788 286.189 54.6735 289.627C52.0298 290.492 49.528 290.712 46.7475 290.947C38.9088 291.224 27.7928 291.692 20.2205 289.774C16.322 288.577 12.4085 286.247 9.3905 283.589C-0.903749 274.524 0.11925 262.832 0.119 250.507L0.12 228.554L0.115502 160.522L0.105 115.769C0.1045 108.062 -0.315748 99.2404 0.528752 91.6439C2.13925 77.1586 13.8075 67.6349 27.8293 66.8446Z" fill="#F2BBA8" />
                        <path d="M261.156 116.843C264.363 116.628 268.171 116.788 271.421 116.732C281.368 116.562 289.361 116.569 297.508 123.353C303.978 128.741 307.236 135.777 307.783 144.179C308.311 152.255 308.068 161.061 308.066 169.239L308.063 212.967L308.053 246.412C308.046 252.684 308.328 259.564 307.588 265.714C306.281 276.569 299.166 285.824 288.778 289.412C285.731 290.464 283.261 290.697 280.121 290.954C267.768 291.339 253.376 292.922 243.596 284.227C237.133 278.482 234.148 272.192 233.638 263.594C233.123 254.942 233.251 246.399 233.251 237.767L233.246 196.259V164.215C233.243 156.487 232.933 147.985 234.113 140.364C236.273 126.421 247.621 117.868 261.156 116.843Z" fill="#F2BBA8" />
                    </svg>
                </motion.div>

                <motion.h1
                    className="dfb-title"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    Datafast Bar
                </motion.h1>

                <motion.p
                    className="dfb-subtitle"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    Your <Link href="https://datafa.st" target="_blank" rel="noopener noreferrer">Datafast</Link> analytics in your macOS menu bar. Revenue, visitors, and live data at a glance.
                </motion.p>

                <motion.div
                    className="dfb-download-row"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    <a
                        className="dfb-download-btn"
                        href="https://github.com/joshmillgate/joshmillgate/releases/download/v1.0.0/DatafastBar.dmg"
                        download
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Download for macOS
                    </a>
                    <a
                        className="dfb-github-btn"
                        href="https://github.com/joshmillgate/joshmillgate/releases/tag/v1.0.0"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub Release"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                </motion.div>

                <motion.p
                    className="dfb-download-note"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    Not from the App Store. After downloading, right-click the app and select &ldquo;Open&rdquo; to bypass Gatekeeper on first launch.
                </motion.p>

                <div className="dfb-divider" />

                <motion.div
                    className="dfb-features"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                >
                    <div className="dfb-feature">
                        <span className="dfb-feature-emoji">🎉</span>
                        <span className="dfb-feature-text"><strong>Confetti and cha-ching sound</strong> when you make a sale</span>
                    </div>
                    <div className="dfb-feature">
                        <span className="dfb-feature-emoji">📊</span>
                        <span className="dfb-feature-text"><strong>Charts and data at a glance</strong> right from your menu bar</span>
                    </div>
                    <div className="dfb-feature">
                        <span className="dfb-feature-emoji">🟢</span>
                        <span className="dfb-feature-text"><strong>Live active user count</strong> always visible in the menu bar</span>
                    </div>
                </motion.div>

                <motion.button
                    className="dfb-confetti-btn"
                    variants={fadeUp}
                    transition={{ duration: 0.3, ease: EASING }}
                    onClick={triggerConfetti}
                >
                    🎉 Try it now
                </motion.button>

                <div className="dfb-divider" />

                <div className="dfb-showcase">
                    <motion.div
                        style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                        variants={fadeUp}
                        transition={{ duration: 0.5, ease: EASING, delay: 0.3 }}
                    >
                        <div className="dfb-section-label">Menu bar dropdown</div>
                        <MenuBarDemo />
                    </motion.div>

                </div>

                <p className="dfb-disclaimer">Not affiliated with <Link href="https://datafa.st" target="_blank" rel="noopener noreferrer">datafa.st</Link></p>
            </motion.main>
        </div>
    );
}
