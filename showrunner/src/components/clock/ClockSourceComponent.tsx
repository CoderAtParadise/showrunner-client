import {
    ClockSource,
    ClockDirection,
    SMPTE,
    Offset
} from "@coderatparadise/showrunner-common";
import styled from "@emotion/styled";
import { zeroPad } from "../../util/ZeroPad";

const Container = styled.div``;

export const ClockSourceComponent = (props: {
    className?: string;
    clock: ClockSource<any> | null;
}) => {
    if (!props.clock)
        return <Container className={props.className}>{"--:--:--"}</Container>;
    let time = props.clock.current();
    if ((props.clock.data() as any).settings !== undefined) {
        const settings = (props.clock.data() as any)!.settings;
        if (settings.time && settings.time) {
            const duration = new SMPTE(settings.time);
            if (settings.direction === ClockDirection.COUNTDOWN) {
                if (time.greaterThan(duration, true))
                    time = time.subtract(duration, true).setOffset(Offset.END);
                else time = duration.subtract(time, true);
            }
        }
    }
    if (time.frameCount() === -1)
        return <Container className={props.className}>{"--:--:--"}</Container>;
    return (
        <Container className={props.className}>{`${time.offset()}${zeroPad(
            time.hours(),
            2
        )}:${zeroPad(time.minutes(), 2)}:${zeroPad(
            time.seconds(),
            2
        )}`}</Container>
    );
};
