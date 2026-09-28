---
name: Colab Workspace
description: A paper-and-ink review thread for a team that holds one AI conversation together.
colors:
  paper: "#fbfaf8"
  surface: "#ffffff"
  sunk: "#f4f3f0"
  ink: "#16191d"
  ink-muted: "#5a636e"
  ink-faint: "#6b737e"
  rule: "#dde1e6"
  rule-strong: "#c3c9d1"
  accent: "#2d3ba8"
  accent-hover: "#232e86"
  accent-ink: "#ffffff"
  accent-wash: "#eceef9"
  add: "#146c2e"
  remove: "#a4231c"
  warn: "#8a5a00"
  focus: "#2d3ba8"
typography:
  display:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
  author:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "normal"
  body:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  control:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "normal"
  hint:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "normal"
  label:
    fontFamily: "Public Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "normal"
    fontFeature: "tnum 1"
  tag:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  default: "3px"
  focus: "2px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  xxl: "20px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.control}"
    rounded: "{rounded.default}"
    padding: "0 14px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.accent-ink}"
  button-primary-disabled:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.control}"
    rounded: "{rounded.default}"
    padding: "0 14px"
    height: "36px"
  button-quiet-hover:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.remove}"
    typography: "{typography.control}"
    rounded: "{rounded.default}"
    padding: "0 14px"
    height: "36px"
  field-label:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
  field-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.default}"
    padding: "0 10px"
    height: "36px"
  field-input-placeholder:
    textColor: "{colors.ink-faint}"
  composer:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.default}"
    padding: "8px 12px"
    height: "36px"
  alert:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.default}"
    padding: "10px 12px"
  rail-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.default}"
    padding: "6px 8px"
  rail-item-hover:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink}"
  presence-chip:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.tag}"
    rounded: "{rounded.default}"
    size: "20px"
  message-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "8px 20px"
  gutter-cell:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-faint}"
    typography: "{typography.figure}"
    padding: "8px 16px"
    width: "72px"
  status-dot:
    backgroundColor: "{colors.add}"
    rounded: "{rounded.pill}"
    size: "6px"
---

# Design System: Colab Workspace

## Overview

**Creative North Star: "The Review Thread"**

This is a working record, not a conversation window. The room reads like a diff view a team is
writing together: a warm paper ground, near-black ink text, a structural monospace gutter
running the full height of the thread, and every utterance rendered as a ruled row with an
author, a clock time and a read state. Where the category ships alternating coloured bubbles,
this world ships rows. Nothing about a message's identity is carried by a shape or a fill — it
is carried by the gutter mark, the author line and the `you` tag.

Density is that of a text editor rather than a marketing page: 36px controls, 44px section
headers, 48px app header, 8px vertical padding on a message row. The interface is almost
entirely two neutrals and one accent. Separation is done with a single hairline colour and with
space; there is not one shadow, gradient or blur in the build. Light is the primary scene — a
reading surface for a record people will scan for hours — and dark is a second, separately
authored palette rather than an inversion of the first.

Colour is lawful and scarce. Ink indigo is the only accent and it means "interactive primary,
focus, or unread". Addition green, removal red and amber caution mark real system state
(connected, disconnected, connecting, destructive, failed) and are never spent on emphasis or
category. The result is a surface where a spot of colour is always information.

**Key Characteristics:**
- Paper ground (`paper`) with near-black ink body text; white only for surfaces you type into
- Hairline rules and a tonal gutter instead of cards, panels or shadows
- One accent, ink indigo, for interactive primary, focus and unread only
- Public Sans for what people wrote; JetBrains Mono, tabular, for what the machine counted
- 3px radius on every box; circles reserved for things that genuinely are dots
- Two fully authored themes, light primary and dark peer, switched by `prefers-color-scheme`
- One authored motion: a row arriving from an already-visible default

## Colors

A warm neutral paper scale carrying a cool slate ink scale, cut once by a saturated ink indigo.

### Primary

