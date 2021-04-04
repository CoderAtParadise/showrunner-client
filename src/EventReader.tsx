import { createContext, useEffect, useState } from "react";

const serverurl = "http://localhost:3001";

export const Sync = (props: any) => {
    const [runsheet, setRunsheet] = useState();
    const [current, setCurrent] = useState();
    const [tracking, setTracking] = useState();
    useEffect(() => {
        const syncSource: EventSource = new EventSource(`${serverurl}/sync`);
        syncSource.addEventListener('runsheet', (e: any) => {
            console.log(e.data);
        });
        syncSource.addEventListener('current', (e: any) => {
            console.log(e.data);
        });
        syncSource.addEventListener('tracking', (e: any) => {

        });
    });

    return <div>{props.children} </div>
}

/*export default class EventReader extends Component {
    eventSource: EventSource = new EventSource(`${serverurl}/sync`);
    clockSource: EventSource = new EventSource(`${serverurl}/clock`);

    componentDidMount(): void {

        this.clockSource.addEventListener("clock",(e:any) => {
            setClock(parse(e.data));
        });
        this.eventSource.addEventListener("runsheet", (e:any) => {
            console.log(e.data);
        });
        this.eventSource.addEventListener("current",(e:any) => {console.log(e.data);});
        this.eventSource.addEventListener("tracking",(e:any) => {console.log(e.data);});
    }

    render() {
        return <div id="event-reader"></div>;
    }
}*/