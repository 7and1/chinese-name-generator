declare module "lunar-javascript" {
  export class Lunar {
    static fromDate(date: Date): Lunar;

    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getTimeInGanZhi(): string;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar;

    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }
}
