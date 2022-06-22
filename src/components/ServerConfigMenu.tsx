import styled from "@emotion/styled";
import { Settings } from "@mui/icons-material";
import { useEffect, useState, MouseEvent, useMemo } from "react";
import { ConfigBuilder } from "./config/ConfigBuilder";
import { fetched, useFetcher } from "../network/fetcher/Fetcher";
import { ConfigMenu } from "./menu/ConfigMenu";
import { ServerSettingsFetcher } from "../network/fetcher/fetchers/ServerSettingsFetcher";
import { LooseObject } from "../util/LooseObject";
import { FetcherStorageWatcher } from "./config/FetcherStorageWatcher";
import { ConfigurableType, UserMode } from "./config/IConfigurable";
import { useRecoilValue } from "recoil";
import { sendCommand } from "../commands/SendCommand";
import { RecoilStorageWatcher } from "./config/RecoilStorageWatcher";
import { clientSettingsState } from "./ClientConfig";
import { TooltipContent } from "./tooltip/TooltipContent";
import { Tooltip } from "./tooltip/Tooltip";
import { TooltipHoverable } from "./tooltip/TooltipHoverable";

const SettingsButton = styled(Settings)`
  width: 1.2em;
  height: 1.2em;
  color: rgb(255, 255, 255);
  &:hover {
    color: rgb(200, 200, 200);
    cursor: pointer;
  }
`;

const ButtonTooltipContent = styled(TooltipContent)`
  right: 150%;
  left: 75%;
  bottom: 150%;
`;

const SettingsTooltip = styled(Tooltip)`
  float: right;
  position: absolute;
  right: 1.5em;
  top: 0.5em;
`;

const configValues = [
  {
    type: ConfigurableType.Text,
    userMode: UserMode.ADVANCED,
    displayName: "Server Address",
    category: "settings",
    group: "client",
    key: "serverUrl",
    default: "test",
    Options: () => {
      return [
        { label: "Test", id: "test" },
        { label: "Test2", id: "test2" },
      ];
    },
  },
  {
    type: ConfigurableType.Dropdown,
    UserMode: UserMode.ADVANCED,
    displayName: "Test Dropdown",
    category: "settings",
    group: "client",
    key: "test",
  },
  {
    type: ConfigurableType.List,
    UserMode: UserMode.ADVANCED,
    displayName: "Amp Channels",
    category: "settings",
    group: "server",
    key: "ampChannels",
    storage: "server",
    onClick: (
      builder: ConfigBuilder,
      event: MouseEvent<HTMLButtonElement | HTMLDivElement>,
      id?: string,
      data?: any
    ) => {
      if (id === "remove") {
        sendCommand({ show: "system", session: "system" }, "amp.remove", {
          channel: data.selected,
        });
        return true;
      } else return false;
    },
    Enabled: () => false,
    Options: () => {
      return [
        { id: "name", label: "Name" },
        { id: "address", label: "Address" },
        { id: "port", label: "Port" },
        { id: "framerate", label: "Framerate" },
        { id: "channel", label: "Channel" },
      ];
    },
  },
];

const editChannel = [
  {
    type: ConfigurableType.Text,
    displayName: "Channel Name",
    category: "edit",
    group: "settings",
    key: "name.{i}",
  },
];

export const ServerConfigMenu = (props: { className?: string }) => {
  const [isOpen, setOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [clientConfig, setClientConfig] = useState<LooseObject>({
    client: {
      serverurl: "",
    },
  });
  useFetcher("system", "system", ServerSettingsFetcher);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, markDirty] = useState({ dummy: false });
  const _fetched = useRecoilValue(
    fetched({ show: "system", session: "system" })
  );
  const _clientSettings = useRecoilValue(clientSettingsState);
  useEffect(() => {
    markDirty((prevState) => ({ dummy: !prevState.dummy }));
  }, [_fetched, _clientSettings]);
  const b = useMemo(() => {
    const b = new ConfigBuilder(
      "system",
      "system",
      new RecoilStorageWatcher(clientSettingsState, () => {})
    );
    return b;
  }, []);
  b.addStorageWatcher(
    "server",
    new FetcherStorageWatcher(
      { show: "system", session: "system", key: "server.settings" },
      () => {}
    )
  );
  b.buildConfig(configValues);
  return (
    <>
      <SettingsTooltip>
        <TooltipHoverable onClick={() => setOpen(!isOpen)}>
          <SettingsButton />
        </TooltipHoverable>
        <ButtonTooltipContent>Settings</ButtonTooltipContent>
      </SettingsTooltip>
      <ConfigMenu
        config={b}
        isOpen={isOpen}
        setOpen={setOpen}
        menuTitle="Settings"
      />
    </>
  );
};