- **Ink Indigo** (`accent`): the only accent in the system. It fills the primary button, draws
  the 2px focus ring on every focusable element, paints the 2px unread bar in the thread gutter,
  sets the caret and the native `accent-color`, and marks the `you` tag and the unread count. It
  is never a background wash for content, never a heading colour, never decoration. In dark it is
  re-picked as a light periwinkle so it stays the brightest interactive mark on a dark ground.
- **Deep Ink Indigo** (`accent-hover`): the primary button's hover fill, and nothing else.
- **Accent Counter** (`accent-ink`): text and icons sitting on an accent fill.
- **Indigo Wash** (`accent-wash`): the text-selection background, chosen so selected ink stays at
  full contrast. It is a browser surface, not a component fill.

### Neutral

- **Warm Paper** (`paper`): the page ground, set on `body` and inherited everywhere. Also the 3px
  inset border that keeps the scrollbar thumb off its own track edge.
- **Sheet White** (`surface`): reserved for surfaces a person types into — text inputs, the
  select, the composer. White in this world reads as "editable".
- **Recessed Paper** (`sunk`): the one tonal step down. It fills the thread gutter (at 60%
  opacity), the hover state of rail items and quiet buttons, and the presence chip.
- **Near-Black Ink** (`ink`): body copy, message text, author names, headings, and the sentence
  inside an alert.
- **Slate Ink** (`ink-muted`): secondary text — field labels, intros, the signed-in name,
  connection copy, the rail's explanatory text.
- **Faint Slate** (`ink-faint`): the third tier — clock times, placeholders, hints, workspace role
  tags, the disabled rail action, and the scrollbar thumb on hover. This value sits at the floor
  of the text scale precisely because it must still clear 4.5:1 against paper; it is not a
  decorative grey with a licence to go lighter.
- **Hairline** (`rule`): every border in the system — the header rule, the rail edge, the row
  separators, input strokes, the composer edge.
- **Heavy Hairline** (`rule-strong`): the deliberate second weight — input hover strokes, the
  scrollbar thumb, and the empty-state icon.

### Status

- **Addition Green** (`add`): the live connection dot. Reserved for real additive state.
- **Removal Red** (`remove`): the disconnected dot, the alert stroke and frame, the danger
  button's hover stroke and wash, and the connection-failure line in the rail footer.
- **Amber Caution** (`warn`): the connecting dot only.

### Named Rules

**The One Accent Rule.** Ink indigo is the system's only accent. It marks interactive primary,
focus and unread. If a mark is not one of those three things, it is not indigo.

**The Status-Colour Law.** Green, red and amber report real machine state — connected,
disconnected, connecting, destructive, failed. They never carry emphasis, category, sentiment or
decoration. A green dot in this interface always means a socket is open.

**The Two-Scene Rule.** Dark is an authored palette, not an inversion. Every token is picked
again for the dark ground — the accent flips from deep indigo to light periwinkle, the status
hues are re-lightened — so neither scene is the other one turned inside out.

**The White-Means-Editable Rule.** `surface` white appears only where a person may type.
Everything else sits on paper.

## Typography

**Display / Body Font:** Public Sans (with `ui-sans-serif`, `system-ui`, `sans-serif`)
**Figure / Mono Font:** JetBrains Mono (with `ui-monospace`, `monospace`)

Both are loaded through `next/font` with `display: swap`, exposed as CSS variables and bound into
the Tailwind theme. There is no display face and no third family: the whole system is one
grotesque plus one mono.

**Character:** Public Sans is plain, wide-aperture and unfussy — it disappears under the text so
a working record reads like a record. JetBrains Mono does the machine's half of the page:
timestamps, roles, initials, counts and error strings, always in a column that lines up.

### Hierarchy

- **Display** (600, 1.375rem, -0.02em): the single `h1` on each auth surface. Once per page, and
  never in the room.
- **Title** (600, 0.875rem, -0.01em): the product name in the app header and the room name above
  the thread. The room's own label is small on purpose — the thread outranks its header.
