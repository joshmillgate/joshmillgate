"use client";

import { motion, useReducedMotion } from "framer-motion";
import BackButton from "../../components/BackButton";
import "./styles.css";

const EASING = [0.23, 1, 0.32, 1] as const;

export default function PhotoStack() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="agent-preview">
      <BackButton />
      <main className="agent-main">
        <motion.div
          className="iphone-container"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASING }}
        >
          {/* iPhone Frame */}
          <div className="iphone-frame">
            {/* Dynamic Island */}
            <div className="dynamic-island" />

            {/* Screen Content Area */}
            <div className="iphone-screen">
              {/* Your UI mockup content goes here */}
              <div className="screen-content">
                <p style={{ color: "#999", fontSize: 14 }}>Your UI here</p>
              </div>
            </div>

            {/* Home Indicator */}
            <div className="home-indicator" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
