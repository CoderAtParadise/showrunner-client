import ClockSource from "../common/ClockSource";
import Runsheet from "../common/Runsheet";
import RunsheetHandler from "../common/RunsheetHandler";
import TrackingShow from "../common/TrackingShow";
import Show from "../common/Show";
import Storage, { Type } from "../common/Storage";

export interface ClientRunsheetData {
  runsheet: Runsheet | undefined;
  tracking: Map<string, TrackingShow>;
  clocks: Map<string, ClockSource>;
}

class ClientRunsheet implements RunsheetHandler {
  data: ClientRunsheetData;
  constructor(data: ClientRunsheetData) {
    this.data = data;
  }

  setRunsheet(runsheet:Runsheet) : void {
      //NOOP
  }

  dirty(): boolean {
    return true;
  }

  markDirty(): void {
    //NOOP
  }

  hasLoadedRunsheet(): boolean {
    return this.data.runsheet !== undefined;
  }

  getClock(id: string): ClockSource | undefined {
    return this.data.clocks.get(id);
  }

  addClock(clock: ClockSource): void {
    //NOOP
  }

  getShow(id: string): Show | undefined {
    return this.data.runsheet?.shows.get(id);
  }

  addShow(show: Show): void {
    //Implement
  }

  deleteShow(id: string): void {
    //Implement
  }

  showList(): string[] {
    if (this.data.runsheet) return Array.from(this.data.runsheet.shows.keys());
    return [];
  }

  activeShow() : string {
    return "";
  }

  setActiveShow(id:string) : void {
    //IMPLEMENT
  }

  getTrackingShow(id:string): TrackingShow | undefined {
      return this.data.tracking.get(id);
  }

  addTrackingShow(trackingShow:TrackingShow): void {
      //NOOP
  }
  
  deleteTrackingShow(id:string) : void {
      //NOOP
  }

  sessionList(showId:string) : string[] {
    const show = this.getShow(showId);
        const sessions: string[] = [];
        if (show) {
          show.tracking_list.forEach((id: string) => {
            const storage = this.getStorage(id);
            if (storage) {
              if (storage.type === Type.SESSION) sessions.push(storage.id);
            }
          });
        }
        return sessions;
  }

  getStorage(id:string) : Storage<any> | undefined {
      return this.data.runsheet?.defaults.get(id);
  }

  addStorage(storage:Storage<any>) : void {
      //Implement
  }

  deleteStorage(id:string) : void {
      //Implement
  }
}

export default ClientRunsheet;