- **Author** (600, 0.8125rem): the name on the first row of a hunk. Half a step below Title.
- **Body** (400, 0.875rem, 1.625): message text, rail copy, intros, links. Message paragraphs are
  capped at 68ch and preserve their own newlines.
- **Control** (500, 0.875rem): every button label.
- **Hint** (400, 0.75rem): field hints and the connection line in the rail footer.
- **Label** (600, 0.6875rem, 0.08em, uppercase): field labels and section headings only.
- **Figure** (mono, 0.6875rem, tabular): clock times, the unread count, the connection-failure
  string.
- **Tag** (mono, 0.625rem, 0.08em, uppercase): workspace roles, the `you` marker, presence
  initials.

### Named Rules

**The Figures-in-Mono Rule.** Public Sans carries what a person wrote. JetBrains Mono carries
what the machine counted — times, roles, ids, counts, error strings. Anything mono that stacks in
a column also carries `.tnum` (tabular numerals) so the column is straight.

**The 68ch Rule.** A message paragraph is capped at 68 characters of measure however wide the
thread column grows. The column may widen; the line never does.

**The Uppercase Budget Rule.** Uppercase exists only at 10–11px with 0.08em tracking, on field
labels, section headings and mono tags. Nothing inside a sentence, and nothing above 11px, is
uppercased.

## Layout

The app is a full-height flex column that never scrolls as a page: `html` and `body` are
`h-full`, every region is a flex child, and the only scrolling element is the thread. A 48px app
header spans the top on a hairline. Beneath it the rail and the thread sit side by side, meeting
on a single vertical hairline.

**The rail** is 260px, fixed, and does not scroll as a whole: a 44px section header carrying the
"Workspaces" label and a create action, a scrolling list in the middle, and a footer pinned by
`mt-auto` above a hairline carrying the connection dot and, when present, the failure string.

**The thread column** takes the remaining width with `min-w-0` so a long word cannot push it
open. It is a 44px room header, a scrolling row list, and the composer on a hairline at the
bottom. The row list is a two-column grid: a 56px gutter (72px from `md`) and the message body.
The gutter is also painted as one continuous absolutely-positioned field behind the rows at
`sunk` 60% with its own right hairline, so it reads as a single structural column rather than as
per-row cells. Horizontal padding steps 16px to 20px at `md`; vertical padding on a row is 8px.

**Rhythm.** Spacing is the 4px grid: 2px (the unread bar), 4px, 6px, 8px, 12px, 16px, 20px.
Control height is 36px; the compact header button is 32px; section headers are 44px; the app
header is 48px. Auth surfaces use one 384px column, centred, with 32px between the heading block
and the form and 16px between fields.

**Responsive.** Two breakpoints are in use. At `sm` (640px) the signed-in name and the text
labels on icon-plus-text buttons appear. At `md` (768px) the rail becomes a permanent side
column; below it the rail and the thread are mutually exclusive full-width views toggled from the
header, so a small screen shows one whole region at a time rather than a drawer over the thread.

### Named Rules

**The Nothing-Floats Rule.** No overlay, no drawer, no popover, no modal. Every region resolves
to the viewport through the flex chain. The only absolutely positioned elements are the gutter
field behind the rows and the unread bar inside a row — both structural, both behind or within
content.

**The Hairline-Meeting Rule.** Two regions meet on exactly one 1px `rule` border. Never two
borders, never a border plus a gap, never a border plus a change of fill.

## Elevation & Depth

This system is flat by construction. There is no `box-shadow`, no gradient, no blur and no
backdrop-filter anywhere in the build. Depth is expressed by exactly two devices: the 1px
hairline (`rule`, stepping to `rule-strong` when a stroke must assert itself) and a single tonal
step (`sunk`) used for the gutter field and for hover surfaces. Inputs sit *above* the ground by
being lighter (`surface` white on `paper`); the gutter sits *below* it by being darker. That
two-step tonal range is the whole depth model.

### Named Rules

**The Hairline-Only Rule.** Separation is a rule or it is space. A surface never earns separation
from a shadow, a gradient, a glow or a blurred backdrop.

