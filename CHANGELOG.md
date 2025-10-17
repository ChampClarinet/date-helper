# Changelog

## 1.4.1 - 2025-10-17

### 🛠 Fixed

- Fixed module resolution issue in consuming projects (Next.js, Node.js, and React apps) caused by incomplete `exports` map.
- Removed dual build output (`.mjs` / `.cjs`) and unified build into a **single ESM format** for stability.
- Ensured all entry points (`import`, `require`, and `default`) resolve to `dist/index.js`.
- Verified compatibility with Bun ≥ 1.3.0 and Node ≥ 18.

### Changed

- Simplified build pipeline using Bun.
- Removed redundant `cjs`/`esm` outputs and unnecessary mappings in `package.json`.
- Updated `exports` to include `./package.json` for compatibility with tooling that checks package metadata.

### Notes

> This patch focuses on restoring module compatibility.  
> A proper dual-format rebuild (CJS + ESM)

## 1.4.0 — 2025-10-17

### ✨ Features

- Made `getLanguageConstants()` public so users can access localized constants directly.
- Added complete English JSDoc documentation across all modules (`DateHelper`, `types.ts`, `constants.ts`).
- Improved internal validation for date and time parsing.

### 🛠 Fixes

- Fixed **leap-year calculation** (handles century and 400-year rules properly).
- Improved `timeStringToTime()` validation for invalid hour/minute values.
- Fixed `isTimePastForDate()` logic to correctly interpret target time within the same day.
- Cleaned up default behavior for UTC and timezone offset handling.

### 🧱 Build / Test

- Migrated from Jest to **Bun test runner**.
- Build pipeline migrated to **Bun** (`bun build`).
- Produced both ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) outputs.
- Added TypeScript declaration output (`dist/index.d.ts`).
- Added `exports` map in `package.json` for modern bundlers.

### 📚 Documentation

- English JSDoc rewritten with detailed parameter, return, and example sections.
- Added explanation for constants and localization system (`en`, `th`).
- Clarified behavior of UTC handling and Buddhist calendar conversions.

### 🔁 Chores

- Removed `packageManager` field (`bun@...`) to prevent Corepack errors.
- Cleaned up and standardized `scripts` (`build`, `test`, `prepublishOnly`).

---

## Upgrade Notes

- Update using:

  ```bash
  bun add @cantabile/date-helper@^1.4.0
  # or
  npm install @cantabile/date-helper@^1.4.0
  ```

- If your code compares ISO strings, test again—`toISODate()` still uses local date context.
