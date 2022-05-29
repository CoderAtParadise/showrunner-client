import { sendCommand } from "../../../commands/SendCommand";
import { IFetcher } from "../IFetcher";

export const ServerSettingsFetcher: IFetcher<object> = {
    id: "server.settings",
    fetch: async (show: string, session: string) => {
        const res = await sendCommand(
            {
                show: show,
                session: session
            },
            "server.settings",
            {}
        );
        if (res.status === 200) {
            const json = await res.json() as any;
            return await json.message as object;
        } else console.log(res);
        return {};
    }
};