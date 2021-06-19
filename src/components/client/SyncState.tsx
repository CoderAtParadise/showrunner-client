import { createContext, useEffect, useReducer } from "react";
import Runsheet, { JSON as RJSON } from "../common/Runsheet";
import TrackingShow, {JSON as TJSON} from "../common/TrackingShow";
import ClockSource from "../common/ClockSource";
import ClientClock from "./ClientClock";
import { parse } from "../common/TimePoint";
import { ClientRunsheetData } from "./ClientRunsheetHandler";

type Action =
  | { type: "runsheet"; runsheet: Runsheet | undefined }
  | { type: "clock"; source: ClockSource }
  | { type: "tracking"; tracking: TrackingShow };

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const reducer = (
  state: ClientRunsheetData,
  action: Action
): ClientRunsheetData => {
  switch (action.type) {
    case "clock":
      state.clocks.set(action.source.id, action.source);
      return {
        runsheet: state.runsheet,
        tracking: state.tracking,
        clocks: state.clocks,
      };
    case "runsheet":
      return {
        runsheet: action.runsheet,
        tracking: state.tracking,
        clocks: state.clocks,
      };
    case "tracking":
      state.tracking.set(action.tracking.id, action.tracking);
      return {
        runsheet: state.runsheet,
        tracking: state.tracking,
        clocks: state.clocks,
      };
    default:
      return state;
  }
};

const dataState: ClientRunsheetData = {
  runsheet: undefined,
  tracking: new Map<string, TrackingShow>(),
  clocks: new Map<string, ClockSource>(),
};

export const SyncContext = createContext(dataState);

const GetEventSource = () => {
  const [data, dispatcher] = useReducer(reducer, dataState);
  useEffect(() => {
    const source = new EventSource(`${serverurl}/sync`);
    source.addEventListener("error", () => {
      dispatcher({ type: "runsheet", runsheet: undefined });
    });
    source.addEventListener("runsheet", (e: any) => {
      dispatcher({
        type: "runsheet",
        runsheet: RJSON.deserialize(JSON.parse(e.data)),
      });
    });
    source.addEventListener("tracking", (e: any) => {
        dispatcher({
          type: "tracking",
          tracking: TJSON.deserialize(JSON.parse(e.data)),
        });
    });
    const clocks = new EventSource(`${serverurl}/clocks`);
    clocks.addEventListener("error", () => {});
    clocks.addEventListener("clock", (e: any) => {
      const data = JSON.parse(e.data) as { clock: string; value: string }[];
      Array.from(data).forEach((source: { clock: string; value: string }) => {
        dispatcher({
          type: "clock",
          source: new ClientClock(source.clock, parse(source.value)),
        });
      });
    });
    return () => {
      source.close();
      clocks.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return data;
};

const SyncState = (props: any) => {
  return (
    <SyncContext.Provider value={GetEventSource()}>
      {props.children}
    </SyncContext.Provider>
  );
};

export default SyncState;
