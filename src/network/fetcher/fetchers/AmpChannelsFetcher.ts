import { sendCommand } from "../../../commands/SendCommand";
import { IFetcher } from "../IFetcher";

export interface AmpChannelInfo {
    id: string,
    displayName:string,
    address: string;
    port: number,
    framerate: number,
    channel?: string;
}

export const AmpChannelsFetcher: IFetcher<AmpChannelInfo[]> = {
    id: "amp.channels",
    fetch: async (show: string, session: string) => {
        const res = await sendCommand(
            {
                show: show,
                session: session
            },
            "amp.channel",
            {}
        );
        if (res.status === 200) {
            const json = await res.json() as any;
            return await json.message as AmpChannelInfo[];
        } else console.log(res);
        return [];
    }
};
