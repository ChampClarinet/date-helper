import moment from "moment";

import { ONE_DAY_IN_MILLISECONDS, en as constantsEN, th as constantsTH } from "./constants";
import { DateHelperConfig, DateTuple, MonthYear, SupportedLanguages, Time } from "./types";
import { padZero } from "./utils";

export * from "./constants";
export * from "./types";

/**
 * A lightweight utility for common date/time operations with i18n (EN/TH)
 * and Buddhist Era (BE) support. Designed to be framework-agnostic and
 * easy to integrate in UI code.
 *
 * - Uses the runtime's local timezone by default.
 * - Language strings are provided via `constants` (EN/TH).
 * - Supports short month names, 12/24h time, and optional seconds display.
 */
export default class DateHelper {
  /** Current Gregorian year from system clock. */
  static CURRENT_YEAR = () => new Date().getFullYear();
  /** One day in milliseconds. */
  static ONE_DAY_IN_MS = ONE_DAY_IN_MILLISECONDS;
  /** Current month (1-12) from system clock. */
  static CURRENT_MONTH = new Date().getMonth() + 1;
  /** Fixed offset for Thailand timezone (+07:00) in milliseconds. */
  static THAI_TIMEZONE_OFFSET = 7 * 60 * 60 * 1000;

  /** Internal JS Date backing this instance (local time). */
  private date: Date;

  /** Default language for display strings. */
  protected defaultLang: SupportedLanguages = "en";

  /** Use abbreviated month names (e.g., "Jan"). */
  protected useShortText = false;

  /** Display year as Buddhist Era (AD + 543). */
  protected useBD = false;

  /** Display time in 12-hour format with AM/PM. */
  protected use12HourFormat = false;

  /** Include seconds in `getDisplayTime()`. */
  protected showSeconds = false;

  /**
   * Creates a new instance representing the current moment (`Date.now()`).
   * @param {DateHelperConfig} [config] Optional configuration (lang, BE, 12/24h, etc).
   * @returns {DateHelper}
   */
  static now = (config?: DateHelperConfig): DateHelper => {
    return new DateHelper(undefined, config);
  };

  /**
   * Returns the difference in whole minutes: `d1 - d2`.
   * @param {DateHelper} d1 First datetime.
   * @param {DateHelper} d2 Second datetime.
   * @returns {number} Rounded minutes delta (positive if `d1` after `d2`).
   */
  static deltaMinutes = (d1: DateHelper, d2: DateHelper) => {
    const dd1 = +d1.date;
    const dd2 = +d2.date;
    const deltaMs = dd1 - dd2;
    const deltaMin = Math.round(deltaMs / 6e4);
    return deltaMin;
  };

  /**
   * Builds instance from tuple (Y,M,D) and optional time (H,m).
   * @param {DateTuple} tuple [year, month(1-12), day(1-31)].
   * @param {Time} [time] Optional time of day.
   * @returns {DateHelper}
   */
  static fromDateTupleAndTime = (tuple: DateTuple, time?: Time): DateHelper => {
    const [y, m, d] = tuple;
    const date = new Date(y, m - 1, d, time?.hour ?? 0, time?.minute ?? 0);
    return new DateHelper(+date);
  };

