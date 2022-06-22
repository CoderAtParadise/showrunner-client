import { IWidget, IWidgetRenderer } from "../components/widget/IWidget";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { ReactNode, useEffect, useState } from "react";
import {
  PlayArrow,
  Pause as PauseIcon,
  Stop as StopIcon,
  RestartAlt,
  PriorityHighRounded,
} from "@mui/icons-material";
import {
  SMPTE,
  Offset,
  ClockStatus,
} from "@coderatparadise/showrunner-common";
import { useClock } from "../hooks/useClock";
import { ClockSourceComponent } from "../components/ClockSourceComponent";
import { clocksState } from "../network/sync/Clocks";
import { ConfigurableType } from "../components/config/IConfigurable";
import { ConfigBuilder } from "../components/config/ConfigBuilder";
import { getRecoil } from "recoil-nexus";
import { StateStorageWatcher } from "../components/config/StateStorageWatcher";
import { isEqual } from "lodash";
import { sendCommand } from "../commands/SendCommand";
import { diffObject } from "../util/Diffobject";
import { fetched, useFetcher } from "../network/fetcher/Fetcher";
import {
  AmpChannelInfo,
  AmpChannelsFetcher,
} from "../network/fetcher/fetchers/AmpChannelsFetcher";
import { AmpChannelVideoFetcher } from "../network/fetcher/fetchers/AmpChannelVideoFetcher";
import { RenderClockSource } from "../util/RenderClockSource";
import { Tooltip } from "../components/tooltip/Tooltip";
import { TooltipContent } from "../components/tooltip/TooltipContent";
import { TooltipHoverable } from "../components/tooltip/TooltipHoverable";

const blink = keyframes`
    50% {
        opacity:0;
    }
`;

const Container = styled.div`
  position: relative;
`;
const ClockName = styled.div<{ widgetStyle: {} }>``;
const DisplayTime = styled(ClockSourceComponent)<{
  paused: boolean;
  overrun: boolean;
  widgetStyle: {
    flashPaused: boolean;
    overrunColor: string;
    color: string;
    fontSize: string;
  };
}>`
  font-weight: bold;
  font-size: ${(props: { widgetStyle: { fontSize: string } }) =>
    props.widgetStyle.fontSize};
  font-variant-numeric: tabular-nums;
  user-select: none;
  color: ${(props: {
    overrun: boolean;
    widgetStyle: { overrunColor: string; color: string };
  }) =>
    props.overrun ? props.widgetStyle.overrunColor : props.widgetStyle.color};
  animation: ${(props: {
    paused: boolean;
    widgetStyle: { flashPaused: boolean };
  }) =>
    props.widgetStyle.flashPaused &&
    props.paused &&
    css`
      ${blink} 1s linear infinite
    `};
`;

const PlayButton = styled(PlayArrow)`
  width: 1.2em;
  height: 1.2em;
  &:hover {
    color: rgb(200, 200, 200);
  }
`;

const PauseButton = PlayButton.withComponent(PauseIcon);
const StopButton = PlayButton.withComponent(StopIcon);
const ResetButton = PlayButton.withComponent(RestartAlt);

const ControlBarButton = styled(Tooltip)`
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ControlBarButtonTooltip = styled(TooltipContent)`
  top: -125%;
  left: 50%;
`;

const IncorrectFramerateTooltip = styled(Tooltip)`
  width: 1.6em;
  height: 1.6em;
  position: absolute;
  left: 0.5px;
  top: 70%;
`;
const IncorrectFramerateHoverable = styled(TooltipHoverable)`
  border: solid;
  border-radius: 50%;
  border-color: red;
  align-items: center;
  justify-content: center;
`;
const IncorrectFramerateContent = styled(TooltipContent)`
  top: -120%;
`;

const IncorrectFramerateIcon = styled(PriorityHighRounded)`
  color: red;
  width: 0.8em;
  height: 0.8em;
`;

const renderControlBar = (props: {
  className?: string;
  show: string;
  session: string;
  clock: RenderClockSource | null;
}) => {
  return (
    <div className={props.className}>
      {props.clock?.status() === ClockStatus.RUNNING ? (
        <ControlBarButton>
          <TooltipHoverable onClick={() => props.clock?.pause()}>
            <PauseButton />
          </TooltipHoverable>
          <ControlBarButtonTooltip>Pause</ControlBarButtonTooltip>
        </ControlBarButton>
      ) : (
        <ControlBarButton>
          <TooltipHoverable onClick={() => props.clock?.play()}>
            <PlayButton />
          </TooltipHoverable>
          <ControlBarButtonTooltip>Play</ControlBarButtonTooltip>
        </ControlBarButton>
      )}
      <ControlBarButton>
        <TooltipHoverable onClick={() => props.clock?.stop()}>
          <StopButton />
        </TooltipHoverable>
        <ControlBarButtonTooltip>Stop</ControlBarButtonTooltip>
      </ControlBarButton>
      <ControlBarButton>
        <TooltipHoverable onClick={() => props.clock?.reset()}>
          <ResetButton />
        </TooltipHoverable>
        <ControlBarButtonTooltip>Reset</ControlBarButtonTooltip>
      </ControlBarButton>
    </div>
  );
};

const ControlBar = styled(renderControlBar)`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  justify-content: center;
  gap: 1.5em;
