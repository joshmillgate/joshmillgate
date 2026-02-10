---
name: animated-line-icons
description: Creates animated line icons in Lottie JSON format. Use when asked to create animated icons, motion graphics for UI, loading animations, or icon animations. Handles conceptual design (what to animate) and technical implementation (Lottie JSON structure).
license: MIT
metadata:
  author: joshmillgate
  version: "1.0"
---

# Animated Line Icon Creation

Create looping animated icons in Lottie JSON format for web/mobile interfaces.

## When to Use

- User requests an animated icon (e.g., "create an animated book icon")
- User wants to animate an existing static icon
- User needs loading/micro-interaction animations

---

## MANDATORY: Interactive Workflow

**ALWAYS follow this interaction pattern when this skill is invoked:**

### Step A: Ask for the Icon

If the user hasn't specified which icon they want, ask:

> "What icon would you like me to create an animation for?"

Wait for their response before proceeding.

### Step B: Suggest 3 Animation Options

Once the icon is named, **always present exactly 3 animation options** before creating anything. Think about what naturally moves or could move for that icon.

**Format your response like this:**

> For a **[icon name]** icon, here are 3 animation approaches:
>
> 1. **[Animation A]** - [Brief description of motion and effect]
> 2. **[Animation B]** - [Brief description of motion and effect]
> 3. **[Animation C]** - [Brief description of motion and effect]
>
> Which style would you prefer?

**Example for a "bell" icon:**

> For a **bell** icon, here are 3 animation approaches:
>
> 1. **Gentle swing** - The bell rocks side to side like it's been tapped, with a smooth ease-out
> 2. **Ring shake** - Quick oscillating shake that suggests the bell is actively ringing
> 3. **Clapper strike** - The internal clapper swings and hits the bell wall
>
> Which style would you prefer?

**Example for a "mail" icon:**

> For a **mail** icon, here are 3 animation approaches:
>
> 1. **Envelope open** - The top flap opens upward to reveal contents
> 2. **Letter slide** - A letter/paper slides out from inside the envelope
> 3. **Arrival bounce** - The whole envelope bounces in as if newly arrived
>
> Which style would you prefer?

### Step C: Create the Animation

Only after the user selects an option (or provides custom direction), proceed with creating the Lottie JSON animation.

---

## Core Workflow

1. **Conceptualize** → What element(s) should animate?
2. **Structure** → Build the Lottie JSON skeleton
3. **Animate** → Add keyframes for motion
4. **Validate** → Test the animation loops smoothly

---

## CRITICAL STYLE REQUIREMENTS

**These specifications are NON-NEGOTIABLE. Every animation MUST follow them exactly.**

### Stroke Width
```json
"w": {"a": 0, "k": 2}
```
- **Always use stroke width of 2** - no exceptions
- This creates the thin, elegant line icon aesthetic

### No Fills - Stroke Only
- **NEVER add fills (`"ty": "fl"`)** to line icons
- Use only strokes (`"ty": "st"`)
- Dots/circles should be **hollow** (stroked ellipses), not solid

### Micro-Scale Design Pattern
**This is essential for crisp, consistent icons:**

1. Draw all paths at **~24x24 unit scale** (tiny)
2. Apply **1000x scale** to the parent layer
3. This creates pixel-perfect rendering at any size

```json
{
  "nm": "bg",
  "ks": {
    "s": {"a": 0, "k": [1000, 1000, 100]}
  }
}
```

All child layers should be parented to this scaled background layer.

### Icon Design Proportions (CRITICAL)

**The icon must look "natural" - study real-world objects for proportions.**

#### Canvas Usage Rules
- **24x24 unit canvas** - All icons are designed on a 24x24 grid
- **Use the full space** - Icons should span approximately 18-20 units (leaving 2-3px padding per side)
- **Center the icon** - Equal padding on all sides unless the design requires asymmetry

