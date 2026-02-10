"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Lottie from "lottie-react";
import { useEffect, useState, useRef } from "react";
import BackButton from "../../components/BackButton";
import "./styles.css";

type UploadState = "idle" | "scanning" | "uploading" | "success";

const LOADING_ICON = "/icons/loading_5_line.json";
const ATTACHMENT_ICON = "/icons/attachment_2_line.json";
const CHECK_CIRCLE_ICON = "/icons/check_circle_line.json";
const UPLOAD_ICON = "/icons/upload_2_line.json";

const EASING = [0.23, 1, 0.32, 1] as const;

const STATUS_TEXT: Record<UploadState, string> = {
  idle: "Drag and drop a file to upload",
  scanning: "Scanning File...",
  uploading: "Uploading...",
  success: "File uploaded!",
};

type OrbState = "idle" | "idle-hover" | "scanning" | "uploading" | "success";

interface OrbIconProps {
  state: OrbState;
  animationData: object | null;
  autoplay?: boolean;
  loop?: boolean;
}

function OrbIcon({ state, animationData, autoplay = true, loop = true }: OrbIconProps) {
  const shouldReduceMotion = useReducedMotion();

  if (!animationData) return null;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={state}
        className="orb-icon"
        data-state={state}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: EASING }}
      >
        <Lottie
          animationData={animationData}
          autoplay={autoplay}
          loop={loop}
          style={{ width: 20, height: 20 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

interface DraggableFileProps {
  onDropOnUploader: (dropPosition: { x: number; y: number }) => void;
  onHoverChange: (isHovering: boolean) => void;
  onDragStart?: () => void;
  uploaderRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  isConsumed: boolean;
  uploadState: UploadState;
  imageSrc: string;
  imageAlt: string;
  position: "left" | "right";
}

function DraggableFile({ onDropOnUploader, onHoverChange, onDragStart, uploaderRef, canvasRef, isConsumed, uploadState, imageSrc, imageAlt, position }: DraggableFileProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropzone, setIsOverDropzone] = useState(false);
  const [fileVisible, setFileVisible] = useState(true);
  const [dragRotation, setDragRotation] = useState(0);
  const [isShowingScanning, setIsShowingScanning] = useState(false);
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


  // Show file again on success with pop-in animation
  useEffect(() => {
    if (isConsumed && uploadState === "success" && !fileVisible) {
      // First set the flag to prep the starting scale
      const timer1 = setTimeout(() => setIsShowingScanning(true), 0);
      // Delay slightly so scale 0.8 is applied before visibility
      const timer2 = setTimeout(() => {
        setFileVisible(true);
      }, 50);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
    if (uploadState === "idle") {
      const timer = setTimeout(() => setIsShowingScanning(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isConsumed, uploadState, fileVisible]);

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
        scale: fileVisible ? 1 : isShowingScanning ? 0.8 : isResetting ? 0 : 0.5,
        rotate: isDragging ? dragRotation : (position === "right" ? 6 : -6),
        filter: isDragging ? "drop-shadow(0 12px 24px rgba(0,0,0,0.2))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
        x: isShowingScanning ? 0 : undefined,
        y: isShowingScanning ? 0 : undefined,
      }}
      transition={{
        duration: isShowingScanning ? 0.35 : isResetting ? 0.5 : 0.15,
        ease: EASING,
        filter: { duration: 0.2 },
        rotate: isDragging
          ? { type: "spring", stiffness: 300, damping: 30 }
          : { duration: 0.3, ease: EASING },
        x: { duration: 0 },
        y: { duration: 0 },
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

interface FileUploaderProps {
  uploaderRef: React.RefObject<HTMLDivElement | null>;
  state: UploadState;
  isHovering: boolean;
}

type AnimationData = Record<UploadState, object | null>;

function FileUploader({ uploaderRef, state, isHovering }: FileUploaderProps) {
  const [anims, setAnims] = useState<AnimationData>({
    idle: null,
    scanning: null,
    uploading: null,
    success: null,
  });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    Promise.all([
      fetch(ATTACHMENT_ICON).then(res => res.json()),
      fetch(LOADING_ICON).then(res => res.json()),
      fetch(UPLOAD_ICON).then(res => res.json()),
      fetch(CHECK_CIRCLE_ICON).then(res => res.json()),
    ])
      .then(([idle, scanning, uploading, success]) => {
        setAnims({ idle, scanning, uploading, success });
      })
      .catch(console.error);
  }, []);

  const orbState: OrbState = state === "idle" && isHovering ? "idle-hover" : state;

  return (
    <div
      ref={uploaderRef}
      className="file-uploader"
      data-state={state}
      data-hovering={isHovering}
    >
      <OrbIcon
        state={orbState}
        animationData={anims[state]}
        autoplay={state === "idle" ? isHovering : true}
        loop={state !== "success"}
      />

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state === "idle" ? `idle-${isHovering}` : state}
          className="file-uploader-text"
          data-state={state}
          initial={shouldReduceMotion ? false : { opacity: 0, filter: "blur(4px)", y: 4 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(4px)", y: -4 }}
          transition={{ duration: 0.3, ease: EASING }}
        >
          {state === "idle" && isHovering ? "Drop it like its hot" : STATUS_TEXT[state]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

type FileType = "doc" | "image";

export default function FileUpload() {
  const shouldReduceMotion = useReducedMotion();
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [isHoveringDropzone, setIsHoveringDropzone] = useState(false);
  const [consumedFiles, setConsumedFiles] = useState<Set<FileType>>(new Set());
  const [resetKeys, setResetKeys] = useState({ doc: 0, image: 0 });
  const uploaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleFileDrop = (fileType: FileType) => () => {
    if (uploadState === "idle") {
      setConsumedFiles(prev => new Set(prev).add(fileType));
      setTimeout(() => setUploadState("scanning"), 200);
    }
  };

  // State machine transitions
  useEffect(() => {
    if (uploadState === "scanning") {
      const timer = setTimeout(() => setUploadState("uploading"), 3000);
      return () => clearTimeout(timer);
    }
    if (uploadState === "uploading") {
      const timer = setTimeout(() => setUploadState("success"), 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadState]);

  const handleReset = (skipKeyReset?: boolean) => {
    setUploadState("idle");
    setIsHoveringDropzone(false);
    if (skipKeyReset !== true) {
      setResetKeys(prev => ({
        doc: consumedFiles.has("doc") ? prev.doc + 1 : prev.doc,
        image: consumedFiles.has("image") ? prev.image + 1 : prev.image,
      }));
    }
    setConsumedFiles(new Set());
  };

  const handleFileDragStart = () => {
    if (uploadState === "success") {
      handleReset(true); // Skip key reset to prevent flash - files are already visible
    }
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
          <FileUploader uploaderRef={uploaderRef} state={uploadState} isHovering={isHoveringDropzone} />

          <AnimatePresence>
            {uploadState === "success" ? (
              <div className="reset-button-wrapper">
                <motion.button
                  className="reset-button"
                  onClick={handleReset}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 1, ease: EASING } }}
                  exit={{ opacity: 0, y: 10, transition: { duration: 0.15, ease: EASING } }}
                >
                  Upload another file
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
            isConsumed={consumedFiles.has("doc")}
            uploadState={uploadState}
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
            isConsumed={consumedFiles.has("image")}
            uploadState={uploadState}
            imageSrc="/images/image-file.png"
            imageAlt="Image file"
            position="left"
          />
        </motion.div>
      </main>
    </div>
  );
}
