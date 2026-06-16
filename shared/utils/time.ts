export const parseISODate = (isoString: string): Date => {
  return new Date(isoString);
};

export const getPaddedSecondOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getSeconds()).padStart(2, '0');
};

export const getPaddedMinuteOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getMinutes()).padStart(2, '0');
};

export const getPaddedHourOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getHours()).padStart(2, '0');
};

export const getPaddedDayOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getDate()).padStart(2, '0');
};

export const getPaddedMonthOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getMonth() + 1).padStart(2, '0');
};

export const getYearOfDate = (date: string = new Date().toISOString()): string => {
  return String(parseISODate(date).getFullYear());
};

export const formatDate = (date: Date): string => {
  const year = getYearOfDate(date.toISOString());
  const month = getPaddedMonthOfDate(date.toISOString());
  const day = getPaddedDayOfDate(date.toISOString());

  return `${year}-${month}-${day}`;
};
