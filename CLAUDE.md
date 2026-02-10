# CLAUDE.md

## Rules

**IMPORTANT:** Always use Context7 MCP when needing library/API documentation, code generation, setup or configuration steps — without the user having to explicitly ask.

**Motion docs:** When asked to check or refer to Motion documentation, skip the library-matching step and retrieve docs directly using library `/motion_dev`.

**Animation skill:** When asked to invoke the animation skill, invoke `/web-animation-design`.

**IMPORTANT:** On elements controlled by or interacting with the Motion.dev library, always use Motion properties (e.g., `animate`, `initial`, `whileHover`) rather than CSS styles for transforms, opacity, and other animatable properties. This ensures Framer Motion can properly manage and interpolate values.

**IMPORTANT:** Never use `transition: all` in CSS. Always specify explicit properties (e.g., `transition: background 500ms, border 500ms, box-shadow 500ms`). Using `transition: all` can interfere with Lottie animations and other JavaScript-driven animations, causing them to run at incorrect speeds or behave unexpectedly.

**IMPORTANT:** When applying CSS layout properties (flexbox, grid, etc.) to elements, ALWAYS verify the HTML structure supports it. Flexbox/grid only affects direct children. If elements are wrapped in additional divs, the CSS won't work as expected. Check the actual HTML structure before writing CSS, and remove unnecessary wrapper elements if needed.

**IMPORTANT:** If you have an alternative or more complex solution than what the user requested, ask or suggest it before executing. Don't assume a different approach is better—confirm with the user first.

## Project Overview

<!-- Brief description of your project goes here -->

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter

# Testing
npm test             # Run tests
```

## Code Style

<!-- Add your code style preferences here -->
- Use TypeScript for type safety
- Follow existing patterns in the codebase

## Architecture

<!-- Document key architectural decisions and patterns -->

## Important Notes

<!-- Add project-specific notes, gotchas, or context Claude should know -->

---

*Reference: [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)*
