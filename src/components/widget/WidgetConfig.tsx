import { useEffect, useState } from "react";
import { Settings } from "@mui/icons-material";
import styled from "@emotion/styled";
import { ConfigBuilder } from "../config/ConfigBuilder";
import { ConfigMenu } from "../menu/ConfigMenu";
import { useRecoilValue } from "recoil";
import { fetched } from "../../network/fetcher/Fetcher";
import { TooltipContent } from "../tooltip/TooltipContent";
import { Tooltip } from "../tooltip/Tooltip";
import { TooltipHoverable } from "../tooltip/TooltipHoverable";

const SettingsButton = styled(Settings)`
  width: 0.8em;
  height: 0.8em;
  color: rgb(255, 255, 255);
  &:hover {
    color: rgb(200, 200, 200);
  }
`;

const SettingsTooltip = styled(Tooltip)`
  width: 1.6em;
  height: 1.6em;
  float: right;
  position: absolute;
  right: 0.2em;
  top: 0.2em;
`;

const ButtonTooltipContent = styled(TooltipContent)`
  left: 100%;
  top: -100%;
`;

export const WidgetConfig = (props: {
  className?: string;
  config: ConfigBuilder;
}) => {
  const [isOpen, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, markDirty] = useState({ dummy: false });
  const _fetched = useRecoilValue(
    fetched({ show: props.config.show, session: props.config.session })
  );

  useEffect(() => {
    markDirty((prevState) => ({ dummy: !prevState.dummy }));
  }, [_fetched]);

  useEffect(() => {
    props.config.listen("*", () => {
      markDirty((prevState) => ({ dummy: !prevState.dummy }));
    });
    return () => {};
  }, []);
  return (
    <>
      <SettingsTooltip>
        <TooltipHoverable onClick={() => setOpen(!isOpen)}>
          <SettingsButton />
        </TooltipHoverable>
        <ButtonTooltipContent>Configure</ButtonTooltipContent>
      </SettingsTooltip>
      <ConfigMenu
        isOpen={isOpen}
        setOpen={setOpen}
        config={props.config}
        menuTitle={props.config.get("widget.displayName")?.get() || ""}
      />
    </>
  );
};
