import styled from "@emotion/styled";
import { Add, CloseRounded } from "@mui/icons-material";
import { Fragment, useMemo, useState } from "react";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { Tooltip, TooltipContent, TooltipHoverable } from "../tooltip";
import { StateStorageWatcher } from "../config/StateStorageWatcher";
import { ConfigValue } from "../config/ConfigValue";
import { Scrollable } from "../Scrollable";
import { ConfigurableType, IConfigurable } from "../config/IConfigurable";
import { Offset } from "@coderatparadise/showrunner-common";
import { Create } from "../../commands/Clock";
import { fetched, useFetcher } from "../fetcher/Fetcher";
import { AmpChannelsFetcher } from "../fetcher/fetchers/AmpChannelsFetcher";
import { getRecoil } from "recoil-nexus";
import { AmpChannelVideoFetcher } from "../fetcher/fetchers/AmpChannelVideoFetcher";
import { clocksState } from "../Sync/Clocks";

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgb(200, 200, 200);
  z-index: 2;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  height: 5%;
  border-bottom: solid;
  border-color: rgb(150, 150, 150);
  align-items: center;
  display: inline-block;
  flex-direction: row;
`;

const ConfigContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 95%;
  width: 100%;
`;

const Configure = styled.div`
  width: 70%;
  height: 100%;
  margin: 5px;
  font-size: 1.2em;
`;

const Menu = styled.div`
  width: 40em;
  height: 40em;
  background-color: rgb(54, 54, 54);
  border: solid;
  position: relative;
  border-radius: 3px;
  border-color: rgb(150, 150, 150);
`;

const Title = styled.div`
  margin-top: 0.5em;
  margin-left: 5px;
  font-weight: bold;
  width: 50%;
  text-align: left;
`;

const CloseTooltip = styled(Tooltip)`
  position: absolute;
  float: right;
  top: 0.2em;
  right: 0.2em;
`;

const CreateTooltip = styled(Tooltip)`
  position: absolute;
  float: right;
  right: 3em;
  top: 0.5em;
  padding-right: 1.5em;
`;

const CloseButton = styled(CloseRounded)`
  width: 0.8em;
  height: 0.8em;
  color: rgb(255, 255, 255);
  &:hover {
    color: rgb(200, 200, 200);
  }
`;

const CloseButtonTooltipContent = styled(TooltipContent)`
  top: -100%;
  left: 125%;
`;

const Br = styled.p`
  font-size: 50%;
`;

const Error = styled.p`
  color: red;
  font-style: italic;
`;

const TimerClockFilter = [
  "group:create_clock_base",
  "group:create_clock_behaviour",
  "group:create_clock_direction",
  "group:create_clock_time",
  "group:create_clock_button",
];
const OffsetClockFilter = [
  "group:create_clock_base",
  "group:create_clock_authority",
  "group:create_clock_behaviour",
  "group:create_clock_direction",
  "group:create_clock_time_offset",
  "group:create_clock_button",
];
const TODClockFilter = [
  "group:create_clock_base",
  "group:create_clock_behaviour",
  "group:create_clock_time",
  "group:create_clock_button",
];

function validateBase(obj: any) {
  return (
    obj.type !== undefined &&
    obj.displayName !== undefined &&
    obj.displayName !== ""
  );
}

function validateBehaviour(obj: any) {
  return obj.behaviour !== undefined;
}

function validateDirection(obj: any) {
  return obj.direction !== undefined;
}

function validateTime(obj: any, isTod?: boolean) {
  return obj.time !== undefined && (isTod ? true : obj.time !== "00:00:00:00");
}

function validateAuthority(obj: any) {
  return obj.authority !== undefined;
}

function validateTimerSettings(obj: any) {
  return (
    validateBase(obj) &&
    validateBehaviour(obj) &&
    validateDirection(obj) &&
    validateTime(obj)
  );
}

function validateChannel(obj: any) {
  return obj.channel !== undefined;
}

function validateSource(obj: any) {
  return obj.source !== undefined;
}

function validateVideoSettings(obj: any) {
  return (
    validateBase(obj) &&
    validateDirection(obj) &&
    validateChannel(obj) &&
    validateSource(obj)
  );
}

