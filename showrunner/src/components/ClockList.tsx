import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { RenderClockSource } from "../util/RenderClockSource";
import { clocksState } from "./Sync/Clocks";
import { RenderMode } from "./widget/IWidgetLayout";
import { Widget } from "./widget/Widget";
import { CreateClockMenu } from "./menu/CreateMenu";

const Container = styled.div`
    display: flex;
    width: 100vw;
    height: fit-content;
    flex-direction: row;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
`;

const Br = styled.hr`
    width: 100%;
`;

export const ClockList = (props: {
    className?: string;
    show: string;
    session: string;
}) => {
    const clocks = useRecoilValue(
        clocksState({ show: props.show, session: props.session })
    );
    return (
        <>
            <CreateClockMenu show={props.show} session={props.session} />
            <Container className={props.className}>
                {Array.from(clocks.values()).map((clock: RenderClockSource) => {
                    return (
                        <Widget
                            key={clock.identifier.id}
                            layout={{
                                id: clock.identifier.id,
                                widget: "WidgetClock",
                                renderMode: RenderMode.COMPACT,
                                position: { x: 0, y: 0, z: 0 },
                                config: {
                                    widget: {
                                        displayName: clock.displayName!(),
                                        header: true
                                    },
                                    display: {
                                        source: `${props.show}:${props.session}:${clock.identifier.id}`,
                                        fontSize: "36px",
                                        overrunColor: "#cf352e",
                                        color: "#FFC354",
                                        controlBar: true
                                    }
                                }
                            }}
                        />
                    );
                })}
            </Container>
        </>
    );
};
