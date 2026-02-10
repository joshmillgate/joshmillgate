"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import BackButton from "../../components/BackButton";
import "./styles.css";

type TrashState = "idle" | "hovering" | "dropping" | "full";

const EASING = [0.23, 1, 0.32, 1] as const;

// Crumpled paper effect - multiple transformed/clipped copies of the image
interface CrumpledPaperProps {
  imageSrc: string;
  index: number;
  primaryColor: string; // Dominant color for cohesive gradient effect
}

// Tessellating clip paths - divide image into non-overlapping regions
// Enhanced transforms + shadows for realistic crumpled paper look
const CRUMPLE_LAYERS = [
  // Top-left piece - folds up and back
  {
    clipPath: "polygon(0% 0%, 55% 0%, 50% 50%, 0% 45%)",
    translateX: 10, translateY: 6,
    rotate: -28, rotateX: 18, rotateY: -12,
    z: 4, scale: 0.97,
    shadow: "3px 4px 6px rgba(0,0,0,0.35), 1px 1px 2px rgba(0,0,0,0.2)",
    edgeDarken: "linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.15) 100%)",
  },
  // Top-right piece - folds forward (closest to viewer)
  {
    clipPath: "polygon(55% 0%, 100% 0%, 100% 45%, 50% 50%)",
    translateX: -6, translateY: 10,
    rotate: 32, rotateX: -22, rotateY: 18,
    z: 6, scale: 1.03,
    shadow: "4px 3px 8px rgba(0,0,0,0.4), 2px 2px 3px rgba(0,0,0,0.25)",
    edgeDarken: "linear-gradient(225deg, transparent 40%, rgba(0,0,0,0.18) 100%)",
  },
  // Bottom-right piece - tucks under (furthest)
  {
    clipPath: "polygon(100% 45%, 100% 100%, 55% 100%, 50% 50%)",
    translateX: -10, translateY: -6,
    rotate: 18, rotateX: 12, rotateY: -6,
    z: 2, scale: 0.94,
    shadow: "1px 2px 4px rgba(0,0,0,0.25)",
    edgeDarken: "linear-gradient(315deg, transparent 35%, rgba(0,0,0,0.2) 100%)",
  },
  // Bottom-left piece - folds up
  {
    clipPath: "polygon(55% 100%, 0% 100%, 0% 55%, 50% 50%)",
    translateX: 6, translateY: -10,
    rotate: -22, rotateX: -18, rotateY: 12,
    z: 3, scale: 0.96,
    shadow: "2px 2px 5px rgba(0,0,0,0.3), 1px 1px 2px rgba(0,0,0,0.15)",
    edgeDarken: "linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.15) 100%)",
  },
  // Left strip - crinkles inward
  {
    clipPath: "polygon(0% 45%, 50% 50%, 0% 55%)",
    translateX: 14, translateY: 3,
    rotate: 38, rotateX: 6, rotateY: -22,
    z: 5, scale: 1.0,
    shadow: "3px 3px 5px rgba(0,0,0,0.35)",
    edgeDarken: "linear-gradient(90deg, rgba(0,0,0,0.12) 0%, transparent 60%)",
  },
  // Center connector - bridges the folds
  {
    clipPath: "polygon(50% 50%, 55% 100%, 0% 55%)",
    translateX: 4, translateY: -4,
    rotate: -10, rotateX: -12, rotateY: 6,
    z: 1, scale: 0.92,
    shadow: "1px 1px 3px rgba(0,0,0,0.2)",
    edgeDarken: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.1) 100%)",
  },
];

// Crease lines that run across the crumpled paper
const CREASE_LINES = [
  { angle: -35, position: 30, opacity: 0.12 },
  { angle: 25, position: 55, opacity: 0.1 },
  { angle: -15, position: 75, opacity: 0.08 },
  { angle: 45, position: 20, opacity: 0.1 },
];