#### Proportion Guidelines
- **Study the real object** - A chat bubble is roughly square or slightly taller than wide, not a wide squat rectangle
- **Avoid stretching** - Never distort proportions to "fill" the canvas in one direction
- **Common mistake**: Making shapes too wide and short (squashed) or too tall and narrow (stretched)

#### Example: Chat Bubble Proportions

❌ **BAD** - Squashed, unnatural:
```
Width: 18 units, Height: 10 units (ratio 1.8:1)
Looks like a wide, flat rectangle - not how chat bubbles appear
```

✅ **GOOD** - Natural proportions:
```
Width: 18 units, Height: 15 units (ratio ~1.2:1)
Main body roughly square with rounded corners
Chat tail adds natural asymmetry at bottom-left
```

Reference coordinates from a well-proportioned chat bubble:
- Main body: x=3 to x=21 (18 units), y=3 to y=18 (15 units)
- Rounded corners with ~3-4 unit radius
- Chat tail extends from ~y=18 to ~y=21

#### Bounding Box Reference

| Icon Type | Typical Proportions | Notes |
|-----------|---------------------|-------|
| Chat bubble | ~1.2:1 (W:H) | Slightly wider than tall, natural speech bubble |
| Book | ~1:1.3 (W:H) | Portrait orientation like a real book |
| Envelope | ~1.4:1 (W:H) | Standard letter envelope ratio |
| Circle icons | 1:1 | Gears, clocks, search magnifiers |
| Document | ~1:1.4 (W:H) | Portrait A4/letter ratio |
| Folder | ~1.2:1 (W:H) | Landscape tab folder |

### Path Construction
- Use **bezier paths** (`"ty": "sh"`) for complex shapes
- Paths should use proper in/out handles (`"i"`, `"o"`, `"v"`)
- Avoid primitive shapes (`"el"`, `"rc"`) for main icon elements
- Primitives are only acceptable for simple geometric elements when bezier is overkill
- **Align to 1px grid** - Use whole numbers or .5 values for crisp rendering

### Line Cap & Join
```json
"lc": 2,
"lj": 2
```
- `lc: 2` = Round line caps
- `lj: 2` = Round line joins
- This creates smooth, polished endpoints

---

## Step 1: Conceptual Design

### The "What Moves?" Question

Before writing any JSON, ask: **What part of this icon naturally moves in real life?**

| Icon | Animated Element | Animation Type |
|------|------------------|----------------|
| Book | Pages | Flip/turn left to right |
| Clock | Hands | Rotate around center |
| Clipboard | Board + text lines | Wiggle rotation + text reveal |
| Bell | Bell body | Swing side to side |
| Mail | Envelope flap | Open/close |
| Settings gear | Gear | Rotate continuously |
| Heart | Whole shape | Pulse/scale |
| Search | Magnifying glass | Bounce or scan motion |
| Download | Arrow | Move downward |
| Refresh | Circular arrow | Rotate 360° |
| Chat bubble | Dots inside | Typing indicator bounce |
| Eye | Pupil or lid | Blink or look around |
| Lock | Shackle | Open/close arc |
| Folder | Top flap | Open/close |
| Calendar | Page | Flip to reveal date |
| Notification | Badge or dot | Pulse or bounce in |
| Music note | Note head | Bounce rhythmically |
| Volume | Sound waves | Pulse outward |
| Lightning | Bolt | Flash on/off |
| Loading | Circle segments | Chase around perimeter |

### Animation Principles

1. **Subtlety wins** - Small, smooth motions feel professional
2. **Loop seamlessly** - End state should match start state
3. **One focal point** - Animate 1-2 elements, not everything
4. **Real-world physics** - Motion should feel natural (ease in/out)

---

## Step 2: Lottie JSON Structure

### Canvas Settings (Always Use)

```json
{
  "v": "5.12.1",
  "fr": 60,
  "ip": 0,
  "op": 80,
  "w": 240,
  "h": 240,
  "nm": "icon_name_line",
  "ddd": 0
}
```

