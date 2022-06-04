import {getRecoil} from "recoil-nexus";
import { clientSettingsState } from "../components/ClientConfig";


export const sendCommand = async (
    commandInfo: { show: string; session: string },
    command: string,
    data: any
) => {
    const serverurl = getRecoil(clientSettingsState).client.serverUrl || "localhost:3001";
    if (!data) data = {};
    return await fetch(
        `http://${serverurl}/production/${commandInfo.show}/${commandInfo.session}/command`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command: command,
                data: data
            })
        }
    );
};
