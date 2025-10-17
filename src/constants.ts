/**
 * English localization constants for DateHelper.
 * Includes weekday/month names and relative time formatters.
 */
export const en = {
  /** Abbreviated weekday names (Sunday → Saturday). */
  WEEKDAYS_ABBR: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

  /** Full weekday names (Sunday → Saturday). */
  WEEKDAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

  /** Abbreviated month names (January → December). */
  MONTHS_ABBR: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

  /** Full month names (January → December). */
  MONTHS: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  /** Relative time text functions used in `getTimeRelativeToNow`. */
  timeAgo: {
    /** For events within 1 minute. */
    justNow: "Just now",
    /** For events measured in minutes. */
    minute: (min: number) => `${min} minute${min > 1 ? "s" : ""} ago`,
    /** For events measured in hours. */
    hour: (hours: number) => `${hours} hour${hours > 1 ? "s" : ""} ago`,
    /** For events measured in days. */
    day: (days: number) => `${days} day${days > 1 ? "s" : ""} ago`,
  },
};

/**
 * Thai localization constants for DateHelper.
 * Includes weekday/month names and relative time formatters.
 */
export const th = {
  /** Abbreviated weekday names (อาทิตย์ → เสาร์). */
  WEEKDAYS_ABBR: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],

  /** Full weekday names (อาทิตย์ → เสาร์). */
  WEEKDAYS: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],

  /** Abbreviated month names (มกราคม → ธันวาคม). */
  MONTHS_ABBR: [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ],

  /** Full month names (มกราคม → ธันวาคม). */
  MONTHS: [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ],

  /** Relative time text functions used in `getTimeRelativeToNow`. */
  timeAgo: {
    /** For events within 1 minute. */
    justNow: "เมื่อสักครู่",
    /** For events measured in minutes. */
    minute: (min: number) => `${min} นาทีที่แล้ว`,
    /** For events measured in hours. */
    hour: (hours: number) => `${hours} ชั่วโมงที่แล้ว`,
    /** For events measured in days. */
    day: (days: number) => `${days} วันที่ผ่านมา`,
  },
};

/**
 * Constant representing one day in milliseconds.
 * Equivalent to `24 * 60 * 60 * 1000`.
 *
 * @constant
 * @type {number}
 * @default 86400000
 */
export const ONE_DAY_IN_MILLISECONDS: number = 8.64e7;