| Field | Value | Purpose |
|-------|-------|---------|
| `v` | "5.12.1" | Lottie version |
| `fr` | 60 | Frame rate (60fps) |
| `ip` | 0 | In point (start frame) |
| `op` | 80-100 | Out point (end frame = loop duration) |
| `w` | 240 | Width in pixels |
| `h` | 240 | Height in pixels |
| `nm` | descriptive | Animation name |
| `ddd` | 0 | 3D disabled |

### Color & Stroke Standards

Use these CSS class names for theming:

```json
{
  "ty": "st",
  "c": {"a": 0, "k": [0.035, 0.141, 0.294, 1]},
  "o": {"a": 0, "k": 100},
  "w": {"a": 0, "k": 2},
  "lc": 2,
  "lj": 2,
  "nm": ".mgc_primary_stroke",
  "cl": "mgc_primary_stroke"
}
```

```json
{
  "ty": "st",
  "c": {"a": 0, "k": [0.035, 0.141, 0.294, 1]},
  "o": {"a": 0, "k": 100},
  "w": {"a": 0, "k": 2},
  "lc": 2,
  "lj": 2,
  "nm": ".mgc_secondary_stroke",
  "cl": "mgc_secondary_stroke"
}
```

**IMPORTANT:**
- Default color: RGB(9, 36, 75) - Dark navy blue
- **Stroke width (`w`) MUST be 2**
- Line cap (`lc`) and line join (`lj`) MUST be 2 (round)

### Layer Types

| Type Code | Name | Use For |
|-----------|------|---------|
| 4 | Shape | Vector paths, strokes |
| 0 | Precomp | Nested compositions |

---

## Step 3: Animation Techniques

### Technique A: Trim Paths (Revealing/Hiding Lines)

Use for: Drawing effects, text appearing, progress indicators

```json
{
  "ty": "tm",
  "s": {
    "a": 1,
    "k": [
      {"t": 10, "s": [0], "i": {"x": [0.667], "y": [1]}, "o": {"x": [0.333], "y": [0]}},
      {"t": 20, "s": [80], "i": {"x": [0.145], "y": [1]}, "o": {"x": [0.093], "y": [0]}},
      {"t": 60, "s": [0]}
    ]
  },
  "e": {"a": 0, "k": 100},
  "m": 1,
  "nm": "Trim Paths"
}
```

### Technique B: Rotation

Use for: Gears, clocks, refresh icons, loading spinners

```json
{
  "r": {
    "a": 1,
    "k": [
      {"t": 0, "s": [0], "i": {"x": [0.327], "y": [1]}, "o": {"x": [0.167], "y": [0.167]}},
      {"t": 16, "s": [-10], "i": {"x": [0.065], "y": [1]}, "o": {"x": [0.05], "y": [0]}},
      {"t": 55, "s": [0]}
    ]
  }
}
```

### Technique C: Shape Morphing (Path Animation)

Use for: Page turns, shape transformations, organic motion

```json
{
  "ks": {
    "a": 1,
    "k": [
      {
        "t": 0,
        "s": [{"i": [[...]], "o": [[...]], "v": [[...]], "c": true}],
        "i": {"x": 0.833, "y": 0.833},
        "o": {"x": 0.167, "y": 0.167}
      },
      {
        "t": 30,
        "s": [{"i": [[...]], "o": [[...]], "v": [[...]], "c": true}]
      }
    ]
  }
}
```

### Technique D: Opacity Fade

Use for: Smooth transitions, layered effects

```json
{
  "o": {
    "a": 1,
    "k": [
      {"t": 20, "s": [0]},
      {"t": 25, "s": [100]},
      {"t": 75, "s": [100]},
      {"t": 80, "s": [0]}
    ]
  }
}
```

### Technique E: Scale Pulse

Use for: Hearts, notifications, emphasis effects

```json
{
  "s": {
    "a": 1,
    "k": [
      {"t": 0, "s": [100, 100, 100]},
      {"t": 20, "s": [115, 115, 100]},
      {"t": 40, "s": [100, 100, 100]}
    ]
  }
}
```

---

## Step 4: Layer Structure Patterns

