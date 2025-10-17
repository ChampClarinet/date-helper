/**
 * Represents a date tuple consisting of year, month, and day.
 * - Month is human-readable (1–12)
 * - Day is human-readable (1–31)
 *
 * @example
 * const tuple: DateTuple = [2025, 10, 17];
 */
export type DateTuple = [number, number, number];

/**
 * Represents a time object with hour and minute components.
 * - Both fields are optional; if omitted, they default to 0 internally.
 *
 * @example
 * const time: Time = { hour: 9, minute: 30 };
 * const midnight: Time = {}; // Defaults to 00:00
 */
export interface Time {
  /** Hour value (0–23) */
  hour: number | null;
  /** Minute value (0–59) */
  minute: number | null;
}

/**
 * Represents a combination of month and year.
 *
 * @example
 * const my: MonthYear = { month: 10, year: 2025 };
 */
export interface MonthYear {
  /** Month number (1–12) */
  month: number;
  /** Gregorian year (A.D.) */
  year: number;
}

/**
 * Supported languages for display and localization.
 */
export type SupportedLanguages = "en" | "th";

/**
 * Configuration options for the DateHelper class.
 * All fields are optional.
 *
 * @interface
 */
export interface DateHelperConfig {
  /**
   * Language for display text (month names, relative time, etc.)
   * @default "en"
   */
  lang?: SupportedLanguages;

  /**
   * If true, treats the date as UTC (removes browser timezone offset).
   * @default false
   */
  isUTC?: boolean;

  /**
   * If true, uses abbreviated month/day text (e.g., "Jan", "Mon").
   * @default false
   */
  useShortText?: boolean;

  /**
   * If true, displays Buddhist Era (B.E.) years (A.D. + 543).
   * @default false
   */
  useBD?: boolean;

  /**
   * If true, uses 12-hour format (AM/PM); otherwise 24-hour format.
   * @default false
   */
  use12HourFormat?: boolean;

  /**
   * If true, includes seconds in displayed time.
   * @default false
   */
  showSeconds?: boolean;
}
