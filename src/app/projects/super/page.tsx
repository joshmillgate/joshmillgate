"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import BackButton from "../../components/BackButton";
import "../push-magazine/styles.css";

const EASING = [0.23, 1, 0.32, 1] as const;

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

const images = [
    { src: "/images/projects/super/dashboard.png", alt: "Super dashboard" },
    { src: "/images/projects/super/design-system.png", alt: "Super design system" },
    { src: "/images/projects/super/app-flow.png", alt: "Super app flow" },
    { src: "/images/projects/super/designer.png", alt: "Super designer" },
    { src: "/images/projects/super/search.png", alt: "Super search" },
    { src: "/images/projects/super/account.png", alt: "Super account" },
    { src: "/images/projects/super/analytics-components.png", alt: "Super analytics components" },
    { src: "/images/projects/super/cards.png", alt: "Super cards" },
    { src: "/images/projects/super/templates-1.png", alt: "Super templates" },
    { src: "/images/projects/super/templates-2.png", alt: "Super templates 2" },
    { src: "/images/projects/super/mobile.png", alt: "Super mobile" },
    { src: "/images/projects/super/mobile-mock.png", alt: "Super mobile mockup" },
    { src: "/images/projects/super/marketing-hero.png", alt: "Super marketing hero" },
    { src: "/images/projects/super/marketing-footer.png", alt: "Super marketing footer" },
    { src: "/images/projects/super/emails.png", alt: "Super emails" },
    { src: "/images/projects/super/diagram.png", alt: "Super diagram" },
    { src: "/images/projects/super/hoodies.png", alt: "Super hoodies" },
    { src: "/images/projects/super/posters.png", alt: "Super posters" },
    { src: "/images/projects/super/stickers.png", alt: "Super stickers" },
];

export default function Super() {
    const shouldReduceMotion = useReducedMotion();

    const getInitial = (variant: "hidden" | false) =>
        shouldReduceMotion ? false : variant;

    return (
        <div className="project-page">
            <BackButton />
            <main className="project-main">
                <motion.div
                    className="project-content"
                    variants={stagger}
                    initial={getInitial("hidden")}
                    animate="visible"
                >
                    <motion.div
                        className="project-header"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <h1 className="project-title">Super [2021–2024]</h1>
                        <p className="project-description">
                            Super is the market leader in Notion-to-website SaaS. Super is a tool that transforms Notion pages into fully customized, professional websites in less than a minute.
                        </p>
                        <p className="project-description" style={{ marginTop: 12 }}>
                            I was the inaugural designer at Super, where managed all design and forward facing content. Including; implementing a comprehensive app-wide design system, a complete overhaul of the user interface and user experience, a brand refresh, and the creation of all marketing assets, such as merchandise, digital advertisements, promotional videos, and landing pages.
                        </p>
                    </motion.div>

                    <div className="project-gallery">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.src}
                                className="project-image-wrapper"
                                variants={fadeUp}
                                transition={{
                                    duration: 0.5,
                                    ease: EASING,
                                    delay: shouldReduceMotion ? 0 : 0.15 + index * 0.08,
                                }}
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={2000}
                                    height={1500}
                                    quality={90}
                                    sizes="(max-width: 768px) 100vw, 90vw"
                                    priority={index === 0}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
