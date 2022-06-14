import { getRecoil } from "recoil-nexus";
import { sendCommand } from "../../../commands/SendCommand";
import { fetched } from "../Fetcher";
import { IFetcher } from "../IFetcher";

export const AmpChannelVideoFetcher: IFetcher<Map<string, string[]>> = {
  id: "amp.videos",
  fetch: async (show: string, session: string) => {
    const channels = getRecoil(fetched({ show: show, session: session })).get(
      "amp.channels"
    );
    const ret: Map<string, string[]> = new Map<string, string[]>();
    if (channels !== undefined) {
      for await (const channel of channels) {
        const res = await sendCommand(
          { show: show, session: session },
          "amp.list",
          {
            channel: channel.id,
          }
        );
        const json = (await res.json()) as any;
        ret.set(channel, (await json.message) as string[]);
      }
      return ret;
    }
    return new Map<string, string[]>();
  },
};
