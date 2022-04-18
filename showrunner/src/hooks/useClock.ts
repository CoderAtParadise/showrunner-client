import { useRecoilValue } from "recoil";
import { clocksState } from "../components/Sync/Clocks";

export function useClock(source: string) {
    const [show, session, id] = source.split(":");
    const clocks = useRecoilValue(
        clocksState({ show: show, session: session })
    );
    return clocks.get(id);
}
