import { useContext } from "react";
import { RunsheetContext, TrackingContext } from "./SyncSource";
import { INVALID, get, Nested } from "../common/Storage";

export default function GetStorage(session: string, key: string) {
  const trackingSession = useContext(TrackingContext).get(session);
  const runsheet = useContext(RunsheetContext);
  if (trackingSession) {
    if (key === trackingSession.tracking_id) return get(runsheet, key);
    if (trackingSession.trackers.has(key)) {
      const ss = (runsheet.nested.get(
        trackingSession.tracking_id
      ) as unknown) as Nested;
      const p = trackingSession.trackers.get(key);
      if (p) {
        if (p.parent === trackingSession.tracking_id) {
          const t = get(ss, key);
          return t;
        }
        const bs = (get(ss, p.parent) as unknown) as Nested;
        if (bs) return get(bs, key);
      }
    }
  }
  return INVALID;
}
