export const twoDigitsFormat = (num: number): string => {
  const formatter = new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  return formatter.format(num);
};