function CrumpledPaper({ imageSrc, index, primaryColor }: CrumpledPaperProps) {
  // Use index to vary the crumple appearance slightly
  const rotationOffset = index * 12;
  const translateMultiplier = 1 + index * 0.08;

  return (
    <div style={{
      position: "relative",
      width: 80,
      height: 95,
      transform: "scale(0.55)",
      transformOrigin: "center center",
      perspective: "200px",
    }}>
      {/* Crumpled paper pieces */}
      {CRUMPLE_LAYERS.map((layer, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 165,
            height: 195,
            clipPath: layer.clipPath,
            zIndex: layer.z,
            filter: `drop-shadow(${layer.shadow})`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `
                translate(${layer.translateX * translateMultiplier}px, ${layer.translateY * translateMultiplier}px)
                rotateX(${layer.rotateX}deg)
                rotateY(${layer.rotateY}deg)
                rotate(${layer.rotate + rotationOffset}deg)
                scale(${layer.scale})
              `,
              transformOrigin: "center center",
              transformStyle: "preserve-3d",
            }}
          >
            <Image
              src={imageSrc}
              alt=""
              width={165}
              height={195}
              style={{
                display: "block",
                filter: `brightness(${0.9 + i * 0.02})`,
              }}
            />
          </div>
        </div>
      ))}

      {/* Radial gradient overlay for color cohesion - simple soft glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 165,
          height: 195,
          background: `radial-gradient(ellipse 80% 70% at 50% 50%, ${primaryColor}25 0%, transparent 60%)`,
          pointerEvents: "none",
          zIndex: 9,
        }}
      />
    </div>
  );
}

// Trash can component
interface TrashCanProps {
  state: TrashState;
  trashedItems: string[];
}

function TrashCan({ state, trashedItems }: TrashCanProps) {
  const shouldReduceMotion = useReducedMotion();
  const isHovering = state === "hovering";
  const isFull = trashedItems.length > 0 || state === "full";

  return (
    <div className="trash-can-wrapper">
      {/* Lid */}
      <motion.div
        className="trash-can-lid"
        animate={{
          rotateX: isHovering ? -45 : 0,
          y: isHovering ? -8 : 0,
        }}
        transition={{ duration: 0.3, ease: EASING }}
      >
        <div className="lid-top" />
        <div className="lid-handle" />
      </motion.div>

      {/* Body */}
      <div className="trash-can-body">
        <div className="trash-can-inner">
          {/* Gradient overlay for depth */}
          <div className="trash-can-gradient" />

          {/* Trashed items visible at top */}
          <AnimatePresence>
            {trashedItems.map((item, index) => (
              <motion.div
                key={item}
                className="trashed-item"
                initial={shouldReduceMotion ? false : { y: -80, opacity: 0, scale: 0.3, rotate: 180 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  rotate: (index % 2 === 0 ? 1 : -1) * (8 + index * 5),
                  x: (index % 2 === 0 ? -1 : 1) * (5 + index * 10),
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: EASING }}
                style={{
                  left: "50%",
                  bottom: "5%",
                  marginLeft: -90,
                }}
              >
                <CrumpledPaper
                  imageSrc={item === "doc" ? "/images/doc-file.png" : "/images/image-file.png"}
                  index={index}
                  primaryColor={item === "doc" ? "#D4A72C" : "#2563EB"}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Frosted glass blur overlay - temporarily hidden */}
          {/* <div className="trash-can-blur-overlay" /> */}
        </div>

        {/* Rim/edge highlight */}
        <div className="trash-can-rim" />
      </div>

      {/* Shadow */}
      <motion.div
        className="trash-can-shadow"
        animate={{
          scale: isHovering ? 1.1 : 1,
          opacity: isHovering ? 0.3 : 0.2,
        }}
        transition={{ duration: 0.3, ease: EASING }}
      />
    </div>
  );
}

// Classic cartoon dust puff configuration
const PUFF_CLOUDS = [
  { x: 0, y: -18, size: 28, delay: 0 },
  { x: 20, y: -10, size: 24, delay: 0.02 },
  { x: 25, y: 10, size: 26, delay: 0.04 },
  { x: 10, y: 22, size: 22, delay: 0.06 },
  { x: -12, y: 20, size: 25, delay: 0.03 },
  { x: -25, y: 5, size: 23, delay: 0.05 },
  { x: -20, y: -12, size: 21, delay: 0.01 },
  { x: 0, y: 5, size: 30, delay: 0 },
];

// Hoisted styles to avoid recreation on every render
const CLOUD_BASE_STYLE: React.CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  background: "radial-gradient(circle at 35% 35%, #ffffff, #e8e8e8)",
  boxShadow: `
    inset -3px -3px 6px rgba(0,0,0,0.1),
    inset 3px 3px 6px rgba(255,255,255,0.95),
    2px 2px 4px rgba(0,0,0,0.15)
  `,
};

const PUFF_CONTAINER_STYLE: React.CSSProperties = {
  position: "relative",
  width: 60,
  height: 73,
};

const PUFF_INNER_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
};

