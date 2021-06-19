import ClockSource from "../common/ClockSource"
import TimePoint from "../common/TimePoint"

export class ClientClock implements ClockSource {
    id:string;
    private value: TimePoint;
    
    constructor(id:string,value:TimePoint) {
        this.id = id;
        this.value = value;
    }

    clock(): TimePoint {
        return this.value;
    }

}

export default ClientClock;