import { ClockSource, SMPTE } from "@coderatparadise/showrunner-common";

export function getSettingsTime(clock: ClockSource): SMPTE {
    const data = clock.data() as any;
    if (data.settings) {
        switch (clock.type) {
            case "tod:offset":
            case "offset":
                return new SMPTE(data.settings!.offset);
            case "tod":
                return new SMPTE(data.settings!.time);
            case "timer":
                return new SMPTE(data.settings!.duration);
        }
    }
    return new SMPTE();
}
