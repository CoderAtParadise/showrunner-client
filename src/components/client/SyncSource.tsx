import { createContext, useEffect, useReducer } from "react";
import { RunsheetStorage,INVALID as INVALID_RUNSHEET, JSON as RJSON } from "../common/Runsheet";

type State = {
  runsheet: RunsheetStorage;
  current: { active: string; next: string };
  source: EventSource;
};

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const initialState: State = {
  runsheet: INVALID_RUNSHEET,
  current: { active: "", next: "" },
  source: new EventSource(`${serverurl}/sync`),
};

export const RunsheetContext = createContext(INVALID_RUNSHEET);
export const CurrentContext = createContext({ active: "", next: "" });

type Action =
  | { type: "reconnect" }
  | { type: "runsheet"; runsheet: RunsheetStorage }
  | { type: "current"; current: object }
  | { type: "tracking"};

const syncReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "runsheet":
      return {
        runsheet: action.runsheet,
        current: state.current,
        source: state.source,
      };
    case "current":
      return {
        runsheet: state.runsheet,
        current: action.current as { active: string; next: string },
        source: state.source,
      };
    case "tracking":
        return {
        runsheet: state.runsheet,
        current: state.current,
        source: state.source,
      };
  }
  return state;
};

const SyncSource = (props: any) => {
  const [state, dispatcher] = useReducer(syncReducer, initialState);
  useEffect(() => {
    if (state.source.CLOSED && !state.source.CONNECTING)
      dispatcher({ type: "reconnect" });
    state.source.addEventListener("error", () => {
      dispatcher({ type: "runsheet", runsheet: INVALID_RUNSHEET });
    });
    state.source.addEventListener("runsheet", (e: any) => {
      dispatcher({
        type: "runsheet",
        runsheet: RJSON.deserialize(JSON.parse(e.data)),
      });
    });
    state.source.addEventListener("current", (e: any) => {
        dispatcher({
          type: "current",
          current: JSON.parse(e.data),
        });
      });
    return () => state.source.close();
// Disable the lint rule we have insufficient resources if it isn't how it is
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RunsheetContext.Provider value={state.runsheet}>
      <CurrentContext.Provider value={state.current}></CurrentContext.Provider>
      <RunsheetContext.Consumer>
        {(runsheet) => <p>{JSON.stringify(runsheet)}</p>}
      </RunsheetContext.Consumer>
      <CurrentContext.Consumer>
        {(current) => <p>{current.active}</p>}
      </CurrentContext.Consumer>
      {props.children}
    </RunsheetContext.Provider>
  );
};

export default SyncSource;