  /**
   * Checks whether `instance` falls on the specific ISO date (YYYY-MM-DD).
   * @param {string} date ISO date string (YYYY-MM-DD).
   * @param {DateHelper} instance Instance to check.
   * @returns {boolean}
   * @throws {Error} If input format is invalid.
   */
  static isInGivenDate = (date: string, instance: DateHelper): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid date format: "${date}", must be in this format: YYYY-MM-DD`);
    }
    const [year, month, day] = date.split("-");
    const [y, m, d] = instance.toDateTuple();
    return y == +year && m == +month && d == +day;
  };

  /**
   * Parses time string "HH:mm" into a {@link Time} object.
   * @param {string} timeString "HH:mm" (24-hour).
   * @returns {Time}
   * @throws {Error} If format/values invalid.
   */
  static timeStringToTime = (timeString: string): Time => {
    const fnName = "timeStringToTime";
    try {
      const [h, m] = timeString.split(":");
      if (isNaN(+h) || isNaN(+m)) {
        throw new FormatError(`either hour or time in timeString is NaN [${timeString}]`, fnName);
      }
      const hh = +h,
        mm = +m;
      if (hh < 0 || hh > 23) {
        throw new FormatError(`Invalid hour [${hh}]`, fnName);
      }
      if (mm < 0 || mm > 59) {
        throw new FormatError(`Invalid minute [${mm}]`, fnName);
      }
      return { hour: hh, minute: mm };
    } catch (error) {
      throw new FormatError(`Invalid time format: ${timeString}`, fnName);
    }
  };

  /**
   * Formats {@link Time} to "HH:mm" (24-hour).
   * @param {Time} time Target time.
   * @returns {string}
   */
  static timeToTimeString = (time: Time): string =>
    [padZero(time.hour ?? 0), padZero(time.minute ?? 0)].join(":");

  /**
   * True if both instances are on the same calendar day (local time).
   * @param {DateHelper} d1
   * @param {DateHelper} d2
   * @returns {boolean}
   */
  static isSameDay = (d1: DateHelper, d2: DateHelper): boolean => {
    const d1Tuple = d1.toDateTuple();
    const d2Tuple = d2.toDateTuple();

    return (
      d1Tuple[0] === d2Tuple[0] && // Year
      d1Tuple[1] === d2Tuple[1] && // Month
      d1Tuple[2] === d2Tuple[2] // Day
    );
  };

  /**
   * True if both instances have identical H:m:s (ignores date).
   * @param {DateHelper} d1
   * @param {DateHelper} d2
   * @returns {boolean}
   */
  static isSameTime = (d1: DateHelper, d2: DateHelper): boolean => {
    return (
      d1.date.getHours() === d2.date.getHours() &&
      d1.date.getMinutes() === d2.date.getMinutes() &&
      d1.date.getSeconds() === d2.date.getSeconds()
    );
  };

  /**
   * True if two "HH:mm" strings equal.
   * @param {string} t1
   * @param {string} t2
   * @returns {boolean}
   * @throws {Error} If either input invalid.
   */
  static isSameTimeString = (t1: string, t2: string): boolean => {
    const [h1, m1] = t1.split(":");
    const [h2, m2] = t2.split(":");
    if (h1 == null || h2 == null || m1 == null || m2 == null) {
      throw new Error(`Either of these arguments are in invalid format: "${t1}", "${t2}"`);
    }
    return h1 == h2 && m1 == m2;
  };

  /**
   * Shallow equality for two DateTuple values (Y,M,D).
   * @param {DateTuple} d1
   * @param {DateTuple} d2
   * @returns {boolean}
   */
  static isSameDateTuple = (d1: DateTuple, d2: DateTuple): boolean => {
    return d1.every((x, i) => x === d2[i]);
  };

  /**
   * Returns milliseconds for `days` (like Python's `timedelta` days).
   * @param {number} [days=1] Number of days.
   * @returns {number} days * 24h in ms.
   */
  static timeDelta = (days: number = 1): number => {
    return days * this.ONE_DAY_IN_MS;
  };

  /**
   * Converts (Y,M,D) and time to a JS `Date` (local time).
   * @param {DateTuple} tuple
   * @param {Time} time
   * @returns {Date}
   */
  static datetimeToDate = (tuple: DateTuple, time: Time): Date => {
    const [year, month, date] = tuple;
    const { hour = 0, minute = 0 } = time;

    return new Date(year, month - 1, date, hour!, minute!);
  };

  /**
   * Determines whether a specified time on a given date has already passed relative to the current moment.
   *
   * This function combines the provided {@link Time} (hour and minute) with the calendar date
   * represented by the given {@link DateHelper} instance, forming a precise datetime point.
   * It then compares that moment to the current system time.
   *
   * @example
   * ```ts
   * // Suppose the current datetime is 2025-10-17T14:00
   * const date = new DateHelper("2025-10-17");
   *
   * DateHelper.isTimePastForDate({ hour: 10, minute: 30 }, date); // true  (10:30 has passed)
   * DateHelper.isTimePastForDate({ hour: 18, minute: 0 }, date);  // false (18:00 not yet)
   *
   * // Works with past/future days as well
   * const yesterday = new DateHelper("2025-10-16");
   * DateHelper.isTimePastForDate({ hour: 23, minute: 0 }, yesterday); // true
   *
   * const tomorrow = new DateHelper("2025-10-18");
   * DateHelper.isTimePastForDate({ hour: 1, minute: 0 }, tomorrow);   // false
   * ```
   *
   * @param {Time} time - The target time of day to check (e.g., `{ hour: 9, minute: 30 }`).
   * @param {DateHelper} [date=DateHelper.now()] - The date context for the time. Defaults to today's date if omitted.
   * @returns {boolean} - `true` if the specified time on that date has already passed relative to now; otherwise `false`.
   *
   * @remarks
   * - Uses the local timezone of the runtime environment.
   * - Comparison precision is to the minute (seconds are ignored).
   * - This method is safe for both past and future dates.
   */
  static isTimePastForDate = (time: Time, date: DateHelper = DateHelper.now()): boolean => {
    const cmp = new DateHelper(date.toMs());
    cmp.getDate().setHours(time.hour ?? 0, time.minute ?? 0, 0, 0);
    return Date.now() > cmp.toMs();
  };

  /**
   * Builds instance from an ISO-like date string with an additional fixed offset (defaults TH +07:00).
   * @param {string} date ISO-like string (parsable by `Date.parse`).
   * @param {number} [offset=this.THAI_TIMEZONE_OFFSET] Offset in milliseconds.
   * @returns {DateHelper}
   */
  static getInstanceWithOffset = (date: string, offset = this.THAI_TIMEZONE_OFFSET) => {
    const ms = Date.parse(date);
    return new DateHelper(ms + offset);
  };

  /**
   * Builds instance from a {@link DateTuple}.
   * @param {DateTuple | null} tuple Nullable tuple.
   * @returns {DateHelper | null} Null if tuple is null.
   */
  static fromDateTuple = (tuple: DateTuple | null): DateHelper | null => {
    if (tuple == null) return null;
    return new DateHelper(tuple.join("-"));
  };

  /**
   * Returns the previous (month, year) for a given human month 1-12.
   * @param {number} month Current month (1-12).
   * @param {number} year Current year.
   * @returns {MonthYear}
   */
  static findPreviousMonthYear = (month: number, year: number): MonthYear => {
    let previousMonth = month - 1;
    let previousYear = year;

    if (previousMonth < 1) {
      previousMonth = 12;
      previousYear -= 1;
    }

    return { month: previousMonth, year: previousYear };
  };

  /**
   * Returns the next (month, year) for a given human month 1-12.
   * @param {number} month Current month (1-12).
   * @param {number} year Current year.
   * @returns {MonthYear}
   */
  static findNextMonthYear = (month: number, year: number): MonthYear => {
    let nextMonth = month + 1;
    let nextYear = year;

    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }

    return { month: nextMonth, year: nextYear };
  };

  /**
   * Returns the localized constant set for the current language configuration.
   *
   * Useful when you want to directly access month names, weekdays, or time-ago
   * strings without relying on the display methods like {@link getDisplayDate}.
   *
   * @example
   * ```ts
   * const helper = new DateHelper("2025-10-17", { lang: "th" });
   * const constants = helper.getLanguageConstants();
   * console.log(constants.MONTHS[0]); // "มกราคม"
   * console.log(constants.timeAgo.day(3)); // "3 วันที่แล้ว"
   * ```
   *
   * @returns {typeof import("./constants").en} A language constant object containing:
   * - `MONTHS`: Full month names
   * - `MONTHS_ABBR`: Abbreviated month names
   * - `WEEKDAYS`: Weekday names
   * - `timeAgo`: Formatting helpers for relative time strings
   *
   * @remarks
   * - The returned constants are read-only; modify them only if you fully control your environment.
   * - Language options currently supported: `"en"` and `"th"`.
   */
  getLanguageConstants = () => {
    switch (this.defaultLang) {
      case "en":
        return constantsEN;
      case "th":
        return constantsTH;
      default:
        return constantsEN;
    }
  };

  /**
   * Creates a new DateHelper.
   *
   * - If `dateStringOrNumberInMs` is a number, treated as Unix ms.
   * - If it's a string, parsed by `Date.parse` (ISO-like recommended).
   * - If omitted, uses current moment.
   * - If `config.isUTC` is true, adjusts result to UTC (removes local offset).
   *
   * @param {string | number} [dateStringOrNumberInMs] Source date/time or timestamp.
   * @param {Partial<DateHelperConfig>} [config={}] Display/config options.
   * @throws {Error} If date string cannot be parsed.
   */
  constructor(dateStringOrNumberInMs?: string | number, config: Partial<DateHelperConfig> = {}) {
    if (dateStringOrNumberInMs != null) {
      const ts = +dateStringOrNumberInMs;
      if (isNaN(ts)) {
        const parsedDate = Date.parse(dateStringOrNumberInMs as string);
        if (isNaN(parsedDate)) throw new Error("Invalid date string or number provided.");
        this.date = new Date(parsedDate);
      } else this.date = new Date(ts);
    } else this.date = new Date();

    if (config.isUTC) {
      const browserOffset = new Date().getTimezoneOffset();
      const offsetInMs = browserOffset * 60 * 1000;
      this.date = new Date(this.date.getTime() - offsetInMs);
    }

    if (config.lang) this.defaultLang = config.lang;
    if (config.useShortText != null) this.useShortText = config.useShortText;
    if (config.useBD != null) this.useBD = config.useBD;
    if (config.use12HourFormat != null) {
      this.use12HourFormat = config.use12HourFormat;
    }
    if (config.showSeconds != null) this.showSeconds = config.showSeconds;
    if (this.defaultLang === "th") moment.locale("th");
  }

  /**
   * True if both objects are in the same month and year (local time).
   * @param {DateHelper} dateToCompare
   * @returns {boolean}
   */
  isSameMonth = (dateToCompare: DateHelper): boolean => {
    return (
      this.date.getFullYear() === dateToCompare.date.getFullYear() &&
      this.date.getMonth() === dateToCompare.date.getMonth()
    );
  };

  /**
   * True if both objects are on the same calendar day (local time).
   * @param {DateHelper} dateToCompare
   * @returns {boolean}
   */
  isSameDay = (dateToCompare: DateHelper): boolean =>
    this.isSameMonth(dateToCompare) && this.date.getDate() === dateToCompare.date.getDate();

  /**
   * True if this object represents today's date (local time).
   * @returns {boolean}
   */
  isToday = (): boolean => {
    const today = new DateHelper();
    return this.isSameDay(today);
  };

  /**
   * True if this datetime is earlier than `pastForm` (default: now).
   * @param {DateHelper} [pastForm] Comparing reference (defaults to current moment).
   * @returns {boolean}
   */
  isPast = (pastForm: DateHelper = new DateHelper()): boolean => {
    return pastForm.toMs() - this.toMs() > 0;
  };

  /**
   * True if this date is strictly before today (ignores time).
   * @returns {boolean}
   */
  isPastDay = (): boolean => !this.isToday() && this.isPast();

  /**
   * Checks if this DateHelper instance represents yesterday.
   * @returns {boolean} - True if this DateHelper instance represents yesterday, otherwise false.
   */
  isYesterday = (): boolean => {
    const today = new DateHelper();
    const yesterday = new DateHelper(today.toMs() - DateHelper.timeDelta());
    return this.isSameDay(yesterday);
  };

  /**
   * True if this date is before the given date (strict; ignores equality).
   * @param {DateHelper} dateToCompare
   * @returns {boolean}
   */
  isDayBefore = (dateToCompare: DateHelper): boolean => {
    if (this.isSameDay(dateToCompare)) return false;
    return this.toMs() < dateToCompare.toMs();
  };

  /**
   * True if this date is after the given date (strict; ignores equality).
   * @param {DateHelper} dateToCompare
   * @returns {boolean}
   */
  isDayAfter = (dateToCompare: DateHelper): boolean => {
    if (this.isSameDay(dateToCompare)) return false;
    return this.toMs() > dateToCompare.toMs();
  };

  /**
   * Returns "YYYY-M-D" created from {@link toDateTuple}.
   * @returns {string}
   */
  joinDateTuple = (): string => {
    return this.toDateTuple().join("-");
  };

  /**
   * Returns a new instance representing "yesterday" from this instance.
   * @returns {DateHelper}
   */
  getYesterday = (): DateHelper => {
    return new DateHelper(this.toMs() - DateHelper.timeDelta());
  };

  /**
   * Number of days in the month of this instance (local time).
   * @returns {number}
   */
  getDaysCountInMonth = (): number => {
    const [year, month] = this.toDateTuple();
    const monthWith30Days = [4, 6, 9, 11];

    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

    if (month === 2) return isLeapYear ? 29 : 28;
    return monthWith30Days.includes(month) ? 30 : 31;
  };

  /**
   * Weekday index (0=Sun..6=Sat) for the 1st of the month of this instance.
   * @returns {number}
   */
  getFirstWeekdayInMonth = (): number => {
    const [year, month] = this.toDateTuple();
    const firstDay = new Date(year, month - 1, 1);
    return firstDay.getDay();
  };

  /**
   * Human-friendly relative time string using language constants.
   * - < 1 min → "just now"
   * - < 60 min → "X minutes ago"
   * - < 1 day → "X hours ago"
   * - < 30 days → "X days ago"
   * - else → `getDisplayDate()`
   * @returns {string}
   */
  getTimeRelativeToNow = (): string => {
    const now = new DateHelper(); // Current time
    const deltaMinutes = DateHelper.deltaMinutes(now, this);

    const { timeAgo } = this.getLanguageConstants();

    if (deltaMinutes < 1) {
      return timeAgo.justNow;
    } else if (deltaMinutes < 60) {
      return timeAgo.minute(deltaMinutes);
    } else if (deltaMinutes < 1440) {
      const hours = Math.floor(deltaMinutes / 60);
      return timeAgo.hour(hours);
    } else if (deltaMinutes < 43200) {
      const days = Math.floor(deltaMinutes / 1440);
      return timeAgo.day(days);
    } else {
      return this.getDisplayDate();
    }
  };

  /**
   * Buddhist Era year = Gregorian year + 543.
   * @returns {number}
   */
  getBDYear = (): number => {
    const year = this.date.getFullYear();
    return year + 543;
  };

  /**
   * Gregorian year (AD).
   * @returns {number}
   */
  getADYear = (): number => {
    const year = this.date.getFullYear();
    return year;
  };

  /**
   * Returns "DD Month YYYY" using configured language/short text/BE.
   * @example "01 March 2024" or "01 มีนาคม 2567"
   * @returns {string}
   */
  getDisplayDate = (): string => {
    const date = this.date.getDate();
    const year = this.useBD ? this.getBDYear() : this.getADYear();

    const monthString = this.getMonthName();
    const yearString = this.useShortText ? year % 100 : year;

    return `${padZero(date)} ${monthString} ${yearString}`;
  };

  /**
   * Returns formatted time string according to config:
   * - 24h: "HH:mm" (with optional seconds "HH:mm:ss")
   * - 12h: "hh:mm AM/PM" (optional seconds)
   * @returns {string}
   */
  getDisplayTime = (): string => {
    let hours: number | string = this.date.getHours();
    let minutes: number | string = this.date.getMinutes();
    let seconds: number | string = this.date.getSeconds();

    let period = "";

    if (!this.use12HourFormat) {
      hours = padZero(hours);
    } else {
      period = hours >= 12 ? "PM" : "AM";
      hours = padZero(hours % 12 || 12);
    }

    minutes = padZero(minutes);

    let formattedTime = `${hours}:${minutes}`;

    if (this.showSeconds) {
      seconds = padZero(seconds);
      formattedTime += `:${seconds}`;
    }

    if (this.use12HourFormat) {
      formattedTime += ` ${period}`;
    }

    return formattedTime;
  };

  /**
   * Concatenates `getDisplayDate()` + `getDisplayTime()` with a space.
   * @returns {string}
   */
  getDisplayDateAndTime = (): string => {
    return [this.getDisplayDate(), this.getDisplayTime()].join(" ");
  };

  /**
   * Localized month name for the instance's month.
   * Respects `useShortText` (abbr vs full name).
   * @returns {string}
   */
  getMonthName = (): string => {
    const month = this.date.getMonth();
    const { MONTHS, MONTHS_ABBR } = this.getLanguageConstants();
    if (this.useShortText) return MONTHS_ABBR[month];
    return MONTHS[month];
  };

  /**
   * Returns the underlying `Date` object (mutable).
   * @returns {Date}
   */
  getDate = (): Date => this.date;

  /**
   * Returns `[year, month(1-12), day(1-31)]` in local time.
   * @returns {DateTuple}
   */
  toDateTuple = (): DateTuple => [
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    this.date.getDate(),
  ];

  /**
   * Returns `{ hour, minute }` in local time (seconds ignored).
   * @returns {Time}
   */
  toTimeObject = (): Time => ({
    hour: this.date.getHours(),
    minute: this.date.getMinutes(),
  });

  /**
   * Milliseconds since Unix epoch (UTC).
   * @returns {number}
   */
  toMs = (): number => this.date.getTime();

  /**
   * ISO-like local date `"YYYY-MM-DD"`.
   * Note: this uses local date parts (not UTC `.toISOString()`), avoiding day shifts.
   * @returns {string}
   */
  toISODate = (): string => {
    const y = this.date.getFullYear();
    const m = this.date.getMonth() + 1;
    const d = this.date.getDate();
    return [y, padZero(m), padZero(d)].join("-");
  };

  /**
   * Full ISO 8601 timestamp (UTC-based) via `Date.toISOString()`.
   * @returns {string}
   */
  toISO8601String = (): string => {
    return this.date.toISOString();
  };

  /**
   * Wraps the instance date as a Moment.js object (locale not auto-set here).
   * @returns {moment.Moment}
   */
  toMoment = (): moment.Moment => {
    return moment(this.date);
  };
}
