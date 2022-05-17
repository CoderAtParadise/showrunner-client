import { ReactNode, useEffect } from "react";
import {
    CurrentClockState,
    RenderClockSource
} from "../../util/RenderClockSource";
import { atomFamily, selectorFamily, useSetRecoilState } from "recoil";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { RenderClockCodec } from "./codec/RenderClockCodec";
import { ClockIdentifier } from "@coderatparadise/showrunner-common";

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
    key: "clocks/current",
    get: (key:{show:string, session:string}) => ({ get }) => {
        return get(clocksState(key)) as Map<string, RenderClockSource>;
    },
    set: (key:{show:string, session:string}) => ({ set }, newValue) => {
        set(clocksState(key), (prevState) => {
            const state = new Map(prevState);
            const data = newValue as {identifier:ClockIdentifier, currentState: CurrentClockState }[];
            data.forEach((value: { identifier: ClockIdentifier; currentState: CurrentClockState }) => {
                state.get(value.identifier.id)?.setData({ currentState: value.currentState });
            });
            return state;
        });
    }
});

// prettier-ignore
const updateSettings = selectorFamily({
    key: "clocks/updater",
    get: (key:{show:string, session:string}) => ({ get }) => {
        return get(clocksState(key)) as Map<string, RenderClockSource>;
    },
    set: (key:{show:string, session:string}) => ({ set }, newValue) => {
        set(clocksState(key), (prevState) => {
            const state = new Map(prevState);
            const data = newValue as {id:string, data:any};
            state.get(data.id)?.setData({ ...data.data });
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

    const settingsUpdater = useSetRecoilState(
        updateSettings({ show: props.show, session: props.session })
    );
    useEffect(() => {
        const fetchData = async () => {
            await fetchEventSource(
                `${serverurl}/production/${props.show}/${props.session}/clocks`,
                {
                    method: "GET",
                    headers: {
                        Accept: "text/event-stream"
                    },
                    onmessage(event) {
                        if (event.event === "clocks-initial") {
                            const data = JSON.parse(event.data) as object[];
                            const updateClocks = new Map<
                                string,
                                RenderClockSource
                            >();
                            data.forEach((source: object) => {
                                const clock =
                                    RenderClockCodec.deserialize(source);
                                updateClocks.set(clock.identifier.id, clock);
                            });
                            setClocks(updateClocks);
                        } else if (event.event === "clocks-sync") {
                            const data = JSON.parse(event.data) as {
                                identifier: ClockIdentifier;
                                currentState: CurrentClockState;
                            }[];
                            currentUpdater(data);
                        } else if (event.event === "clocks-update") {
                            const data = JSON.parse(event.data) as {
                                id: string;
                                data: any;
                            };
                            settingsUpdater(data);
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
    }, [props.session, props.show, setClocks, currentUpdater, settingsUpdater]);
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