function validateOffsetSettings(obj: any) {
  return (
    validateBase(obj) &&
    validateAuthority(obj) &&
    validateBehaviour(obj) &&
    validateDirection(obj) &&
    validateTime(obj)
  );
}

function validateTODSettings(obj: any) {
  return validateBase(obj) && validateBehaviour(obj) && validateTime(obj, true);
}

const creator: IConfigurable[] = [
  {
    type: ConfigurableType.Dropdown,
    category: "create:clock",
    displayName: "Clock Type",
    group: "create_clock_base",
    key: "type",
    defaultValue: "timer",
    Options: () => {
      return [
        { label: "Timer", id: "timer" },
        { label: "Offset", id: "offset" },
        { label: "Time of Day", id: "tod" },
      ];
    },
  },
  {
    type: ConfigurableType.Text,
    category: "create:clock",
    displayName: "Clock Name",
    group: "create_clock_base",
    key: "displayName",
  },
  {
    type: ConfigurableType.Options,
    category: "create:clock",
    displayName: "Authority",
    group: "create_clock_authority",
    key: "authority",
    Options: (builder: ConfigBuilder) => {
      const clocks = getRecoil(
        clocksState({
          show: builder.show,
          session: builder.session,
        })
      );
      const ret: { label: string; id: string }[] = [];
      Array.from(clocks.values())
        .filter(
          (clock) =>
            clock.type !== "offset" &&
            clock.type !== "offset:tod" &&
            clock.type !== "sync"
        )
        .forEach((clock) =>
          ret.push({
            label: clock.displayName!(),
            id: `${builder.show}:${builder.session}:${clock.identifier.id}`,
          })
        );
      return ret;
    },
  },
  {
    type: ConfigurableType.Dropdown,
    category: "create:clock",
    displayName: "Offset",
    group: "create_clock_offset",
    key: "offset",
    Options: () => {
      return [
        { label: "Start", id: Offset.START },
        { label: "End", id: Offset.END },
      ];
    },
  },
  {
    type: ConfigurableType.Time,
    category: "create:clock",
    displayName: "Time",
    group: "create_clock_time",
    key: "time",
  },
  {
    type: ConfigurableType.Time,
    category: "create:clock",
    displayName: "Time",
    group: "create_clock_time_offset",
    Options: () => [{ label: "", id: "offset" }],
    key: "time",
  },
  {
    type: ConfigurableType.Dropdown,
    category: "create:clock",
    displayName: "Behaviour",
    group: "create_clock_behaviour",
    key: "behaviour",
    defaultValue: "stop",
    Options: () => {
      return [
        { id: "stop", label: "Stop" },
        { id: "overrun", label: "Overrun" },
      ];
    },
  },
  {
    type: ConfigurableType.Dropdown,
    category: "create:clock",
    displayName: "Direction",
    group: "create_clock_direction",
    key: "direction",
    defaultValue: "countup",
    Options: () => {
      return [
        { id: "countup", label: "Count Up" },
        { id: "countdown", label: "Count Down" },
      ];
    },
  },
  {
    type: ConfigurableType.Dropdown,
    category: "create:clock",
    displayName: "Channel",
    group: "create_clock_channel",
    key: "channel",
    Options: (builder: ConfigBuilder) => {
      const channels = getRecoil(
        fetched({ show: builder.show, session: builder.session })
      ).get("amp.channels");
      const options: { label: string; id: string }[] = [];
      (channels as string[]).forEach((v) => {
        options.push({ label: v, id: v });
      });
      return options;
    },
  },
  {
    type: ConfigurableType.Options,
    category: "create:clock",
    displayName: "Source",
    group: "create_clock_source",
    key: "source",
    Options: (builder: ConfigBuilder) => {
      const channel: string =
        builder.get("create_clock_channel.channel")?.get() || "";
      const videos = getRecoil(
        fetched({ show: builder.show, session: builder.session })
      ).get("amp.videos");
      const options: { label: string; id: string }[] = [];
      (videos as Map<string, string[]>)
        .get(channel)
        ?.forEach((value: string) => {
          options.push({ label: value, id: value });
        });

      return options;
    },
  },
  {
    type: ConfigurableType.Button,
    category: "create:clock",
    displayName: "Create Clock",
    group: "create_clock_button",
    key: "create",
    onClick(builder: ConfigBuilder) {
      const storage = builder.getStorageWatcher("default").raw();
      let out: any = {};
      Object.values(storage as object).forEach((v: object) => {
        out = { ...out, ...v };
      });
      let error = false;
      switch (out.type) {
        case "timer":
          if (!validateTimerSettings(out)) {
            error = true;
          }
          break;
        case "offset":
          if (!validateOffsetSettings(out)) {
            error = true;
          }
          break;
        case "tod":
          if (!validateTODSettings(out)) {
            error = true;
          }
          break;
      }

      if (!error) {
        Create(
          { show: builder.show, session: builder.session },
          { owner: "", ...out }
        );
        return true;
      }
      return false;
    },
  },
  {
    type: ConfigurableType.Boolean,
    category: "error",
    displayName: "ERROR",
    group: "error",
    key: "error",
  },
];

