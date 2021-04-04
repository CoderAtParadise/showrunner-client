import { stat } from "node:fs";
import { createContext, useEffect, useReducer, useState } from "react";
import { act } from "react-dom/test-utils";
import { INVALID as INVALID_POINT, parse, Point, stringify } from "./Time";

export const ClockContext = createContext(INVALID_POINT);

type State = {
    clock: Point;
    source: EventSource;
}

const serverurl = "http://localhost:3001";
const initialState = 
{
    clock: INVALID_POINT,
    source: new EventSource(`${serverurl}/clock`),
}

type Action = 
    | {type:'clock',clock: Point}
    | {type:'reconnect'}

const reducer = (state:State,action:Action):State => {
    switch(action.type)
    {
        case 'clock':
            return {clock:action.clock,source:state.source};
        case 'reconnect':
            return {clock:INVALID_POINT,source: new EventSource(`${serverurl}/clock`)};
        default:
            return state;
    }
};

const ClockSource = (props: any) => {
    const [state, dispatcher] = useReducer(reducer,initialState);
    useEffect(() => {
        if(state.source.CLOSED && !state.source.CONNECTING)
            dispatcher({type:'reconnect'});
        state.source.addEventListener('error',() => {
            dispatcher({type:'clock',clock:INVALID_POINT});
            state.source.close();
        });
        state.source.addEventListener('open',() => console.log('open'));
        state.source.addEventListener('clock', (e: any) =>
        dispatcher({type:'clock',clock:parse(e.data)}));
    }); 
    return <ClockContext.Provider value={state.clock}><ClockContext.Consumer>{clock => (<p>{stringify(clock)}</p>)}</ClockContext.Consumer>{props.children}</ClockContext.Provider>;
}

export default ClockSource;