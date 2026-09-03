declare module '@sbmdkl/nepali-date-converter' {
  export type NepaliDateObject = { year: number; month: number; day: number };
  export function adToBs(adDate: string): string | NepaliDateObject;
  export function bsToAd(bsDate: string): string | NepaliDateObject;
}