`;

const ClockDisplayContainer = (props: {
  builder: ConfigBuilder;
  forceUpdate: () => void;
}) => {
  const clock = useClock(props.builder.get("display.source")?.get() || "");
  const [config, setConfig] = useState({
    settings: clock?.settings,
  } as any);
  props.builder.addStorageWatcher(
    "clock",
    new StateStorageWatcher(config, setConfig, props.forceUpdate)
  );
  const [initialLoad, setInitialLoad] = useState(true);
  const [originalSettings, setOriginalSettings] = useState(clock?.settings);
  // this is used to force an update we don't actually read it anywhere
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dummy, setDummy] = useState(false);
  useFetcher(props.builder.show, props.builder.session, AmpChannelsFetcher);
  useFetcher(props.builder.show, props.builder.session, AmpChannelVideoFetcher);
  if (!isEqual(originalSettings, clock?.settings)) {
    setConfig({ settings: clock?.settings });
    setOriginalSettings(clock?.settings);
  }

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      props.builder.listen("settings.clock", () => {
        setDummy((prevState) => !prevState);
        return () => {};
      });
      return;
    }
    if (!isEqual(config.settings, clock?.settings)) {
      const delayChange = setTimeout(() => {
        const diff = diffObject(clock?.settings, config.settings);
        sendCommand(
          {
            show: props.builder.show,
            session: props.builder.session,
          },
          "clock.edit",
          { id: clock?.identifier.id, data: diff }
        ).then();
      }, 500);
      return () => clearTimeout(delayChange);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  return (
    <Container>
      {clock?.hasIncorrectFrameRate() ? (
        <IncorrectFramerateTooltip>
          <IncorrectFramerateHoverable>
            <IncorrectFramerateIcon />
          </IncorrectFramerateHoverable>
          <IncorrectFramerateContent>
            <span>The source is in a framerate not</span>
            <br />
            <span>compatible with current settings</span>
          </IncorrectFramerateContent>
        </IncorrectFramerateTooltip>
      ) : null}
      {props.builder.get("display.clockName")?.get() ? (
        <ClockName widgetStyle={props.builder.raw("display")}>
          {clock?.displayName!()}
        </ClockName>
      ) : null}
      <DisplayTime
        paused={clock?.status() === ClockStatus.PAUSED}
        overrun={clock?.isOverrun() || false}
        widgetStyle={props.builder.raw("display")}
        clock={clock || null}
      />
      {props.builder.get("display.controlBar")?.get() ? (
        <ControlBar
          show={props.builder.show}
          session={props.builder.session}
          clock={clock || null}
        />
      ) : null}
    </Container>
  );
};

const WidgetClockCompactRenderer: IWidgetRenderer = {
  render: (props: {
    config: ConfigBuilder;
    forceUpdate: () => void;
  }): ReactNode => {
    // Wrap because of hook constraints
    return (
      <ClockDisplayContainer
        builder={props.config}
        forceUpdate={props.forceUpdate}
      />
    );
  },
};

const WidgetClock: IWidget = {
  renderMode: {
    compact: WidgetClockCompactRenderer,
    default: WidgetClockCompactRenderer,
  },
  config: [
    {
      type: ConfigurableType.Options,
      category: "clock",
      displayName: "Source",
      group: "display",
      key: "source",
      Options: (builder: ConfigBuilder) => {
        const clocks = getRecoil(
          clocksState({
            show: builder.show,
            session: builder.session,
          })
        );
        const ret: { label: string; id: string }[] = [];
        Array.from(clocks.values()).forEach((clock) =>
          ret.push({
            label: clock.displayName!(),
            id: `${builder.show}:${builder.session}:${clock.identifier.id}`,
          })
        );
        return ret;
      },
    },
    {
      type: ConfigurableType.Swatch,
      category: "clock",
      displayName: "Colour",
      group: "display",
      key: "color",
    },
    {
      type: ConfigurableType.Swatch,
      category: "clock",
      displayName: "Overrun Colour",
      group: "display",
      key: "overrunColor",
    },
    {
      type: ConfigurableType.Text,
      category: "clock",
      displayName: "Font Size",
      group: "display",
      key: "fontSize",
    },
    {
      type: ConfigurableType.Boolean,
      category: "clock",
      displayName: "Flash When Paused",
      group: "display",
      key: "flashPaused",
    },
    {
      type: ConfigurableType.Boolean,
      category: "clock",
      displayName: "Show Name",
      group: "display",
      key: "clockName",
    },
    {
      type: ConfigurableType.Boolean,
      category: "clock",
      displayName: "Show Control Bar",
      group: "display",
      key: "controlBar",
    },
    {
      type: ConfigurableType.Dropdown,
      category: "clock",
      displayName: "Behaviour",
      group: "settings",
      key: "behaviour",
      storage: "clock",
      Enabled: (builder: ConfigBuilder) => {
        return builder.get("settings.behaviour")?.get() !== undefined;
      },
      Options: () => {
        return [
          { id: "stop", label: "Stop" },
          { id: "overrun", label: "Overrun" },
        ];
      },
    },
    {
      type: ConfigurableType.Dropdown,
      category: "clock",
      displayName: "Channel",
      group: "settings",
      key: "channel",
      storage: "clock",
      Options: (builder: ConfigBuilder): { label: string; id: string }[] => {
        const channels = getRecoil(
          fetched({ show: builder.show, session: builder.session })
        ).get("amp.channels");
        const options: { label: string; id: string }[] = [];
        if (channels !== undefined) {
          (channels as AmpChannelInfo[]).forEach((v) => {
            options.push({ label: v.displayName, id: v.id });
          });
        }
        return options;
      },
      Enabled: (builder: ConfigBuilder) => {
        return builder.get("settings.channel")?.get() !== undefined;
      },
    },
    {
      type: ConfigurableType.Options,
      category: "clock",
      displayName: "Authority",
      group: "settings",
      key: "authority",
      storage: "clock",
      Options: (builder: ConfigBuilder) => {
        const clocks = getRecoil(
          clocksState({
            show: builder.show,
            session: builder.session,
          })
        );
        const ret: { label: string; id: string }[] = [];
        Array.from(clocks.values())
          .filter((clock) => {
            return (
              clock.type !== "offset" &&
              clock.type !== "offset:tod" &&
              clock.type !== "sync"
            );
          })
          .forEach((clock) =>
            ret.push({
              label: clock.displayName!(),
              id: `${clock.identifier.show}:${clock.identifier.session}:${clock.identifier.id}`,
            })
          );
        return ret;
      },
      Enabled: (builder: ConfigBuilder) => {
        return builder.get("settings.authority")?.get() !== undefined;
      },
    },
    {
      type: ConfigurableType.Options,
      category: "clock",
      displayName: "Video Source",
      group: "settings",
      key: "source",
      storage: "clock",
      Options: (builder: ConfigBuilder) => {
        const channel: string = builder.get("settings.channel")?.get() || "";
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
      Enabled: (builder: ConfigBuilder) => {
        return builder.get("settings.source")?.get() !== undefined;
      },
    },
    {
      type: ConfigurableType.Dropdown,
      category: "clock",
      displayName: "Direction",
      group: "settings",
      key: "direction",
      storage: "clock",
      Enabled: (builder: ConfigBuilder) => {
        return builder.get("settings.direction")?.get() !== undefined;
      },
      Options: () => {
        return [
          { id: "countup", label: "Count Up" },
          { id: "countdown", label: "Count Down" },
        ];
      },
    },
    {
      type: ConfigurableType.Time,
      category: "clock",
      displayName: "Time",
      group: "settings",
      key: "time",
      storage: "clock",
      Enabled: (config: ConfigBuilder) => {
        return (
          config.get("settings.time")?.get() !== undefined &&
          new SMPTE(config.get("settings.time")?.get()).offset() === Offset.NONE
        );
      },
    },
    {
      type: ConfigurableType.Time,
      category: "clock",
      displayName: "Time",
      group: "settings",
      key: "time",
      storage: "clock",
      Options: () => [{ id: "offset", label: "" }],
      Enabled: (config: ConfigBuilder) => {
        return (
          config.get("settings.time")?.get() !== undefined &&
          new SMPTE(config.get("settings.time")?.get()).offset() !== Offset.NONE
        );
      },
    },
    {
      type: ConfigurableType.Text,
      category: "clock",
      displayName: "Clock Name",
      group: "settings",
      key: "displayName",
      storage: "clock",
      Enabled: (config: ConfigBuilder) => {
        return config.get("settings.displayName")?.get() !== undefined;
      },
    },
  ],
};

export default WidgetClock;
