import { ReactNode, useEffect } from "react";
import { ClockIdentifier } from "@coderatparadise/showrunner-common";
import {
    RenderClockSource,
    RenderIdentifier
} from "../../util/RenderClockSource";
import { atomFamily, useRecoilState } from "recoil";

const serverurl = process.env.SERVER_URL || "http://localhost:3001";

export const clocksState = atomFamily<Map<string, ClockIdentifier>, string>({
    key: "clocks",
    default: new Map<string, ClockIdentifier>()
});

const GetEventSource = (props: { show: string }): ReactNode => {
    const [clocks, setClocks] = useRecoilState(clocksState(props.show));
    useEffect(() => {
        const source = new EventSource(
            `${serverurl}/production/${props.show}/clocks`
        );
        source.addEventListener("error", () => {
            setClocks(new Map<string, ClockIdentifier>());
        });
        source.addEventListener("clocks", (e: any) => {
            const data = JSON.parse(e.data) as {
                clock: RenderIdentifier;
                active: boolean;
                automation: boolean;
                renderChannel: string[];
            }[];
            const updateClocks = new Map<string, ClockIdentifier>();
            Array.from(data).forEach(
                (source: {
                    clock: RenderIdentifier;
                    active: boolean;
                    automation: boolean;
                    renderChannel: string[];
                }) => {
                    updateClocks.set(source.clock.id, {
                        clock: new RenderClockSource(source.clock),
                        active: source.active,
                        automation: source.automation,
                        renderChannel: source.renderChannel
                    });
                }
            );
            setClocks(updateClocks);
        });
        return () => {
            source.close();
        };
    }, [clocks]);
    return null;
};

const ClockSyncState = (props: { show: string; children?: ReactNode }) => {
    return (
        <div>
            {GetEventSource(props)}
            {props.children}
        </div>
    );
};

export default ClockSyncState;
