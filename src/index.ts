import moment from "moment";

import { ONE_DAY_IN_MILLISECONDS, en as constantsEN, th as constantsTH } from "./constants";
import { DateHelperConfig, DateTuple, MonthYear, SupportedLanguages, Time } from "./types";
import { padZero } from "./utils";

export * from "./constants";
export * from "./types";

export default class DateHelper {
  static CURRENT_YEAR = () => new Date().getFullYear();
  static ONE_DAY_IN_MS = ONE_DAY_IN_MILLISECONDS;
  static CURRENT_MONTH = new Date().getMonth() + 1;
  static THAI_TIMEZONE_OFFSET = 7 * 60 * 60 * 1000;

  /**
   * Creates a new DateHelper instance representing the current date and time.
   * @param {DateHelperConfig} [config] - Optional configuration for the DateHelper instance.
   * @returns {DateHelper} A DateHelper instance representing the current date and time.
   */
  static now = (config?: DateHelperConfig): DateHelper => new DateHelper(undefined, config);

  /**
   * Return gap in minutes between parameters d1 and d2
   * @returns minutes
   */
  static deltaMinutes = (d1: DateHelper, d2: DateHelper) => {
    const dd1 = +d1.date;
    const dd2 = +d2.date;
    const deltaMs = dd1 - dd2;
    const deltaMin = Math.round(deltaMs / 6e4);
    return deltaMin;
  };

  /**
   * Creates a new DateHelper instance from a DateTuple and optional Time.
   * @param {DateTuple} tuple - The DateTuple representing the year, month, and date.
   * @param {Time} [time] - Optional. The Time object representing the hour and minute.
   * @returns {DateHelper} - A new DateHelper instance representing the combined date and time.
   */
  static fromDateTupleAndTime = (tuple: DateTuple, time?: Time): DateHelper => {
    const [y, m, d] = tuple;
    const date = new Date(y, m - 1, d, time?.hour ?? 0, time?.minute ?? 0);
    return new DateHelper(+date);
  };

  /**
   * Checks if the DateHelper instance falls on the specified date.
   * @param {string} date - The date to check against, in the format "YYYY-MM-DD".
   * @param {DateHelper} instance - The DateHelper instance to compare.
   * @returns {boolean} - True if the DateHelper instance falls on the specified date, otherwise false.
   * @throws {Error} - If the provided date is not in the correct format.
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
   * Parses a time string into a Time object.
   * @param {string} timeString - The time string to parse (in "HH:mm" format).
   * @returns {Time} - The Time object representing the parsed time.
   * @throws {Error} - If the time string is invalid or in an incorrect format.
   */
  static timeStringToTime = (timeString: string): Time => {
    try {
      const [h, m] = timeString.split(":");
      if (isNaN(+h) || isNaN(+m)) throw new Error();
      return { hour: +h, minute: +m };
    } catch (error) {
      throw new Error(`Invalid time format: ${timeString}`);
    }
  };

  /**
   * Converts a Time object to a time string.
   * @param {Time} time - The Time object to convert.
   * @returns {string} - The time string in "HH:mm" format.
   */
  static timeToTimeString = (time: Time): string =>
    [padZero(time.hour ?? 0), padZero(time.minute ?? 0)].join(":");

  /**
   * Checks if two DateHelper instances represent the same day.
   * @param {DateHelper} d1 - The first DateHelper instance.
   * @param {DateHelper} d2 - The second DateHelper instance.
   * @returns {boolean} - True if both DateHelper instances represent the same day, otherwise false.
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
   * Checks if two DateHelper objects represent the same time.
   * @param {DateHelper} d1 - The first DateHelper object.
   * @param {DateHelper} d2 - The second DateHelper object.
   * @returns {boolean} - True if both objects represent the same time, false otherwise.
   */
  static isSameTime = (d1: DateHelper, d2: DateHelper): boolean => {
    return (
      d1.date.getHours() === d2.date.getHours() &&
      d1.date.getMinutes() === d2.date.getMinutes() &&
      d1.date.getSeconds() === d2.date.getSeconds()
    );
  };

