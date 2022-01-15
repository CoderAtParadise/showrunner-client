import { ClockSource } from "@coderatparadise/showrunner-common";
import { Box } from "@mui/material";

const ClockSourceComponent = (props: {
    className?: string;
    clock: ClockSource;
    overrun?: boolean;
}) => {
    const time = props.clock.current();
    const zeroPad = (num: number, places: number): string => {
        return String(Math.floor(num)).padStart(places, "0");
    };
    return (
        <Box className={props.className}>{`${time.offset()}${zeroPad(
            time.hours(),
            2
        )}:${zeroPad(time.minutes(), 2)}:${zeroPad(time.seconds(), 2)}`}</Box>
    );
};

export default ClockSourceComponent;
