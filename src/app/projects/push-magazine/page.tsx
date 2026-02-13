"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import BackButton from "../../components/BackButton";
import "./styles.css";

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
    { src: "/images/projects/push-magazine.png", alt: "Push Magazine cover" },
    { src: "/images/projects/push-covers.jpg", alt: "Push Magazine covers" },
    { src: "/images/projects/push-spread-1-min.jpg", alt: "Push Magazine spread 1" },
    { src: "/images/projects/push-spread-2-min.jpg", alt: "Push Magazine spread 2" },
    { src: "/images/projects/push-spread-3-min.jpg", alt: "Push Magazine spread 3" },
    { src: "/images/projects/push-spread-4-min.jpg", alt: "Push Magazine spread 4" },
    { src: "/images/projects/push-spread-6-min.jpg", alt: "Push Magazine spread 6" },
    { src: "/images/projects/push-spread-7-min.jpg", alt: "Push Magazine spread 7" },
    { src: "/images/projects/push-scans.jpg", alt: "Push Magazine scans" },
    { src: "/images/projects/push-experiments.jpg", alt: "Push Magazine experiments" },
    { src: "/images/projects/push-envolope1-min.jpg", alt: "Push Magazine envelope 1" },
    { src: "/images/projects/push-envolope2-min.jpg", alt: "Push Magazine envelope 2" },
    { src: "/images/projects/push-stationary-min.jpg", alt: "Push Magazine stationary" },
    { src: "/images/projects/push-logo-d-min.jpg", alt: "Push Magazine logo dark" },
    { src: "/images/projects/push-logo-w-min.jpg", alt: "Push Magazine logo white" },
];

export default function PushMagazine() {
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
                        <h1 className="project-title">Push Magazine [2017]</h1>
                        <p className="project-description">
                            Push was a free bi-monthly youth lifestyle magazine, that explored Hip-Hop, R&B and Grime culture as vehicles to inform and inspire next generation creative talent.
                            I was brought on to work with Push magazine from its birth in December 2017 through till its third issue, during my time with the team I curated the brand identity, promotional materials and and editorial design.
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
