"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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

interface TreeItem {
    name: string;
    type: "folder" | "file";
    children?: string[];
    tooltip?: string;
}

const treeData: TreeItem[] = [
    { name: "design", type: "folder", children: ["COMPONENTS.md", "UX_PATTERNS.md", "DESIGN_SYSTEM.md"], tooltip: "Design system, colour palette, typography, component patterns" },
    { name: "developer", type: "folder", children: ["WORKFLOW.md", "TESTING.md", "CONVENTIONS.md", "ONBOARDING.md", "SECURITY.md"], tooltip: "Code conventions, git workflow, testing strategy" },
    { name: "features", type: "folder", children: ["_template.md"], tooltip: "One file per feature - spec, tasks, and browser test results" },
    { name: "ops", type: "folder", children: ["MONITORING.md", "CI_CD.md", "INFRASTRUCTURE.md"], tooltip: "Infrastructure, deployment pipeline, monitoring" },
    { name: "project", type: "folder", children: ["ROADMAP.md", "SCOPE.md", "OVERVIEW.md", "DECISIONS.md", "TASK-LIST.md"], tooltip: "The big picture - what you're building, scope, roadmap, decisions log, task list" },
    { name: "technical", type: "folder", children: ["API_CONTRACTS.md", "DATA_MODELS.md", "ARCHITECTURE.md", "ENVIRONMENT.md", "STACK.md"], tooltip: "Tech stack, architecture, data models, API contracts, environment variables" },
    { name: "README.md", type: "file" },
    { name: "SETUP.md", type: "file" },
];

function FolderIcon() {
    return (
        <span className="arche-tree-icon arche-tree-icon-folder">
            <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z" />
            </svg>
        </span>
    );
}

function FileIcon() {
    return (
        <span className="arche-tree-icon arche-tree-icon-file">
            <svg width="18" height="18" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
            </svg>
        </span>
    );
}

