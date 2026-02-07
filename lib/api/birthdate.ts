export function parseBirthDateYmd(input: string): {
  year: number;
  month: number;
  day: number;
} {
  const ymd = input.trim().slice(0, 10);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!match) {
    throw new Error("Invalid birthDate");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error("Invalid birthDate");
  }
  if (month < 1 || month > 12) throw new Error("Invalid birthDate");
  if (day < 1 || day > 31) throw new Error("Invalid birthDate");

  return { year, month, day };
}
