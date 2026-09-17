# Rudy Command Deck V4 Design

## Goal
Turn the current Mobile V3 dashboard into a command-deck interface for Commander Rudy where operational elements are understandable by tap and every important visible status can be inspected before acting.

## Core interaction
The canonical flow is: VEDO → TOCCO → CAPISCO → DECIDO → ORDINO → VEDO L'ESITO.

## Click-to-explain rule
Every operational card and status surface opens a commander-level explanation first. The detail panel must always provide: COS'È, STATO ADESSO, PERCHÉ, COSA C'È DENTRO, COSA PUOI FARE. Technical detail is secondary.

## Scope of this increment
This increment delivers the universal click-to-explain layer on top of the existing authenticated Mobile V3. It keeps the existing read-only data backend and existing lane drill-downs. GPT/voice execution and the full command bus remain subsequent V4 increments; the UI may prepare contextual command text but must not pretend an order was executed.

## UX
- Mobile-first command-deck visual language.
- Cards remain grouped by flow, anomalies, forms, weapons/P3, and results.
- Clicking a metric opens a detail drawer with plain-language explanation and current value.
- Where a lane endpoint exists, the detail drawer also loads the live items inside it.
- A ship-status surface is clickable and explains EMAIL/FORM/RUNTIME status.
- Context actions can prepare a question or order draft, but execution is not falsely represented.

## Safety
No changes to Starship business rules, queues, fire controls, P1/P2/P11/P22, Arsenale, Magazzino, or worker behavior. Frontend and read-only Mobile V3 presentation only.
