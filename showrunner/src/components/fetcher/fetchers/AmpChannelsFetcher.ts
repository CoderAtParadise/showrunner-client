import { sendCommand } from "../../../commands/SendCommand";
import { IFetcher } from "../IFetcher";

export const AmpChannelsFetcher: IFetcher<string[]> = {
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
            return await json.message as string[];
        } else console.log(res);
        return [];
    }
};
