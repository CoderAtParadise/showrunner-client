import {
    ClockSource,
    ClockDirection,
    SMPTE,
    Offset
} from "@coderatparadise/showrunner-common";
import { Box } from "@mui/material";
import { zeroPad } from "../../util/ZeroPad";

const ClockSourceComponent = (props: {
    className?: string;
    clock: ClockSource;
    overrun?: boolean;
    paused?: boolean;
}) => {
    let time = props.clock.current();
    if ((props.clock.data() as any).settings !== undefined) {
        const settings = (props.clock.data() as any)!.settings;
        if (settings.duration && settings.direction) {
            const duration = new SMPTE(settings.duration);
            if (settings.direction === ClockDirection.COUNTDOWN) {
                if (time.greaterThan(duration, true))
                    time = time.subtract(duration, true).setOffset(Offset.END);
                else time = duration.subtract(time, true);
            }
        }
    }
    if (time.frameCount() === -1)
        return <Box className={props.className}>{time.toString()}</Box>;
    return (
        <Box className={props.className}>{`${time.offset()}${zeroPad(
            time.hours(),
            2
        )}:${zeroPad(time.minutes(), 2)}:${zeroPad(time.seconds(), 2)}`}</Box>
    );
};

export default ClockSourceComponent;
