import "./DashboardSegment.css";
import {
  IDashboardSegment,
  IWidgetLayout,
} from "@coderatparadise/showrunner-common";
import { CSSProperties, useState } from "react";
import { ConfigBuilder } from "../../config/ConfigBuilder";
import { ConfigurableType, IConfigurable, IConfigurableConstraint, UserMode } from "../../config/IConfigurable";
import { StateStorageWatcher } from "../../config/storage/StateStorageWatcher";
import { LooseObject } from "../../util/LooseObject";
import { IConfigValueRender } from "../../config/IConfigValueRender";
import { IConfigBuilder } from "../../config/IConfigBuilder";

interface DashboardSegmentTransform extends CSSProperties {
  "--width": number;
  "--height": number;
  "--x": number;
  "--y": number;
}
const config = {
  type: ConfigurableType.Time,
  displayName: "TestName",
  variant: "offset",
  userMode: UserMode.BASIC,
  identifier: { category: "test", group: "derp", key: "test" },
};
const configText: IConfigurable = {
  type: ConfigurableType.Dropdown,
  displayName: "TestName",
  userMode: UserMode.BASIC,
  identifier: { category: "test", group: "derp", key: "text" },
  constraints: (builder:IConfigBuilder): IConfigurableConstraint[] => {
    return [{id:"1",label:"one"},{id:"2",label:"one1"},{id:"3",label:"one2"},{id:"4",label:"one3"},{id:"5",label:"one4"},{id:"6",label:"one5"}]
  },
};

const configB = {
  type: ConfigurableType.Button,
  displayName: "TestName",
  userMode: UserMode.BASIC,
  identifier: { category: "test", group: "derp", key: "boolean" },
};

export const DashboardSegment = (props: {
  segment: IDashboardSegment;
  edit?: boolean;
}) => {
  const style: DashboardSegmentTransform = {
    "--width": props.segment.transform.dimensions.width,
    "--height": props.segment.transform.dimensions.height,
    "--x": props.segment.transform.position.x,
    "--y": props.segment.transform.position.y,
  };
  const [state, setState] = useState<LooseObject>({});
  const builder = new ConfigBuilder(
    "",
    "",
    new StateStorageWatcher(state, setState, () => {})
  );
  builder.buildConfig([config,configText,configB]);
  return (
    <div
      data-snap-mode={props.segment.transform.snapMode}
      data-edit={props.edit}
      className={"dashboard-segment"}
      style={style}
    >
      {props.segment.widgets.map((value: IWidgetLayout) => {
        return (
          <div key={value.id}>
            {(builder.get("derp.test") as IConfigValueRender<any>).render()}
            <p style={{fontSize: "50%"}}/>
            {(builder.get("derp.text") as IConfigValueRender<any>).render()}
            <p style={{fontSize: "50%"}}/>
            {(builder.get("derp.boolean") as IConfigValueRender<any>).render()}
          </div>
        );
      })}
    </div>
  );
};