function CartoonCloud({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const finalX = x * 2.5;
  const finalY = y * 2.5;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.2, 1.2, 1, 0.5],
        x: [0, finalX * 0.4, finalX * 0.8, finalX],
        y: [0, finalY * 0.4, finalY * 0.8, finalY],
      }}
      transition={{
        duration: 0.5,
        delay,
        times: [0, 0.2, 0.6, 1],
        ease: EASING,
      }}
      style={{ ...CLOUD_BASE_STYLE, width: size, height: size }}
    />
  );
}

function PuffAnimation({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 700);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={PUFF_CONTAINER_STYLE}>
      <div style={PUFF_INNER_STYLE}>
        {PUFF_CLOUDS.map((cloud, i) => (
          <CartoonCloud key={i} {...cloud} />
        ))}
      </div>
    </div>
  );
}

interface DraggableFileProps {
  onDropOnUploader: (dropPosition: { x: number; y: number }) => void;
  onHoverChange: (isHovering: boolean) => void;
  onDragStart?: () => void;
  uploaderRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isConsumed: boolean;
  imageSrc: string;
  imageAlt: string;
  position: "left" | "right";
}

function DraggableFile({ onDropOnUploader, onHoverChange, onDragStart, uploaderRef, canvasRef, isConsumed, imageSrc, imageAlt, position }: DraggableFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropzone, setIsOverDropzone] = useState(false);
  const [fileVisible, setFileVisible] = useState(true);
  const [dragRotation, setDragRotation] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const calculateRotationFromCenter = (point: { x: number; y: number }) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const angle = Math.atan2(point.y - centerY, point.x - centerX) * (180 / Math.PI);
    // Scale down the rotation to be subtle (max ~15 degrees)
    return angle * 0.15;
  };

  const checkOverlap = (point: { x: number; y: number }) => {
    if (!uploaderRef.current) return false;
    const rect = uploaderRef.current.getBoundingClientRect();
    return (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    );
  };

  const handleDrop = (point: { x: number; y: number }) => {
    setFileVisible(false);
    // Calculate position relative to canvas
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const relativeX = point.x - canvasRect.left;
      const relativeY = point.y - canvasRect.top;
      onDropOnUploader({ x: relativeX, y: relativeY });
    } else {
      onDropOnUploader(point);
    }
  };

  const [isResetting, setIsResetting] = useState(false);

  // Reset when not consumed
  useEffect(() => {
    if (!isConsumed && !fileVisible) {
      const timer1 = setTimeout(() => setIsResetting(true), 0);
      const timer2 = setTimeout(() => setFileVisible(true), 0);
      // Clear resetting flag after animation completes
      const timer3 = setTimeout(() => setIsResetting(false), 500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isConsumed, fileVisible]);


  return (
    <motion.div
      drag={fileVisible && !isConsumed}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        onDragStart?.();
      }}
      onDrag={(_, info) => {
        const hovering = checkOverlap(info.point);
        if (hovering !== isOverDropzone) {
          setIsOverDropzone(hovering);
          onHoverChange(hovering);
        }
        setDragRotation(calculateRotationFromCenter(info.point));
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        setIsOverDropzone(false);
        setDragRotation(0);
        const isDroppedOnUploader = checkOverlap(info.point);
        if (!isDroppedOnUploader) {
          onHoverChange(false);
        }
        if (isDroppedOnUploader) {
          handleDrop(info.point);
        }
      }}
      whileDrag={{
        scale: 1.1,
        cursor: "grabbing",
        zIndex: 100,
      }}
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, rotate: position === "right" ? 6 : -6 }}
      animate={{
        opacity: fileVisible ? 1 : 0,
        scale: fileVisible ? 1 : isResetting ? 0 : 0.5,
        rotate: isDragging ? dragRotation : (position === "right" ? 6 : -6),
        filter: isDragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.2))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
      }}
      transition={{
        duration: isResetting ? 0.5 : 0.15,
        ease: EASING,
        filter: { duration: 0.2 },
        rotate: isDragging
          ? { type: "spring", stiffness: 300, damping: 30 }
          : { duration: 0.3, ease: EASING }
      }}
      style={{
        position: "absolute",
        ...(position === "right"
          ? { bottom: -30, right: -20 }
          : { top: "30%", left: -50 }),
        cursor: fileVisible ? "grab" : "default",
        touchAction: "none",
        zIndex: isDragging ? 100 : 10,
      }}
    >
      <Image src={imageSrc} alt={imageAlt} width={90} height={110} draggable={false} />
    </motion.div>
  );
}

