import { createContext, useEffect, useState } from "react";
import { INVALID as INVALID_POINT, parse, stringify } from "./Time";

export const ClockContext = createContext(INVALID_POINT);

const serverurl = "http://localhost:3001";
let clockSource: EventSource;
const ClockSource = (props: any) => {
    const [clock, setClock] = useState(INVALID_POINT);
    useEffect(() => {
        if(!clockSource) {
            clockSource = new EventSource(`${serverurl}/clock`);
        }
        clockSource.addEventListener('error',() => {
            setClock(INVALID_POINT);
            clockSource.close();
        });
        clockSource.addEventListener('clock', (e: any) =>
            setClock(parse(e.data)));
    });
    return <ClockContext.Provider value={clock}><ClockContext.Consumer>{clock => (<p>{stringify(clock)}</p>)}</ClockContext.Consumer>{props.children}</ClockContext.Provider>;
}

export default ClockSource;