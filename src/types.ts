/**
 * Represents a date tuple consisting of year, month, and date.
 * @typedef {Array<number>} DateTuple
 * @property {number} 0 - The year.
 * @property {number} 1 - The month number (humanly count).
 * @property {number} 2 - The date.
 */

export type DateTuple = [number, number, number];

/**
 * Represents a time object consisting of hour and minute.
 * @typedef {Object} Time
 * @property {number|null} hour - The hour value (null if unspecified).
 * @property {number|null} minute - The minute value (null if unspecified).
 */
export interface Time {
  hour: number | null;
  minute: number | null;
}

/**
 * Represents a month and year.
 */
export interface MonthYear {
  month: number;
  year: number;
}

export type SupportedLanguages = "en" | "th";

/**
 * Configuration options for the DateHelper class.
 * @interface
 */
export interface DateHelperConfig {
  lang: SupportedLanguages;
  isUTC: boolean;
  /**
   * If this true, all text will use short form.
   * For example, "January" will be "Jan" and "Sunday" will be "Sun".
   * If this false, all text will use long form.
   * For example, "January" will be "January" and "Sunday" will be "Sunday".
   * @default false;
   * @type {boolean}
   */
  useShortText: boolean;
  /**
   * If this true, all date texts will use B.D. year
   * @default false;
   * @type {boolean}
   */
  useBD: boolean;
  /**
   * If this true, all time texts will use AM PM format.
   * If this false, all time texts will use 24-hour format.
   * @default false;
   * @type {boolean}
   */
  use12HourFormat: boolean;
  /**
   * If this true, all time texts will be displayed with seconds.
   * @default false;
   * @type {boolean}
   */
  showSeconds: boolean;
}
