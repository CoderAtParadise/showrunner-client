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
  INVALID_SESSION,
} from "../common/Tracking";

type State = {
  runsheet: RunsheetStorage;
  current: { session: string; active: string; next: string };
  tracking: Map<string, TrackingSession>;
};

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const syncState: State = {
  runsheet: INVALID_RUNSHEET,
  current: { session: "", active: "", next: "" },
  tracking: new Map<string, TrackingSession>(),
};

export const SyncContext = createContext(syncState);

type Action =
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
      };
    case "current":
      return {
        runsheet: state.runsheet,
        current: action.current,
        tracking: state.tracking,
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
      };
    case "tracking_list":
      return {
        runsheet: state.runsheet,
        current: state.current,
        tracking: action.tracking_list,
      };
    case "tracking_session":
      state.tracking.set(action.session.session_id, action.session);
      return {
        runsheet: state.runsheet,
        current: state.current,
        tracking: state.tracking,
      };
  }
  return state;
};

const GetEventSource = () => {
  const [data, dispatcher] = useReducer(syncReducer, syncState);
  useEffect(() => {
    const source = new EventSource(`${serverurl}/sync`);
    source.addEventListener("error", () => {
      dispatcher({ type: "runsheet", runsheet: INVALID_RUNSHEET });
      dispatcher({type:"tracking_list",tracking_list: new Map<string,TrackingSession>()})
      dispatcher({type:"current", current: {session:"",active:"",next:""}})
    });
    source.addEventListener("runsheet", (e: any) => {
      dispatcher({
        type: "runsheet",
        runsheet: RJSON.deserialize(JSON.parse(e.data)),
      });
    });
    source.addEventListener("current", (e: any) => {
      dispatcher({
        type: "current",
        current: JSON.parse(e.data),
      });
    });
    source.addEventListener("tracking_list", (e: any) => {
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
    source.addEventListener("tracking", (e: any) => {
      const json = JSON.parse(e.data);
      const tracker: { session: string; tracker: Tracker } = {
        session: json.session,
        tracker: TJSON.deserialize(json.tracker),
      };

      dispatcher({ type: "tracking", tracking: tracker });
    });
    source.addEventListener("tracking_session", (e: any) => {
      const json = JSON.parse(e.data);
      dispatcher({
        type: "tracking_session",
        session: TSJSON.deserialize(json),
      });
    });
  },[]);
  return data;
};

const SyncSource = (props: any) => {
  return (<SyncContext.Provider value={GetEventSource()}>{props.children}</SyncContext.Provider>);
}

export default SyncSource;
