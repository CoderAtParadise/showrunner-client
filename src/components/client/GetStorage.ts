import { useContext } from "react";
import { SyncContext } from "./SyncSource";
import { INVALID, get, Nested } from "../common/Storage";

export default function GetStorage(session: string, key: string) {
  const sync = useContext(SyncContext);
  const trackingSession = sync.tracking.get(session);
  if (trackingSession) {
    if (key === trackingSession.tracking_id) return get(sync.runsheet, key);
    if (trackingSession.trackers.has(key)) {
      const ss = sync.runsheet.nested.get(
        trackingSession.tracking_id
      ) as unknown as Nested;
      const p = trackingSession.trackers.get(key);
      if (p) {
        if (p.parent === trackingSession.tracking_id) {
          const t = get(ss, key);
          return t;
        }
        const bs = get(ss, p.parent) as unknown as Nested;
        if (bs) return get(bs, key);
      }
    }
  }
  return INVALID;
}
