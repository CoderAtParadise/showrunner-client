import { useRecoilValue } from "recoil";
import { clocksState } from "../components/Sync/Clocks";

export function useClock(source: string) {
    const [show, id] = source.split(":");
    const clocks = useRecoilValue(clocksState(show));
    return clocks.get(id);
}
