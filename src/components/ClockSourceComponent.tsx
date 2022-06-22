import {
    ClockSource,
    ClockDirection,
    Offset,
    ClockStatus,
    zeroPad
} from "@coderatparadise/showrunner-common";

export const ClockSourceComponent = (props: {
    className?: string;
    clock: ClockSource<any> | null;
}) => {
    if (!props.clock)
        return <div className={props.className}>{"--:--:--"}</div>;
    let time = props.clock.current();
    if (props.clock.settings !== undefined) {
        const settings = props.clock.settings;
        if (settings().time) {
            const duration = props.clock.duration();
            if(props.clock.status() === ClockStatus.RESET) time = duration;
            else if (settings().direction === ClockDirection.COUNTDOWN) {
                if (time.greaterThan(duration, true))
                    time = time.subtract(duration, true).setOffset(Offset.END);
                else time = duration.subtract(time, true);
            }
        }
    }
    if (time.frameCount() === -1)
        return <div className={props.className}>{"--:--:--"}</div>;
    return (
        <div className={props.className}>{`${time.offset()}${zeroPad(
            time.hours(),
            2
        )}:${zeroPad(time.minutes(), 2)}:${zeroPad(
            time.seconds(),
            2
        )}`}</div>
    );
};