  /**
   * Checks if two time strings represent the same time.
   * @param {string} t1 - The first time string to compare (in "HH:mm" format).
   * @param {string} t2 - The second time string to compare (in "HH:mm" format).
   * @returns {boolean} - True if both time strings represent the same time, false otherwise.
   * @throws {Error} - If either of the time strings is in an invalid format.
   */
  static isSameTimeString = (t1: string, t2: string): boolean => {
    const [h1, m1] = t1.split(":");
    const [h2, m2] = t2.split(":");
    if (h1 == null || h2 == null || m1 == null || m2 == null)
      throw new Error(`Either of these arguments are in invalid format: "${t1}", "${t2}"`);
    return h1 == h2 && m1 == m2;
  };

  /**
   * Checks if two DateTuple objects represent the same date.
   * @param {DateTuple} d1 - The first DateTuple object.
   * @param {DateTuple} d2 - The second DateTuple object.
   * @returns {boolean} - True if both DateTuple objects represent the same date, false otherwise.
   */
  static isSameDateTuple = (d1: DateTuple, d2: DateTuple): boolean => {
    return d1.every((x, i) => x === d2[i]);
  };

  /**
   * Calculates the time delta in milliseconds, similar to the behavior of the timeDelta function in Python.
   * @param {number} [days=1] - Optional. The number of days to convert to milliseconds. Defaults to 1 if not provided.
   * @returns {number} - The time delta in milliseconds.
   */
  static timeDelta = (days: number = 1): number => {
    return days * this.ONE_DAY_IN_MS;
  };

  /**
   * Converts a DateTuple and Time into a JavaScript Date object.
   * @param {DateTuple} tuple - The DateTuple representing the year, month, and date.
   * @param {Time} time - The Time representing the hour and minute.
   * @returns {Date} - The JavaScript Date object representing the combined date and time.
   */
  static datetimeToDate = (tuple: DateTuple, time: Time): Date => {
    const [year, month, date] = tuple;
    const { hour = 0, minute = 0 } = time;

    return new Date(year, month - 1, date, hour!, minute!);
  };

  /**
   * Determines if the provided time is in the past relative to the given date.
   * @param {Time} time - The Time object representing the time to check.
   * @param {DateHelper} [date=DateHelper.now()] - Optional. The date against which to compare the time. Defaults to the current date and time.
   * @returns {boolean} - True if the provided time is in the past relative to the given date, otherwise false.
   */
  static isTimePastForDate = (time: Time, date: DateHelper = DateHelper.now()): boolean => {
    const currentTime = new DateHelper();
    currentTime.date.setHours(time.hour ?? 0);
    currentTime.date.setMinutes(time.minute ?? 0);
    return date.isPast(currentTime) || date.isPastDay();
  };

  /**
   * Creates a new DateHelper instance with the specified date and timezone offset.
   * @param {string} date - The date string to create the instance from.
   * @param {number} [offset=this.THAI_TIMEZONE_OFFSET] - The timezone offset in milliseconds.
   * @returns {DateHelper} - A new DateHelper instance with the specified date and offset.
   */
  static getInstanceWithOffset = (date: string, offset = this.THAI_TIMEZONE_OFFSET) => {
    const ms = Date.parse(date);
    return new DateHelper(ms + offset);
  };

  /**
   * Creates a new DateHelper instance from a DateTuple.
   * @param {DateTuple | null} tuple - The DateTuple to create the instance from.
   * @returns {DateHelper | null} - A new DateHelper instance if a valid DateTuple is provided, otherwise null.
   */
  static fromDateTuple = (tuple: DateTuple | null): DateHelper | null => {
    if (tuple == null) return null;
    return new DateHelper(tuple.join("-"));
  };

