"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { ArrowUpRight } from "lucide-react";
import ShaderOrb from "./components/ShaderOrb";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const imageReveal = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

interface ImageData {
    src: string;
    alt: string;
    type: "screen" | "component";
    order: number;
    noPaddingBottom: boolean;
    crop: boolean;
}

interface HomeContentProps {
    images: ImageData[];
}

export default function HomeContent({ images }: HomeContentProps) {
    const shouldReduceMotion = useReducedMotion();
    const [locationAnim, setLocationAnim] = useState<object | null>(null);
    const [sendPlaneAnim, setSendPlaneAnim] = useState<object | null>(null);
    const [versionAnim, setVersionAnim] = useState<object | null>(null);
    const [folderOpenAnim, setFolderOpenAnim] = useState<object | null>(null);
    const [dollarAnim, setDollarAnim] = useState<object | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

    // Orb state management
    const [orbState, setOrbState] = useState<'idle' | 'social-x' | 'social-github' | 'email' | 'work' | 'location'>('idle');
    const [proximityGlow, setProximityGlow] = useState(0);
    const [velocityStrength, setVelocityStrength] = useState(0);
    const [clickTime, setClickTime] = useState(0);

    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const sendPlaneLottieRef = useRef<LottieRefCurrentProps>(null);
    const versionLottieRef = useRef<LottieRefCurrentProps>(null);
    const folderOpenLottieRef = useRef<LottieRefCurrentProps>(null);
    const dollarLottieRef = useRef<LottieRefCurrentProps>(null);
    const rafRef = useRef<number | null>(null);
    const orbRef = useRef<HTMLDivElement>(null);
    const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetch("/icons/location_line.json")
            .then(res => res.json())
            .then(setLocationAnim)
            .catch(console.error);

        fetch("/icons/send_plane_line.json")
            .then(res => res.json())
            .then(setSendPlaneAnim)
            .catch(console.error);

        fetch("/icons/version_line.json")
            .then(res => res.json())
            .then(setVersionAnim)
            .catch(console.error);

        fetch("/icons/folder_open_2_line.json")
            .then(res => res.json())
            .then(setFolderOpenAnim)
            .catch(console.error);

        fetch("/icons/currency_dollar_line.json")
            .then(res => res.json())
            .then(setDollarAnim)
            .catch(console.error);

        // Initialize hover audio
        hoverAudioRef.current = new Audio('/audio/digital-ui-click.mp3');
        hoverAudioRef.current.volume = 0.3;
    }, []);

    useEffect(() => {
        let targetX = 50;
        let targetY = 50;
        let currentX = 50;
        let currentY = 50;
        let velocityX = 0;
        let velocityY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;
        let animationId: number;

        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = (e.clientX / window.innerWidth) * 100;
            const mouseY = (e.clientY / window.innerHeight) * 100;

            // Calculate mouse velocity
            velocityX = mouseX - lastMouseX;
            velocityY = mouseY - lastMouseY;
            const velocityMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

            // Update velocity strength for chromatic aberration
            setVelocityStrength(Math.min(velocityMagnitude / 40, 1));

            // Calculate proximity to orb
            if (orbRef.current) {
                const orbRect = orbRef.current.getBoundingClientRect();
                const orbCenterX = orbRect.left + orbRect.width / 2;
                const orbCenterY = orbRect.top + orbRect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(e.clientX - orbCenterX, 2) + Math.pow(e.clientY - orbCenterY, 2)
                );
                // Map distance (0-500px) to glow intensity (1-0)
                const glowIntensity = Math.max(0, Math.min(1, 1 - distance / 500));
                setProximityGlow(glowIntensity);
            }

            // Add randomized offset based on velocity (creates organic "push" effect)
            const randomOffsetX = (Math.random() - 0.5) * Math.abs(velocityX) * 3;
            const randomOffsetY = (Math.random() - 0.5) * Math.abs(velocityY) * 3;

            // Target follows mouse with random perpendicular offset
            targetX = mouseX + randomOffsetX + (Math.sin(Date.now() * 0.001) * 10);
            targetY = mouseY + randomOffsetY + (Math.cos(Date.now() * 0.0012) * 10);

            lastMouseX = mouseX;
            lastMouseY = mouseY;
        };

        const animate = () => {
            // Smooth interpolation with slight lag (creates fluid following)
            const ease = 0.08;
            currentX += (targetX - currentX) * ease;
            currentY += (targetY - currentY) * ease;

            // Clamp values
            const clampedX = Math.max(0, Math.min(100, currentX));
            const clampedY = Math.max(0, Math.min(100, currentY));

            setMousePosition({ x: clampedX, y: clampedY });

            animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    useEffect(() => {
        const handleClick = () => {
            setClickTime(Date.now());
        };

        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);




    const getInitial = (variant: "hidden" | false) =>
        shouldReduceMotion ? false : variant;

    // Group consecutive component images for grid layout
    const renderImages = () => {
        const result: React.ReactNode[] = [];
        let componentGroup: ImageData[] = [];
        let globalIndex = 0;

        const flushComponentGroup = () => {
            if (componentGroup.length > 0) {
                const startIndex = globalIndex - componentGroup.length;
                result.push(
                    <div key={`component-grid-${startIndex}`} className="home-component-grid">
                        {componentGroup.map((image, i) => {
                            const componentClasses = `home-card home-card-component${image.noPaddingBottom ? " home-card-component-pb0" : ""}`;
                            return (
                                <motion.div
                                    key={image.src}
                                    className={componentClasses}
                                    variants={imageReveal}
                                    transition={{
                                        duration: 0.5,
                                        ease: easeOut,
                                        delay: shouldReduceMotion ? 0 : 0.15 + (startIndex + i) * 0.12,
                                    }}
                                >
                                    <div className={`home-card-img${image.crop ? " home-card-img-crop" : ""}`}>
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={2000}
                                            height={1500}
                                            quality={90}
                                            sizes="(max-width: 768px) 100vw, 27vw"
                                            priority={startIndex + i === 0}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                );
                componentGroup = [];
            }
        };

        for (const image of images) {
            if (image.type === "component") {
                componentGroup.push(image);
            } else {
                // Flush any pending component group before adding a screen
                flushComponentGroup();
                const screenClasses = `home-card home-card-screen${image.noPaddingBottom ? " home-card-screen-pb0" : ""}`;
                result.push(
                    <motion.div
                        key={image.src}
                        className={screenClasses}
                        variants={imageReveal}
                        transition={{
                            duration: 0.5,
                            ease: easeOut,
                            delay: shouldReduceMotion ? 0 : 0.15 + globalIndex * 0.12,
                        }}
                    >
                        <div className={`home-card-img${image.crop ? " home-card-img-crop" : ""}`}>
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={4128}
                                height={2429}
                                quality={90}
                                sizes="(max-width: 768px) 100vw, 55vw"
                                priority={globalIndex === 0}
                            />
                        </div>
                    </motion.div>
                );
            }
            globalIndex++;
        }

        // Flush any remaining component group
        flushComponentGroup();

        return result;
    };

    return (
        <div className="home-split">
            {/* Left — Sticky intro */}
            <motion.aside
                className="home-left"
                variants={stagger}
                initial={getInitial("hidden")}
                animate="visible"
            >
                <div className="home-left-inner">
                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: easeOut }}
                        style={{ width: 64, height: 64, marginBottom: 24, alignSelf: 'flex-start', marginLeft: -8 }}
                    >
                        <ShaderOrb orbState={orbState} mousePosition={mousePosition} clickTime={clickTime} />
                    </motion.div>

                    <motion.h1
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-heading"
                    >
                        Josh Millgate
                        <br />
                        <span className="text-muted">Product Designer</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-body mb-3"
                    >
                        Multi-disciplinary designer specialising in UI/UX and Design
                        Engineering. I craft interfaces that feel intentional — from concept
                        through to production code.
                    </motion.p>

                    <motion.p
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-body mb-3"
                    >
                        Previously lead designer at{" "}
                        <Link
                            href="https://super.so"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-inline"
                        >
                            Super
                        </Link>
                        . Currently taking on freelance projects and exploring new opportunities.
                    </motion.p>

                    <motion.button
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        onClick={() => {
                            const gallerySection = document.querySelector('.home-right');
                            if (gallerySection) {
                                gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }}
                        className="home-btn-view-work"
                    >
                        View work
                    </motion.button>

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-meta"
                    >
                        <span className="availability-dot" />
                        Available for work&nbsp;&nbsp;·&nbsp;&nbsp;
                        <span
                            className="home-meta-location"
                            onMouseEnter={() => lottieRef.current?.play()}
                            onMouseLeave={() => lottieRef.current?.stop()}
                        >
                            {locationAnim && (
                                <Lottie
                                    lottieRef={lottieRef}
                                    animationData={locationAnim}
                                    autoplay={false}
                                    loop={false}
                                    style={{ width: 16, height: 16 }}
                                />
                            )}
                            Remote, Nicaragua
                        </span>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-actions"
                    >
                        <Link
                            href="https://x.com/joshmillgate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-btn-icon"
                            aria-label="X (Twitter)"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </Link>
                        <Link
                            href="https://github.com/joshmillgate"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="home-btn-icon"
                            aria-label="GitHub"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </Link>
                        <Link
                            href="mailto:hello@joshmillgate.com"
                            className="home-btn-icon home-btn-icon-stroke"
                            aria-label="Email"
                        >
                            {sendPlaneAnim ? (
                                <Lottie
                                    lottieRef={sendPlaneLottieRef}
                                    animationData={sendPlaneAnim}
                                    autoplay={false}
                                    loop={false}
                                    style={{ width: 16, height: 16 }}
                                />
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 2L11 13" />
                                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                                </svg>
                            )}
                        </Link>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-divider"
                    />

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-work-section"
                        onMouseEnter={() => folderOpenLottieRef.current?.play()}
                        onMouseLeave={() => folderOpenLottieRef.current?.stop()}
                    >
                        <h2 className="home-work-heading">
                            {folderOpenAnim && (
                                <Lottie
                                    lottieRef={folderOpenLottieRef}
                                    animationData={folderOpenAnim}
                                    autoplay={false}
                                    loop={false}
                                    style={{ width: 14, height: 14 }}
                                />
                            )}
                            Projects
                        </h2>
                        <div className="home-work-list">
                            <Link
                                href="https://getinboxzero.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Inbox Zero</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Landing page</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <div
                                className="home-work-item"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                <div className="home-work-title">Highland Fling <span style={{ fontSize: '0.75em', opacity: 0.6 }}>WIP</span></div>
                                <div className="home-work-description">E2E product design</div>
                            </div>
                            <div
                                className="home-work-item"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                <div className="home-work-title">Super <span style={{ fontSize: '0.75em', opacity: 0.6 }}>WIP</span></div>
                                <div className="home-work-description">Design lead</div>
                            </div>
                            <div
                                className="home-work-item"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                <div className="home-work-title">Push Magazine <span style={{ fontSize: '0.75em', opacity: 0.6 }}>WIP</span></div>
                                <div className="home-work-description">Editorial design and branding</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-divider"
                    />

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-work-section"
                        onMouseEnter={() => versionLottieRef.current?.play()}
                        onMouseLeave={() => versionLottieRef.current?.stop()}
                    >
                        <h2 className="home-work-heading">
                            {versionAnim && (
                                <Lottie
                                    lottieRef={versionLottieRef}
                                    animationData={versionAnim}
                                    autoplay={false}
                                    loop={false}
                                    style={{ width: 14, height: 14 }}
                                />
                            )}
                            Components
                        </h2>
                        <div className="home-work-list">
                            <Link
                                href="/work/file-upload"
                                className="home-work-item"
                            >
                                <div className="home-work-title">File Upload</div>
                                <div className="home-work-description">Drag and drop file upload interaction</div>
                            </Link>
                            <div
                                className="home-work-item"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                <div className="home-work-title">Photo Stack <span style={{ fontSize: '0.75em', opacity: 0.6 }}>WIP</span></div>
                                <div className="home-work-description">Photo stack interaction</div>
                            </div>
                            <div
                                className="home-work-item"
                                style={{ opacity: 0.5, cursor: 'not-allowed' }}
                            >
                                <div className="home-work-title">Trash Can <span style={{ fontSize: '0.75em', opacity: 0.6 }}>WIP</span></div>
                                <div className="home-work-description">Trash can interaction</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-divider"
                    />

                    <motion.div
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: easeOut }}
                        className="home-work-section"
                        onMouseEnter={() => dollarLottieRef.current?.play()}
                        onMouseLeave={() => dollarLottieRef.current?.stop()}
                    >
                        <h2 className="home-work-heading">
                            {dollarAnim && (
                                <Lottie
                                    lottieRef={dollarLottieRef}
                                    animationData={dollarAnim}
                                    autoplay={false}
                                    loop={false}
                                    style={{ width: 14, height: 14 }}
                                />
                            )}
                            Side hustles
                        </h2>
                        <div className="home-work-list">
                            <Link
                                href="https://www.raycast.com/joshmillgate/ultrahuman"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Ultrahuman</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Raycast extension</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <Link
                                href="https://www.raycast.com/joshmillgate/zacks-stock-ranking"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Zacks Stock Ranking</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Raycast extension</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <Link
                                href="https://x.com/damngoodui"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Damn Good UI</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Design inspiration on X</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <Link
                                href="https://www.notion.com/@joshmillgate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Notion Templates</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Productivity templates</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <Link
                                href="https://kolm.digital/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Kolm Digital</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Super/Notion website templates</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                            <Link
                                href="https://kolm.digital/checkout"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="home-work-item"
                            >
                                <div className="home-work-title">Morph</div>
                                <div className="home-work-item-right">
                                    <div className="home-work-description">Wallpaper pack</div>
                                    <ArrowUpRight className="home-work-external-icon" size={14} strokeWidth={2} />
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.aside>

            {/* Right — Scrolling showcase */}
            <motion.section
                className="home-right"
                variants={stagger}
                initial={getInitial("hidden")}
                animate="visible"
            >
                {renderImages()}

                {/* Spacer so the last card isn't flush with the bottom */}
                <div className="h-24" />
            </motion.section>
        </div>
    );
}
