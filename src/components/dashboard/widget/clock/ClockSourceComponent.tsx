import {
    ClockSource,
    ClockDirection,
    SMPTE,
    Offset
} from "@coderatparadise/showrunner-common";
import styled from "@emotion/styled";
import { zeroPad } from "../../../../util/ZeroPad";

const Container = styled.div``;

const ClockSourceComponent = (props: {
    className?: string;
    clock: ClockSource;
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
    if (time.frameCount() === -1) {
        return (
            <Container className={props.className}>{time.toString()}</Container>
        );
    }
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

export default ClockSourceComponent;