  /**
   * Finds the previous month and year based on the given month and year.
   * @param {number} month - The current month (human read).
   * @param {number} year - The current year.
   * @returns {MonthYear} The previous month and year.
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
   * Finds the next month and year based on the given month and year.
   * @param {number} month - The current month (human read).
   * @param {number} year - The current year.
   * @returns {MonthYear} The next month and year.
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

  protected getLanguageConstants = () => {
    switch (this.defaultLang) {
      case "en":
        return constantsEN;
      case "th":
        return constantsTH;
      default:
        return constantsEN;
    }
  };

  private date: Date;
  protected defaultLang: SupportedLanguages = "en";
  protected useShortText = false;
  protected useBD = false;
  protected use12HourFormat = false;
  protected showSeconds = false;

  /**
   * Initializes a new instance of the DateHelper class.
   * @constructor
   * @param {string | number} [dateStringOrNumberInMs] - Optional. A string representing a date, a number representing a timestamp, or undefined for the current date and time.
   * @param {Partial<DateHelperConfig>} [config={}] - Optional. Configuration options for the DateHelper instance.
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
    if (config.use12HourFormat != null) this.use12HourFormat = config.use12HourFormat;
    if (config.showSeconds != null) this.showSeconds = config.showSeconds;
  }

  /**
   * Checks if this DateHelper instance represents the same month as the provided DateHelper instance.
   * @param {DateHelper} dateToCompare - The DateHelper instance to compare against.
   * @returns {boolean} - True if both DateHelper instances represent the same month, otherwise false.
   */
  isSameMonth = (dateToCompare: DateHelper): boolean => {
    return (
      this.date.getFullYear() === dateToCompare.date.getFullYear() &&
      this.date.getMonth() === dateToCompare.date.getMonth()
    );
  };

  /**
   * Checks if the given DateHelper instance represents the same day as this DateHelper instance.
   * @param {DateHelper} dateToCompare - The DateHelper instance to compare against.
   * @returns {boolean} - True if both DateHelper instances represent the same day, otherwise false.
   */
  isSameDay = (dateToCompare: DateHelper): boolean =>
    this.isSameMonth(dateToCompare) && this.date.getDate() === dateToCompare.date.getDate();

  /**
   * Checks if this DateHelper instance represents today.
   * @returns {boolean} - True if this DateHelper instance represents today, otherwise false.
   */
  isToday = (): boolean => {
    const today = new DateHelper();
    return this.isSameDay(today);
  };

  /**
   * Checks if this object represents a past date.
   * @param {DateHelper} [pastForm] - The DateHelper instance to compare against. Defaults to the current date.
   * @returns {boolean} - True if this DateHelper instance represents a past date, otherwise false.
   */
  isPast = (pastForm: DateHelper = new DateHelper()): boolean => pastForm.toMs() - this.toMs() > 0;

  /**
   * Checks if this DateHelper instance represents a date before today.
   * @returns {boolean} - True if this DateHelper instance represents a date before today, otherwise false.
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
   * Checks if this DateHelper instance represents a date before the given date.
   * @param {DateHelper} dateToCompare - The DateHelper instance to compare against.
   * @returns {boolean} - True if this DateHelper instance represents a date before the given date, otherwise false.
   */
  isDayBefore = (dateToCompare: DateHelper): boolean => {
    if (this.isSameDay(dateToCompare)) return false;
    return this.toMs() < dateToCompare.toMs();
  };

  /**
   * Checks if this DateHelper instance represents a date after the given date.
   * @param {DateHelper} dateToCompare - The DateHelper instance to compare against.
   * @returns {boolean} - True if this DateHelper instance represents a date after the given date, otherwise false.
   */
  isDayAfter = (dateToCompare: DateHelper): boolean => {
    if (this.isSameDay(dateToCompare)) return false;
    return this.toMs() > dateToCompare.toMs();
  };

  /**
   * Joins the date components of this DateHelper instance into a string with a hyphen separator.
   * @returns {string} - The date components joined into a string.
   */
  joinDateTuple = (): string => {
    return this.toDateTuple().join("-");
  };

  /**
   * Gets the DateHelper instance representing yesterday.
   * @returns {DateHelper} - The DateHelper instance representing yesterday.
   */
  getYesterday = (): DateHelper => new DateHelper(this.toMs() - DateHelper.timeDelta());

