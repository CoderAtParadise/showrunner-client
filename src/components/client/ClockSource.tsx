import { createContext, useEffect, useReducer } from "react";
import { INVALID as INVALID_POINT, parse, Point } from "../common/Time";

export const ClockContext = createContext(INVALID_POINT);

type State = {
  clock: Point;
  source: EventSource;
};

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const initialState = {
  clock: INVALID_POINT,
  source: new EventSource(`${serverurl}/clock`),
};

type Action = { type: "clock"; clock: Point } | { type: "reconnect" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "clock":
      return { clock: action.clock, source: state.source };
    case "reconnect":
      return {
        clock: INVALID_POINT,
        source: new EventSource(`${serverurl}/clock`),
      };
    default:
      return state;
  }
};

const ClockSource = (props: any) => {
  const [state, dispatcher] = useReducer(reducer, initialState);
  useEffect(() => {
    if (state.source.CLOSED && !state.source.CONNECTING)
      dispatcher({ type: "reconnect" });
    state.source.addEventListener("error", () => {
      dispatcher({ type: "clock", clock: INVALID_POINT });
    });
    state.source.addEventListener("clock", (e: any) =>
      dispatcher({ type: "clock", clock: parse(e.data) })
    );
    return () => state.source.close();
    // Disable the lint rule we have insufficient resources if it isn't how it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ClockContext.Provider value={state.clock}>
      {props.children}
    </ClockContext.Provider>
  );
};

export default ClockSource;
