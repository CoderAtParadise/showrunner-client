    export interface Point {
        readonly hours: number;
        readonly minutes: number;
        readonly seconds: number;
    }

    export const equals = (lhs: Point, rhs: Point): boolean => {
      return (
        lhs.hours === rhs.hours &&
        lhs.minutes === rhs.minutes &&
        lhs.seconds === rhs.seconds
      );
    };

    export const stringify = (point: Point): string => {
      const zeroPad = (num: number, places: number): string => {
        return String(num).padStart(places, "0");
      };
      
      if (equals(point, INVALID)) return "--:--:--";
      return `${zeroPad(point.hours, 2)}:${zeroPad(point.minutes, 2)}:${zeroPad(
        point.seconds,
        2
      )}`;
    };

    export const parse = (str: string): Point => {
        if (str === "--:--:--") return INVALID;
          const v: string[] = str.split(":");
          return {
            hours: Number.parseInt(v[0]),
            minutes: Number.parseInt(v[1]),
            seconds: Number.parseInt(v[2]),
          };
      };

    export const INVALID: Point = {hours: -1, minutes: -1, seconds:-1};