const AddButton = styled(Add)`
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

export const CreateClockMenu = (props: {
  className?: string;
  show: string;
  session: string;
}) => {
  const [isOpen, setOpen] = useState(false);
  const [clockFilter, setClockFilter] = useState<string[]>(TimerClockFilter);
  const [config, setConfig] = useState({});
  useFetcher(props.show, props.session, AmpChannelsFetcher);
  useFetcher(props.show, props.session, AmpChannelVideoFetcher);
  const reset = () => {
    setOpen(false);
    setConfig({ create_clock_base: { type: "timer" } });
    setClockFilter(TimerClockFilter);
  };
  const builder = useMemo(() => {
    const b = new ConfigBuilder(
      props.show,
      props.session,
      new StateStorageWatcher(config, setConfig, () => {})
    );
    b.buildConfig(creator);
    b.listen(
      "create_clock_base.type",
      (prevState: string, newState: string) => {
        if (prevState !== newState) {
          switch (newState) {
            case "timer":
              setConfig({ create_clock_base: { type: "timer" } });
              setClockFilter(TimerClockFilter);
              break;
            case "offset":
              setConfig({
                create_clock_base: { type: "offset" },
              });
              setClockFilter(OffsetClockFilter);
              break;
            case "tod":
              setConfig({ create_clock_base: { type: "tod" } });
              setClockFilter(TODClockFilter);
              break;
          }
        }
      }
    );
    b.listen("create_clock_button.create", (_, newState: boolean) => {
      if (newState) reset();
    });
    return b;
  }, [config, props.session, props.show]);
  return (
    <>
      <CreateTooltip>
        <TooltipHoverable>
          <AddButton onClick={() => setOpen(!isOpen)} />
        </TooltipHoverable>
        <ButtonTooltipContent>Create Clock</ButtonTooltipContent>
      </CreateTooltip>
      {isOpen ? (
        <Background className={props.className} onClick={() => reset()}>
          <Menu onClick={(e) => e.stopPropagation()}>
            <Header>
              <CloseTooltip>
                <TooltipHoverable>
                  <CloseButton onClick={() => reset()} />
                </TooltipHoverable>
                <CloseButtonTooltipContent>Close</CloseButtonTooltipContent>
              </CloseTooltip>
              <Title>Create</Title>
            </Header>
            <ConfigContent>
              <Configure>
                <Scrollable>
                  {builder
                    .filter(clockFilter)
                    /* eslint-disable indent */
                    .map((value: ConfigValue<any>) => {
                      if (value.configurable.Enabled) {
                        return value.configurable.Enabled(builder) ? (
                          <Fragment key={`${value.configurable.group}:${value.configurable.key}`}>
                            {value.render(
                            )}
                            <Br />
                          </Fragment>
                        ) : null;
                      } else {
                        return (
                          <Fragment key={`${value.configurable.group}:${value.configurable.key}`}>
                            {value.render(
                            )}
                            <Br />
                          </Fragment>
                        );
                      }
                    })}
                  {/* eslint-enable indent */}
                  {builder.errors.map((error: string) => (
                    <Error>*{error}*</Error>
                  ))}
                </Scrollable>
              </Configure>
            </ConfigContent>
          </Menu>
        </Background>
      ) : null}
    </>
  );
};
