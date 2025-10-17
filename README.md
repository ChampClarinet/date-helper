# @cantabile/date-helper

[![npm version](https://badge.fury.io/js/%40cantabile%2Fdate-helper.svg)](https://badge.fury.io/js/%40cantabile%2Fdate-helper)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**DateHelper** is a lightweight TypeScript library that simplifies date and time handling, including:

- Buddhist calendar (B.E.) conversion
- English/Thai localization
- Human-readable display utilities
- Time delta, tuple-based date composition, and more

---

## 📦 Installation

Install using your preferred package manager:

```bash
# with npm
npm install @cantabile/date-helper

# with bun
bun add @cantabile/date-helper
```

---

## 🧩 Basic Usage

```ts
import DateHelper from "@cantabile/date-helper";

// Create a new instance
const dh = new DateHelper("2024-03-01T00:00:00");

// Display date in AD
console.log(dh.getDisplayDate()); // "01 March 2024"

// Display in Buddhist Era (B.E.) with Thai language
const thai = new DateHelper("2024-03-01", { lang: "th", useBD: true });
console.log(thai.getDisplayDate()); // "01 มีนาคม 2567"
```

---

## ⚙️ Configuration

| Option            | Type           | Default | Description                                   |
| ----------------- | -------------- | ------- | --------------------------------------------- |
| `lang`            | `"en" \| "th"` | `"en"`  | Language for month and weekday names          |
| `useShortText`    | `boolean`      | `false` | Use abbreviated month names (`Jan`, `Feb`, …) |
| `useBD`           | `boolean`      | `false` | Use Buddhist Era (B.E.) instead of Gregorian  |
| `use12HourFormat` | `boolean`      | `false` | Display time in `12-hour` (AM/PM) format      |
| `showSeconds`     | `boolean`      | `false` | Display seconds in time output                |
| `isUTC`           | `boolean`      | `false` | Treat input date as UTC time                  |

---

## 🔧 API Highlights

### Static methods

- DateHelper.now(config?) → Create instance for current date/time

- DateHelper.fromDateTupleAndTime(tuple, time?)

- DateHelper.isSameDay(d1, d2)

- DateHelper.timeStringToTime("13:45")

- DateHelper.deltaMinutes(d1, d2)

- DateHelper.getInstanceWithOffset(date, offset)

- DateHelper.findPreviousMonthYear(month, year)

- DateHelper.findNextMonthYear(month, year)

- DateHelper.getLanguageConstants() → access MONTHS, WEEKDAYS, timeAgo etc.

### Instance Methods

- getDisplayDate() → "01 March 2024"

- getDisplayTime() → "14:30"

- getDisplayDateAndTime() → "01 March 2024 14:30"

- getTimeRelativeToNow() → "3 minutes ago"

- toISODate() → "2024-03-01"

- toMoment() → returns a Moment.js instance

---

## 🧪 Testing

This package uses Bun for testing:

```bash
bun test
```

Example test:

```ts
import DateHelper from "@cantabile/date-helper";
import { describe, expect, it } from "bun:test";

describe("DateHelper", () => {
  it("should display correctly in B.E. (Thai)", () => {
    const dh = new DateHelper("2024-03-01", { lang: "th", useBD: true });
    expect(dh.getDisplayDate()).toBe("01 มีนาคม 2567");
  });
});
```

---

## 🪄 Build

```bash
bun run build
```

Outputs:

```
dist/
 ├─ index.mjs     (ESM)
 ├─ index.cjs     (CommonJS)
 ├─ index.d.ts    (TypeScript types)
 └─ *.map         (Source maps)
```

---

## 📜 License

Licensed under the ISC © [Wallop Opasakhun (ChampClarinet)](https://github.com/champclarinet)

---

## 💖 Support

If this library helps your work, you can support the maintainer here:

[![Buy Me a Coffee](https://img.shields.io/badge/☕️-Buy%20Me%20a%20Coffee-orange)](https://buymeacoffee.com/champclarinet)

Every cup fuels more open-source love and cleaner TypeScript for everyone! 💫
