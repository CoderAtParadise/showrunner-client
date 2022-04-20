import { sendCommand } from "./SendCommand";

export const Start = (
    commandInfo: { show: string; session: string },
    id: string
) => {
    return sendCommand(commandInfo, "clock.play", { id: id });
};

export const Stop = (
    commandInfo: { show: string; session: string },
    id: string
) => {
    return sendCommand(commandInfo, "clock.stop", { id: id });
};

export const Pause = (
    commandInfo: { show: string; session: string },
    id: string
) => {
    return sendCommand(commandInfo, "clock.pause", { id: id });
};

export const Reset = (
    commandInfo: { show: string; session: string },
    id: string
) => {
    return sendCommand(commandInfo, "clock.reset", { id: id });
};

export const Create = (
    commandInfo: { show: string; session: string },
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
    return sendCommand(commandInfo, "clock.create", { data: data });
};

export const Delete = (
    commandInfo: { show: string; session: string },
    id: string
) => {
    return sendCommand(commandInfo, "clock.delete", { id: id });
};

export const Edit = (
    commandInfo: { show: string; session: string },
    id: string,
    data: any
) => {
    return sendCommand(commandInfo, "clock.edit", { id: id, data: data });
};
