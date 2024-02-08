export const padZero = (num: number | string) => {
  if (isNaN(+num)) return num;
  if (+num >= 10) return num;
  return `0${num}`;
};
