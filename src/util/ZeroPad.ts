export const zeroPad = (num: number, places: number): string => {
    if (isNaN(num)) num = 0;
    return String(Math.floor(num)).padStart(places, "0");
};
