import { createContext, useEffect, useReducer } from "react";
import {
  RunsheetStorage,
  INVALID as INVALID_RUNSHEET,
  JSON as RJSON,
} from "../common/Runsheet";
import {
  TrackingSession,
  SESSION_JSON as TSJSON,
  TRACKER_JSON as TJSON,
  Tracker,
} from "../common/Tracking";

type State = {
  runsheet: RunsheetStorage;
  current: { session: string; active: string; next: string };
  tracking: Map<string, TrackingSession>;
  source: EventSource;
};

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const initialState: State = {
  runsheet: INVALID_RUNSHEET,
  current: { session: "", active: "", next: "" },
  tracking: new Map<string, TrackingSession>(),
  source: new EventSource(`${serverurl}/sync`),
};

export const RunsheetContext = createContext(INVALID_RUNSHEET);
export const CurrentContext = createContext({
  session: "",
  active: "",
  next: "",
});
export const TrackingContext = createContext(
  new Map<string, TrackingSession>()
);

type Action =
  | { type: "reconnect" }
  | { type: "runsheet"; runsheet: RunsheetStorage }
  | {
      type: "current";
      current: { session: string; active: string; next: string };
    }
  | { type: "tracking"; tracking: { session: string; tracker: Tracker } }
  | { type: "tracking_list"; tracking_list: Map<string, TrackingSession> }
  | { type: "tracking_session"; session: TrackingSession };

const syncReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "runsheet":
      return {
        runsheet: action.runsheet,
        current: state.current,
        tracking: state.tracking,
        source: state.source,
      };
    case "current":
      return {
        runsheet: state.runsheet,
        current: action.current,
        tracking: state.tracking,
        source: state.source,
      };
    case "tracking":
      const session = state.tracking.get(action.tracking.session);
      if (session)
        session.trackers.set(
          action.tracking.tracker.tracking_id,
          action.tracking.tracker
        );
      return {
        runsheet: state.runsheet,
        current: state.current,
        tracking: state.tracking,
        source: state.source,
      };
    case "tracking_list":
      return {
        runsheet: state.runsheet,
        current: state.current,
        tracking: action.tracking_list,
        source: state.source,
      };
    case "tracking_session":
      state.tracking.set(action.session.session_id,action.session);
      return {
        runsheet: state.runsheet,
        current: state.current,
        tracking: state.tracking,
        source: state.source,
      }
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
    state.source.addEventListener("tracking_list", (e: any) => {
      const list = JSON.parse(e.data);
      const map: Map<string, TrackingSession> = new Map<
        string,
        TrackingSession
      >();
      list.forEach((value: object) => {
        const session = TSJSON.deserialize(value);
        map.set(session.session_id, session);
      });
      dispatcher({ type: "tracking_list", tracking_list: map });
    });
    state.source.addEventListener("tracking", (e: any) => {
      const json = JSON.parse(e.data);
      const tracker: { session: string; tracker: Tracker } = {
        session: json.session,
        tracker: TJSON.deserialize(json.tracker),
      };

      dispatcher({ type: "tracking", tracking: tracker });
    });
    state.source.addEventListener("tracking_session", (e: any) => {
      const json = JSON.parse(e.data);
      dispatcher({
        type: "tracking_session",
        session: TSJSON.deserialize(json),
      });
    });
    return () => state.source.close();
    // Disable the lint rule we have insufficient resources if it isn't how it is
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <RunsheetContext.Provider value={state.runsheet}>
      <TrackingContext.Provider value={state.tracking}>
        <CurrentContext.Provider value={state.current}>
          {props.children}
        </CurrentContext.Provider>
      </TrackingContext.Provider>
    </RunsheetContext.Provider>
  );
};

export default SyncSource;
