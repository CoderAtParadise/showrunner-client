import { ReactNode, useEffect } from "react";
import {
    RenderClockSource,
    RenderIdentifier
} from "../../util/RenderClockSource";
import { atomFamily, useSetRecoilState } from "recoil";
import { ClockSource } from "@coderatparadise/showrunner-common";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const serverurl = process.env.SERVER_URL || "http://localhost:3001";

type Action =
    | { type: "initialize"; initial: Map<string, RenderClockSource> }
    | { type: "sync"; sync: { id: string; current: string }[] }
    | { type: "add"; add: RenderClockSource }
    | { type: "remove"; remove: string };

function reducer(prevState: Map<string, RenderClockSource>, action: Action) {
    const state = new Map<string, RenderClockSource>(prevState);
    switch (action.type) {
        case "initialize":
            return action.initial;
        case "sync":
            action.sync.forEach((value: { id: string; current: string }) => {
                state.get(value.id)?.setData({ current: value.current });
            });
            return state;
        case "add":
            state.set(action.add.id, action.add);
            return state;
        case "remove":
            state.delete(action.remove);
            return state;
        default:
            return prevState;
    }
}

export const clocksState = atomFamily<Map<string, ClockSource<any>>, string>({
    key: "clocks",
    default: new Map<string, ClockSource<any>>()
});

const GetEventSource = (props: { show: string }) => {
    const setClocks = useSetRecoilState(clocksState(props.show));
    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource(
                `${serverurl}/production/${props.show}/clocks`,
                {
                    method: "POST",
                    headers: {
                        Accept: "text/event-stream"
                    },
                    onmessage(event) {
                        if (event.event === "clocks-initial") {
                            const data = JSON.parse(
                                event.data
                            ) as RenderIdentifier[];
                            const updateClocks = new Map<
                                string,
                                ClockSource<any>
                            >();
                            data.forEach((source: RenderIdentifier) => {
                                updateClocks.set(
                                    source.id,
                                    new RenderClockSource(source)
                                );
                            });
                            setClocks(updateClocks);
                        } else if (event.event === "clocks") {
                            // console.log(event.data);
                        }
                    },
                    onclose() {
                        console.log("Connection closed by the server");
                    },
                    onerror(err) {
                        console.log("There was an error from server", err);
                    }
                }
            );
        };
        fetchData();
    }, [props.show, setClocks]);
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
