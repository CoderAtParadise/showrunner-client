export const zeroPad = (num: number, places: number): string => {
    return String(Math.floor(num)).padStart(places, "0");
};