**The Two-Step Tonal Rule.** The ground has exactly one step up (`surface`) and one step down
(`sunk`). A third tonal surface is a sign the layout, not the palette, needs the work.

## Shapes

One radius: 3px, on every box in the system — buttons, inputs, the select, the composer, rail
items, presence chips, alerts. It is small enough to read as a cut corner on a printed rule
rather than as a rounded card. The focus ring uses a 2px radius so it hugs a 3px box without
bulging at the corners.

Full rounding appears only where the shape genuinely is a dot or a track: the 6px connection dot
and the scrollbar thumb. The square is the default silhouette — the presence chip is a 20px
square with a 3px radius, not a circle, precisely so it does not read as an avatar.

Borders are 1px throughout. The single exception is the unread mark: a 2px solid accent bar down
the left edge of a row's gutter cell.

### Named Rules

**The 3px Rule.** Every box is 3px. Not 4, not 6, not per-component.

**The Circle-Means-Dot Rule.** A fully rounded shape in this system is a status dot or a
scrollbar thumb. It is never an avatar, a badge, a pill button or a chip.

## Components

### Buttons

- **Shape:** 3px corners, 36px tall, 14px horizontal padding, 8px icon-to-label gap, label at 500
  weight. Colour transitions run 150ms.
- **Primary:** accent fill, accent-counter text, deepening to `accent-hover`. The room's send
  action and both auth submits. Disabled drops to 45% opacity and keeps the accent fill rather
  than greying out.
- **Quiet:** transparent with a `rule` stroke and muted ink, filling to `sunk` and darkening to
  full ink on hover. The sign-out button, rendered at the compact 32px height in the app header.
- **Danger:** transparent with a neutral `rule` stroke and removal-red text; only on hover does
  the stroke turn red and a 5% red wash appear. Destructive intent is shown on approach, not at
  rest, and the variant is never placed adjacent to another button.
- **Focus:** the global 2px accent outline at 2px offset, inherited from `:focus-visible`.

### Inputs / Fields

- **Style:** white `surface` fill, 1px `rule` stroke, 3px corners, 36px tall, 10px horizontal
  padding, body type. Placeholders are `ink-faint`.
- **Label:** uppercase 11px at 0.08em in muted ink, 6px above the field. Always present; there are
  no placeholder-only fields.
- **Hint:** 12px faint ink below the field.
- **Hover / Focus:** hover raises the stroke to `rule-strong`; focus turns the stroke accent *and*
  draws the accent outline at 1px offset. The stroke change and the ring are two separate signals
  and both are kept.
- **Select:** the salutation control matches the input exactly — same height, stroke, radius and
  hover — so a native select does not break the row it shares.

### Alert

A 3px box with a 35%-opacity removal-red stroke over a 6% red wash, a 16px stroked warning
triangle at the top left, and the message itself in full-contrast `ink` rather than in red. Red
frames the problem; the sentence stays readable. It carries `role="alert"` and sits at the top of
the form it belongs to.

### Composer

A resizable textarea on a hairline band at the foot of the thread column: white fill, 3px
corners, 36px minimum, 160px maximum, growing downward. Enter sends and Shift+Enter keeps the
newline, so a message can hold a block of code. When the socket is not live the field disables to
60% opacity and its placeholder changes from the writing prompt to the reconnect prompt — the
disabled state explains itself. The primary send button sits at its right, aligned to the bottom
edge.

### Navigation (rail)

Workspace entries are full-width left-aligned buttons with 3px corners, 8px/6px padding and a
`sunk` hover fill, laid out as a baseline-aligned pair: the workspace name truncating on the
left, its role as an uppercase mono tag in faint ink on the right. The list carries four honest
states — loading, populated, an unbuilt-endpoint explanation in muted ink, and a failure line in
removal red. Section headings use the 11px uppercase label. A disabled action sits in the section
header at faint ink with an `aria-label` that says why it is disabled.

### Message row