interface TrashDropZoneProps {
  uploaderRef: React.RefObject<HTMLDivElement | null>;
  state: TrashState;
  isHovering: boolean;
  trashedItems: string[];
}

function TrashDropZone({ uploaderRef, state, isHovering, trashedItems }: TrashDropZoneProps) {
  const shouldReduceMotion = useReducedMotion();
  const displayState: TrashState = state === "idle" && isHovering ? "hovering" : state;
  const hasItems = trashedItems.length > 0;
  const textOpacity = hasItems && displayState !== "hovering" ? 0.5 : 1;

  return (
    <div
      ref={uploaderRef}
      className="trash-drop-zone"
      data-state={displayState}
      data-hovering={isHovering}
    >
      <TrashCan state={displayState} trashedItems={trashedItems} />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={displayState === "hovering" ? "hovering" : "idle"}
          className="trash-status-text"
          data-state={displayState}
          initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)", y: 4 }}
          animate={{ opacity: textOpacity, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
          transition={{ duration: 0.3, ease: EASING }}
        >
          {displayState === "hovering" ? "Drop to delete" : "Drag files to trash"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

type FileType = "doc" | "image";

export default function FileUpload() {
  const shouldReduceMotion = useReducedMotion();
  const [trashState, setTrashState] = useState<TrashState>("idle");
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);
  const [trashedItems, setTrashedItems] = useState<string[]>([]);
  const [puffPosition, setPuffPosition] = useState<{ x: number; y: number } | null>(null);
  const [resetKeys, setResetKeys] = useState({ doc: 0, image: 0 });
  const uploaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = (fileType: FileType) => (dropPosition: { x: number; y: number }) => {
    if (trashState === "idle" || trashState === "full") {
      setPuffPosition(dropPosition);
      setTrashState("dropping");
      setIsHoveringDropzone(false);
      // Add to trashedItems immediately so the draggable file disappears
      setTrashedItems(prev => [...prev, fileType]);
      setTimeout(() => {
        setTrashState("full");
      }, 300);
    }
  };

  const handlePuffComplete = () => {
    setPuffPosition(null);
  };

  const handleReset = () => {
    setTrashState("idle");
    setIsHoveringDropzone(false);
    setResetKeys(prev => ({
      doc: trashedItems.includes("doc") ? prev.doc + 1 : prev.doc,
      image: trashedItems.includes("image") ? prev.image + 1 : prev.image,
    }));
    setTrashedItems([]);
  };

  const handleFileDragStart = () => {
    // Allow dragging more files even when trash is full
  };

  return (
    <div className="agent-preview">
      <BackButton />
      <main className="agent-main">
        <motion.div
          ref={canvasRef}
          className="agent-canvas"
          style={{ borderRadius: 24, position: "relative", overflow: "visible" }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASING }}
        >
          <TrashDropZone
            uploaderRef={uploaderRef}
            state={trashState}
            isHovering={isHoveringDropzone}
            trashedItems={trashedItems}
          />

          <AnimatePresence>
            {trashState === "full" && trashedItems.length > 0 ? (
              <div className="reset-button-wrapper">
                <motion.button
                  className="reset-button"
                  onClick={handleReset}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.5, ease: EASING } }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.15, ease: EASING } }}
                >
                  Empty Trash
                </motion.button>
              </div>
            ) : null}
          </AnimatePresence>
          <DraggableFile
            key={`doc-${resetKeys.doc}`}
            onDropOnUploader={handleFileDrop("doc")}
            onHoverChange={setIsHoveringDropzone}
            onDragStart={handleFileDragStart}
            uploaderRef={uploaderRef}
            canvasRef={canvasRef}
            isConsumed={trashedItems.includes("doc")}
            imageSrc="/images/doc-file.png"
            imageAlt="Document file"
            position="right"
          />
          <DraggableFile
            key={`image-${resetKeys.image}`}
            onDropOnUploader={handleFileDrop("image")}
            onHoverChange={setIsHoveringDropzone}
            onDragStart={handleFileDragStart}
            uploaderRef={uploaderRef}
            canvasRef={canvasRef}
            isConsumed={trashedItems.includes("image")}
            imageSrc="/images/image-file.png"
            imageAlt="Image file"
            position="left"
          />

          {/* Puff animation at drop position */}
          {puffPosition ? (
            <div
              style={{
                position: "absolute",
                left: puffPosition.x,
                top: puffPosition.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 50,
              }}
            >
              <PuffAnimation onComplete={handlePuffComplete} />
            </div>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
