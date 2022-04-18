import { ReactNode, useEffect } from "react";
import {
    RenderClockSource,
    RenderIdentifier
} from "../../util/RenderClockSource";
import {
    atomFamily,
    selectorFamily,
    useSetRecoilState
} from "recoil";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const serverurl = process.env.SERVER_URL || "http://localhost:3001";

export const clocksState = atomFamily<
    Map<string, RenderClockSource>,
    { show: string; session: string }
>({
    key: "clocks",
    default: new Map<string, RenderClockSource>()
});

// prettier-ignore
const updateCurrent = selectorFamily({
    key: "clocks/updater",
    get: (key:{show:string, session:string}) => ({ get }) => {
        return get(clocksState(key)) as Map<string, RenderClockSource>;
    },
    set: (key:{show:string, session:string}) => ({ set }, newValue) => {
        set(clocksState(key), (prevState) => {
            const state = new Map(prevState);
            const data = newValue as {id:string, current:string}[];
            data.forEach((value: { id: string; current: string }) => {
                state.get(value.id)?.setData({ current: value.current });
            });
            return state;
        });
    }
});

const GetEventSource = (props: { show: string; session: string }) => {
    const setClocks = useSetRecoilState(
        clocksState({ show: props.show, session: props.session })
    );
    const currentUpdater = useSetRecoilState(
        updateCurrent({ show: props.show, session: props.session })
    );
    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource(
                `${serverurl}/production/${props.show}/${props.session}/clocks`,
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
                                RenderClockSource
                            >();
                            data.forEach((source: RenderIdentifier) => {
                                updateClocks.set(
                                    source.id,
                                    new RenderClockSource(source)
                                );
                            });
                            setClocks(updateClocks);
                        } else if (event.event === "clocks-sync") {
                            const data = JSON.parse(event.data) as {
                                id: string;
                                current: string;
                            }[];
                            currentUpdater(data);
                        } else if (event.event === "clocks-update") {
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
    }, [props.session, props.show, setClocks, currentUpdater]);
    return null;
};

const ClockSyncState = (props: {
    show: string;
    session: string;
    children?: ReactNode;
}) => {
    return (
        <div>
            {GetEventSource(props)}
            {props.children}
        </div>
    );
};

export default ClockSyncState;