The signature component. Each row is a two-column grid on a bottom hairline: a right-aligned
gutter cell carrying the clock time in tabular mono at faint ink, and a body cell carrying an
author line and the message paragraph. Consecutive rows from one author within five minutes group
into a hunk — the repeat rows drop both the timestamp and the author line, leaving the paragraph
alone against the gutter. The reader's own rows are marked by an accent `you` tag in mono, never
by a different alignment or fill; every row starts at the same left edge. Unread rows carry a 2px
accent bar at the far left of the gutter. Rows animate in once with `row-in`.

### Presence chips

20px squares, 3px corners, `sunk` fill, `rule` stroke, two-letter initials in 10px mono, with the
full name as the title attribute. They sit in the room header and are built only from people who
have actually spoken in the session.

### Icons

A single authored SVG set on a 16px grid: 1.5px stroke, round caps and joins, `fill: none`,
`currentColor`, `aria-hidden`. Six icons cover the build — thread, plus, send, sign-out, alert,
empty. No icon library, no icon font, and no emoji or text glyph ever stands in for an icon. Icons
render at 16px inline and inherit the text colour beside them.

### Empty state

Centred in the thread area: the empty-thread icon at 32px in `rule-strong`, a full-contrast line
naming the state, and a muted line telling the reader what to do about it. No illustration, no
button, no card.

### Browser surfaces

Selection, caret, native `accent-color`, placeholders and the scrollbar are themed from the same
tokens. The scrollbar is 10px with a transparent track and a `rule-strong` thumb inset 3px by a
`paper` border, darkening to `ink-faint` on hover.

### Motion

One authored keyframe: `row-in`, 320ms on `cubic-bezier(0.16, 1, 0.3, 1)`, from 0 opacity and 6px
below to rest. Everything else is a 150ms colour transition. The thread auto-scrolls only when the
reader is already within 48px of the end, so reading an older row is never hijacked by a teammate
typing. Under `prefers-reduced-motion: reduce` the row animation is removed outright and every
transition is clamped to 1ms.

**The One Motion Rule.** The system has exactly one authored animation and it animates a row
arriving. Motion is spent on the thing the product is about; nothing else moves.

## Do's and Don'ts

### Do:

- **Do** separate regions with a single 1px `rule` hairline, or with space.
- **Do** keep every box at 3px, and the focus ring at a 2px radius with a 2px accent outline at
  2px offset.
- **Do** set times, counts, roles, ids and error strings in JetBrains Mono, with `.tnum` when they
  stack in a column.
- **Do** reserve white (`surface`) for surfaces a person types into.
- **Do** cap message measure at 68ch and let the column be wider than the line.
- **Do** author both themes when adding a colour: a token without a dark value is an unfinished
  token.
- **Do** show absent capability honestly, in muted ink, as a sentence that names what is missing
  and what happens meanwhile.
- **Do** draw new icons on the 16px grid at 1.5px stroke with round caps, `currentColor` and
  `aria-hidden`.
- **Do** state a disabled control's reason in its `aria-label` or its placeholder.

### Don't:

- **Don't** add a shadow, gradient, blur or backdrop-filter — the build has none, and depth comes
  from the hairline plus one tonal step.
- **Don't** spend ink indigo on anything other than interactive primary, focus or unread.
- **Don't** spend green, red or amber on anything other than real machine state.
- **Don't** introduce a third tonal surface beyond `surface` above the ground and `sunk` below it.
- **Don't** render a message as a bubble, tint it by author, or align one author's rows to the
  opposite side — identity lives in the author line, the `you` tag and the gutter.
- **Don't** add a circular avatar; the presence mark is a 3px-cornered square of initials built
  from real participation.
- **Don't** use a text glyph, emoji or icon-font character where an icon belongs.
- **Don't** uppercase anything above 11px, or anything inside a sentence.
- **Don't** float anything — no modal, drawer, popover or floating panel; regions resolve through
  the flex chain to the viewport.
- **Don't** add a second animation; `row-in` is the system's one authored motion.