export default function Arche() {
    const shouldReduceMotion = useReducedMotion();
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
    const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

    const toggleFolder = (name: string) => {
        setOpenFolders(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }
            return next;
        });
    };

    const getInitial = (variant: "hidden" | false) =>
        shouldReduceMotion ? false : variant;

    return (
        <div className="arche-page">
            <BackButton />
            <main className="arche-main">
                <motion.div
                    className="arche-content"
                    variants={stagger}
                    initial={getInitial("hidden")}
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div
                        className="arche-header"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <h1 className="arche-title">archē</h1>
                        <p className="arche-subtitle">
                            Archē (pronounced R-K) is an ancient Greek concept meaning:
                            the first principle, origin, or fundamental foundation from which everything arises.
                        </p>
                        <p className="arche-description">
                            Archē is a vibecoding framework or "meta-context" that gives Claude everything it needs to build your app autonomously and efficiently.
                        </p>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="arche-divider"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: EASING }}
                    />

                    {/* Folder Structure Mockup */}
                    <motion.div
                        className="arche-mockup-wrapper"
                        variants={fadeUp}
                        transition={{ duration: 0.35, ease: EASING }}
                    >
                        <div className="arche-mockup-label">context/ folder structure</div>
                        <p className="arche-description" style={{ marginBottom: 24 }}>Everything Claude knows about your project lives in <code>context/</code>. Generated during setup and kept up to date automatically. You never need to re-explain your project</p> 
                        
                        <div className="arche-folder-tree">
                            <div className="arche-folder-titlebar">
                                <span className="arche-folder-titlebar-dot" />
                                <span className="arche-folder-titlebar-dot" />
                                <span className="arche-folder-titlebar-dot" />
                                <span className="arche-folder-titlebar-text">context</span>
                            </div>
                            <ul className="arche-tree-list">
                                {treeData.map((item, i) => {
                                    const isOpen = openFolders.has(item.name);
                                    return (
                                        <motion.li
                                            key={item.name}
                                            className="arche-tree-item-wrapper"
                                            variants={fadeUp}
                                            transition={{
                                                duration: 0.3,
                                                ease: EASING,
                                                delay: shouldReduceMotion ? 0 : 0.3 + i * 0.04,
                                            }}
                                        >
                                            <div
                                                className={`arche-tree-item${item.type === "folder" ? " arche-tree-item-folder" : ""}`}
                                                onClick={item.type === "folder" ? () => toggleFolder(item.name) : undefined}
                                                onMouseEnter={item.tooltip ? () => setHoveredFolder(item.name) : undefined}
                                                onMouseLeave={item.tooltip ? () => setHoveredFolder(null) : undefined}
                                            >
                                                <AnimatePresence>
                                                    {item.tooltip && hoveredFolder === item.name && (
                                                        <motion.div
                                                            className="arche-folder-tooltip"
                                                            initial={{ opacity: 0, y: 6 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: 6 }}
                                                            transition={{ duration: 0.18, ease: EASING }}
                                                        >
                                                            {item.tooltip}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                {item.type === "folder" && (
                                                    <span className={`arche-tree-chevron${isOpen ? " arche-tree-chevron-open" : ""}`}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="9 18 15 12 9 6" />
                                                        </svg>
                                                    </span>
                                                )}
                                                {item.type === "file" && <span style={{ width: 14 }} />}
                                                {item.type === "folder" ? <FolderIcon /> : <FileIcon />}
                                                <span>{item.name}</span>
                                            </div>
                                            <AnimatePresence>
                                                {item.type === "folder" && isOpen && item.children && (
                                                    <motion.ul
                                                        className="arche-tree-children"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2, ease: EASING }}
                                                    >
                                                        {item.children.map(child => (
                                                            <li key={child} className="arche-tree-item arche-tree-item-child">
                                                                <FileIcon />
                                                                <span>{child}</span>
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </motion.div>

                    {/* ─── Commands ─── */}
                    <motion.div
                        className="arche-section"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <div className="arche-section-label">Commands</div>
                        <div className="arche-table-wrapper">
                            <table className="arche-table">
                                <thead>
                                    <tr>
                                        <th>Command</th>
                                        <th>What it does</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>/setup</code></td>
                                        <td>Start here. Runs the setup wizard to understand your idea and generate all project context files. Run once on a new project.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/continue</code></td>
                                        <td>Pick up where you left off. Claude reads the project state, figures out what was in progress, and resumes - no explanation needed. Use this any time you start a new session or feel lost.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/build [feature]</code></td>
                                        <td>Build a feature end-to-end - spec, code, review, tests, browser testing, and docs. Example: <code>/build user login</code></td>
                                    </tr>
                                    <tr>
                                        <td><code>/fix [bug]</code></td>
                                        <td>Fix a bug. Describe what&apos;s wrong in plain English and Claude investigates and fixes it. Example: <code>/fix the signup form isn&apos;t sending emails</code></td>
                                    </tr>
                                    <tr>
                                        <td><code>/test [feature]</code></td>
                                        <td>Generate a browser test guide for any feature. Leave blank to test the most recently built feature.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/review [file]</code></td>
                                        <td>Run a code quality review. Leave blank to review recent changes.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/status</code></td>
                                        <td>See the current state of the project - active tasks, feature progress, recent work, and what&apos;s next.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/tasks</code></td>
                                        <td>View and manage the task list. See active, blocked, and completed tasks.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/tasks next</code></td>
                                        <td>Find out exactly what to work on next.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/tasks add &quot;...&quot;</code></td>
                                        <td>Add a new task manually.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/tasks done T5</code></td>
                                        <td>Mark a task as complete.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/sync</code></td>
                                        <td>Sync all context files to reflect the current state of the codebase. Run if the docs feel out of date.</td>
                                    </tr>
                                    <tr>
                                        <td><code>/deep [problem]</code></td>
                                        <td>Invoke the Opus AI agent for complex bugs or architecture decisions. Claude will warn you about the higher cost before proceeding.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="arche-divider"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: EASING }}
                    />

                    {/* ─── Agents ─── */}
                    <motion.div
                        className="arche-section"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <div className="arche-section-label">The Agents</div>
                        <p className="arche-description" style={{ marginBottom: 20 }}>Claude uses a set of specialist agents behind the scenes - each focused on a specific job. They&apos;re dispatched automatically; you never need to invoke them directly.</p>
                        <div className="arche-table-wrapper">
                            <table className="arche-table">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>What it does</th>
                                        <th>Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><code>scope-checker</code></td>
                                        <td>Checks whether a request fits the agreed project plan before any work starts</td>
                                        <td><span className="arche-cost arche-cost-low">Very low</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>feature-planner</code></td>
                                        <td>Turns a feature idea into a detailed spec with user stories, edge cases, and a task breakdown</td>
                                        <td><span className="arche-cost arche-cost-low">Low</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>code-reviewer</code></td>
                                        <td>Reviews code for quality, security, and correctness before it&apos;s committed</td>
                                        <td><span className="arche-cost arche-cost-med">Medium</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>test-writer</code></td>
                                        <td>Writes automated tests for completed features</td>
                                        <td><span className="arche-cost arche-cost-med">Medium</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>uat-guide</code></td>
                                        <td>Generates the plain-English browser test checklist for you to follow</td>
                                        <td><span className="arche-cost arche-cost-med">Medium</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>context-updater</code></td>
                                        <td>Keeps all context files and the task list up to date after work completes</td>
                                        <td><span className="arche-cost arche-cost-low">Very low</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>next-action</code></td>
                                        <td>Reads the task list and roadmap to determine what to work on next</td>
                                        <td><span className="arche-cost arche-cost-low">Very low</span></td>
                                    </tr>
                                    <tr>
                                        <td><code>deep-solver</code></td>
                                        <td>Deep investigation for complex bugs or architecture decisions. Uses the Opus model - requires your confirmation due to higher cost</td>
                                        <td><span className="arche-cost arche-cost-high">High</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="arche-divider"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: EASING }}
                    />

                    {/* ─── Build Pipeline ─── */}
                    <motion.div
                        className="arche-section"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <div className="arche-section-label">The Build Pipeline</div>
                        <p className="arche-description" style={{ marginBottom: 24 }}>When you run <code>/build</code>, here&apos;s exactly what happens:</p>

                        <div className="arche-pipeline">
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">1</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Scope check</div>
                                    <div className="arche-pipeline-desc">Claude verifies the feature is within the agreed project plan before touching any code.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">2</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Feature spec</div>
                                    <div className="arche-pipeline-desc">If no spec exists, Claude creates one - a breakdown of what the feature does, who uses it, the happy path, edge cases, and a task list. You review it before anything is built.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">3</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Build</div>
                                    <div className="arche-pipeline-desc">Claude works through the task list one task at a time, marking each one complete as it goes. You see real progress, not just a finished result at the end.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">4</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Code review</div>
                                    <div className="arche-pipeline-desc">An automatic review checks for quality issues, security problems, and anything that doesn&apos;t match your project&apos;s conventions.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">5</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Automated tests</div>
                                    <div className="arche-pipeline-desc">Claude writes and runs tests. If any fail, it fixes them before continuing.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step arche-pipeline-step-human">
                                <div className="arche-pipeline-number">6</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Browser testing <span className="arche-human-badge">← the human step</span></div>
                                    <div className="arche-pipeline-desc">Claude generates a friendly checklist of things to try in your actual browser. You follow the steps and report back. If anything looks wrong, describe it - Claude fixes it. This is the only step that requires you to do anything.</div>
                                </div>
                            </div>
                            <div className="arche-pipeline-step">
                                <div className="arche-pipeline-number">7</div>
                                <div className="arche-pipeline-body">
                                    <div className="arche-pipeline-title">Context sync</div>
                                    <div className="arche-pipeline-desc">All documentation is updated: task list, feature status, architecture notes, any decisions made during the build.</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <motion.div
                        className="arche-divider"
                        variants={fadeUp}
                        transition={{ duration: 0.25, ease: EASING }}
                    />

                    {/* Getting started */}
                    <motion.div
                        className="arche-getting-started"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <div className="arche-section-label">How to get started</div>
                        <p className="arche-description">Start a new project with Claude and include the context folder in the root. Run <code>/start</code> to begin.</p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        className="arche-cta-wrapper"
                        variants={fadeUp}
                        transition={{ duration: 0.3, ease: EASING }}
                    >
                        <Link
                            href="https://github.com/joshmillgate/arche"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="arche-cta"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            View on GitHub
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