  /**
   * Gets the number of days in the month represented by this DateHelper instance.
   * @returns {number} - The number of days in the month.
   */
  getDaysCountInMonth = (): number => {
    const [year, month] = this.toDateTuple();
    const monthWith30Days = [4, 6, 9, 11];

    const isLeapYear = year % 4 === 0;
    if (month === 2) return isLeapYear ? 29 : 28;
    return monthWith30Days.includes(month) ? 30 : 31;
  };

  /**
   * Gets the weekday of the first day of the month should be represented in typical calendar.
   * @returns {number} - The weekday index (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
   */
  getFirstWeekdayInMonth = (): number => {
    const [year, month] = this.toDateTuple();
    const firstDay = new Date(year, month - 1, 1);
    return firstDay.getDay();
  };

  /**
   * Returns a human-readable string representing the time difference between the current time and this DateHelper instance.
   * @returns {string} - A string representing the time difference.
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
   * Get the Buddhist calendar year (BD year) of the current date.
   * @returns {number} The Buddhist calendar year (BD year).
   * @throws {Error} Throws an error if the date is already in the Buddhist calendar.
   */
  getBDYear = (): number => {
    const year = this.date.getFullYear();
    return year + 543;
  };

  /**
   * Get the Gregorian calendar year (AD year) of the current date.
   * @returns {number} The Gregorian calendar year (AD year).
   */
  getADYear = (): number => {
    const year = this.date.getFullYear();
    return year;
  };

  /**
   * Get the display date string in the format "DD Month YYYY".
   * Feel free to inherit this to your project's scheme.
   * @returns {string} The display date string.
   */
  getDisplayDate = (): string => {
    const date = this.date.getDate();
    const year = this.useBD ? this.getBDYear() : this.getADYear();

    const monthString = this.getMonthName();
    const yearString = this.useShortText ? year % 100 : year;

    return `${padZero(date)} ${monthString} ${yearString}`;
  };

  /**
   * Get the formatted time string based on the current configuration settings.
   * Feel free to inherit this to your project's scheme.
   * @returns {string} The formatted time string.
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
   * Get the formatted date and time string based on the current configuration settings.
   * @returns {string} The formatted date and time string.
   */
  getDisplayDateAndTime = (): string => [this.getDisplayDate(), this.getDisplayTime()].join(" ");

  /**
   * Get the name of the month based on the current configuration settings.
   * @returns {string} The name of the month.
   */
  getMonthName = (): string => {
    const month = this.date.getMonth();
    const { MONTHS, MONTHS_ABBR } = this.getLanguageConstants();
    if (this.useShortText) return MONTHS_ABBR[month];
    return MONTHS[month];
  };

  /**
   * Get Date object on this DateHelper object.
   * @returns {Date} - The Date representing date time for this object.
   */
  getDate = (): Date => this.date;

  /**
   * Converts the DateHelper object to a DateTuple.
   * @returns {DateTuple} - The DateTuple representing the year, month, and date of the DateHelper object.
   */
  toDateTuple = (): DateTuple => [
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    this.date.getDate(),
  ];

  /**
   * Converts the time components of this DateHelper instance into a Time object.
   * @returns {Time} - The time components as a Time object.
   */
  toTimeObject = (): Time => ({
    hour: this.date.getHours(),
    minute: this.date.getMinutes(),
  });

  /**
   * Converts this DateHelper instance to milliseconds since January 1, 1970, 00:00:00 UTC.
   * @returns {number} - The number of milliseconds since January 1, 1970, 00:00:00 UTC.
   */
  toMs = (): number => this.date.getTime();

  /**
   * Converts the DateHelper object to a string in ISO 8601 date format (YYYY-MM-DD).
   * @returns {string} The date string in ISO 8601 format.
   */
  toISODate = (): string => {
    return this.date.toISOString().slice(0, 10);
  };

  /**
   * Generates an ISO 8601 formatted date and time string.
   * @returns {string} The ISO 8601 formatted date and time string.
   */
  toISO8601String = (): string => {
    return this.date.toISOString();
  };

  /**
   * Converts the DateHelper object to momentjs instance
   * @returns {moment.Moment}
   */
  toMoment = (): moment.Moment => {
    return moment(this.date);
  };
}