### Pattern 1: Simple Single Layer (Rotation/Scale)

```
icon_name/
└── bg (parent, scale 1000x)
    └── main_shape (animated)
```

### Pattern 2: Multi-Element (Trim Paths)

```
clipboard/
└── bg (parent, rotation wiggle)
    ├── board_outline
    ├── clip_rect
    ├── text_line_1 (trim path)
    └── text_line_2 (trim path)
```

### Pattern 3: Complex Sequenced (Page Turns)

```
book/
└── comp_0 (precomp)
    ├── right_page_4 (shape morph, frames 212-242)
    ├── left_page_4 (shape morph, frames 182-212)
    ├── right_page_3 (shape morph, frames 151-181)
    ├── left_page_3 (shape morph, frames 121-151)
    ├── spine_right (static)
    ├── spine_left (static)
    └── bg (scale 1000x)
```

---

## Easing Curves

### Smooth Ease (Default)

```json
"i": {"x": [0.667], "y": [1]},
"o": {"x": [0.333], "y": [0]}
```

### Bounce Back

```json
"i": {"x": [0.065], "y": [1]},
"o": {"x": [0.05], "y": [0]}
```

### Linear (Constant Speed)

```json
"i": {"x": [1], "y": [1]},
"o": {"x": [0], "y": [0]}
```

---

## Validation Checklist

Before delivering:

### Icon Design
- [ ] **Natural proportions** - Icon looks like the real-world object, not squashed or stretched
- [ ] **Full canvas usage** - Icon spans ~18-20 units of the 24-unit canvas
- [ ] **Centered** - Equal padding on all sides (typically 2-3 units)
- [ ] **Grid-aligned** - Coordinates use whole numbers or .5 values

### Technical Requirements
- [ ] **Stroke width is exactly 2** - not 3, not 6, always 2
- [ ] **No fills** - line icons use strokes only
- [ ] **1000x scale pattern** - paths at ~24 units, scaled 1000x
- [ ] `op` (out point) creates smooth loop back to frame 0
- [ ] Animation duration is 1-2 seconds (60-120 frames at 60fps)
- [ ] Stroke classes use `.mgc_primary_stroke` / `.mgc_secondary_stroke`
- [ ] Canvas is 240x240
- [ ] Frame rate is 60
- [ ] All paths are closed (`"c": true`) where appropriate
- [ ] Easing curves applied (no jarring linear motion)
- [ ] Layer names are descriptive (not "Layer 1")
- [ ] `"lc": 2, "lj": 2` for round caps and joins

---

## Quick Reference: Icon Ideas

When user says "create a [X] icon", think:

| Request | Suggest Animating |
|---------|-------------------|
| "book icon" | Pages flipping |
| "clock icon" | Second/minute hand rotating |
| "bell icon" | Swinging pendulum motion |
| "mail icon" | Envelope opening |
| "heart icon" | Pulsing/beating |
| "search icon" | Magnifier scanning |
| "settings icon" | Gear rotating |
| "chat icon" | Typing dots bouncing |
| "music icon" | Notes bouncing |
| "download icon" | Arrow moving down |
| "upload icon" | Arrow moving up |
| "refresh icon" | Circular rotation |
| "notification icon" | Badge pulsing |
| "folder icon" | Opening/closing |
| "eye icon" | Blinking |
| "lock icon" | Shackle opening |
| "lightning icon" | Flashing |
| "volume icon" | Sound waves pulsing |

---

## Example: Complete Layer Structure

Proper layer structure with 1000x scale pattern:

```json
{
  "v": "5.12.1",
  "fr": 60,
  "ip": 0,
  "op": 100,
  "w": 240,
  "h": 240,
  "nm": "icon_line",
  "ddd": 0,
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "element",
      "parent": 2,
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [0, 0, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [100, 100, 100]}
      },
      "ao": 0,
      "shapes": [{
        "ty": "gr",
        "it": [
          {
            "ty": "sh",
            "ks": {
              "a": 0,
              "k": {
                "i": [[0, 0], [0, 0]],
                "o": [[0, 0], [0, 0]],
                "v": [[-4, 0], [4, 0]],
                "c": false
              }
            },
            "nm": "path"
          },
          {
            "ty": "st",
            "c": {"a": 0, "k": [0.035, 0.141, 0.294, 1]},
            "o": {"a": 0, "k": 100},
            "w": {"a": 0, "k": 2},
            "lc": 2,
            "lj": 2,
            "nm": ".mgc_primary_stroke",
            "cl": "mgc_primary_stroke"
          },
          {
            "ty": "tr",
            "p": {"a": 0, "k": [0, 0]},
            "a": {"a": 0, "k": [0, 0]},
            "s": {"a": 0, "k": [100, 100]},
            "r": {"a": 0, "k": 0},
            "o": {"a": 0, "k": 100}
          }
        ],
        "nm": "shape_group"
      }],
      "ip": 0,
      "op": 100,
      "st": 0,
      "bm": 0
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "bg",
      "sr": 1,
      "ks": {
        "o": {"a": 0, "k": 100},
        "r": {"a": 0, "k": 0},
        "p": {"a": 0, "k": [120, 120, 0]},
        "a": {"a": 0, "k": [0, 0, 0]},
        "s": {"a": 0, "k": [1000, 1000, 100]}
      },
      "ao": 0,
      "shapes": [{
        "ty": "gr",
        "it": [
          {"ty": "rc", "d": 1, "s": {"a": 0, "k": [24, 24]}, "p": {"a": 0, "k": [0, 0]}, "r": {"a": 0, "k": 0}, "nm": "bounds"},
          {"ty": "tr", "p": {"a": 0, "k": [0, 0]}, "a": {"a": 0, "k": [0, 0]}, "s": {"a": 0, "k": [100, 100]}, "r": {"a": 0, "k": 0}, "o": {"a": 0, "k": 100}}
        ],
        "nm": "bg"
      }],
      "ip": 0,
      "op": 100,
      "st": 0,
      "bm": 0
    }
  ]
}
```

**Key points:**
- The `bg` layer (ind: 2) has `"s": [1000, 1000, 100]` (1000x scale)
- Element layers use `"parent": 2` to inherit the scale
- Paths are drawn at micro-scale (~24 units wide)
- Stroke width is **always 2**
- No fills - strokes only

---

## Reference: Well-Proportioned Icon Paths

When creating icons, use these as proportion references. Study how they utilize the 24x24 canvas.

### Chat Bubble (Message Icon)
Natural proportions: Main body ~18x15 units, with chat tail extending below.

```
Main bubble body:
- Top-left corner: (3, 7.8) with curve to (3, 4.6)
- Top edge: runs from x=3 to x=21 at approximately y=3-4
- Right side: x=21 from y~4 to y~13
- Bottom: y~18 from x~3 to x~21
- Chat tail: extends from (~7, 18) down to (~8, 20.3) and back

Key points:
- Rounded corners with ~2-4 unit radius
- Body is slightly wider than tall (natural speech bubble shape)
- Adequate padding: 3 units on sides, 3 units top, ~2.5 units bottom (before tail)
```

### The "Study Real Objects" Rule

Before drawing any icon, ask: **What does this object actually look like?**

| Object | Real-world observation | Icon implication |
|--------|----------------------|------------------|
| Chat bubble | Speech bubbles are roughly square with a pointer | Don't make it a wide flat rectangle |
| Book | Books are portrait-oriented (taller than wide) | Height should exceed width |
| Envelope | Standard envelopes are ~1.4:1 landscape | Slightly wider than tall |
| Clock | Circular face | Perfect 1:1 ratio |
| Folder | Tab folders are squat rectangles | Slightly wider than tall |
| Document | Paper is portrait | Taller than wide |

---

## Files in This Skill

- [references/book-animation.json](references/book-animation.json) - Page turn example
- [references/clipboard-animation.json](references/clipboard-animation.json) - Rotation + trim paths example
