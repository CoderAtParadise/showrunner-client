import { sendCommand } from "./SendCommand";

export const Start = (show: string, id: string) => {
    sendCommand("clock.play", { show: show, id: id });
};

export const Stop = (show: string, id: string) => {
    sendCommand("clock.stop", { show: show, id: id });
};

export const Pause = (show: string, id: string) => {
    sendCommand("clock.pause", { show: show, id: id });
};

export const Reset = (show: string, id: string) => {
    sendCommand("clock.reset", { show: show, id: id });
};

export const Create = (
    show: string,
    data: {
        owner: string;
        type: string;
        displayName: string;
        authority: string;
        time: string;
        behaviour: string;
        direction: string;
    }
) => {
    sendCommand("clock.create", { show: show, data: data });
};

export const Delete = (show: string, id: string) => {
    sendCommand("clock.delete", { show: show, id: id });
};

export const Edit = (show: string, id: string, data: any) => {
    sendCommand("clock.edit", { show: show, id: id, data: data });
};
