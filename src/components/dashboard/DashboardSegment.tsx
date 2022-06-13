import "./DashboardSegment.css";
import {
  IDashboardSegment,
  IWidgetLayout,
} from "@coderatparadise/showrunner-common";
import { CSSProperties, useState } from "react";
import { AutoComplete } from "../autocomplete/AutoComplete";

interface DashboardSegmentTransform extends CSSProperties {
  "--width": number;
  "--height": number;
  "--x": number;
  "--y": number;
}

export const DashboardSegment = (props: {
  segment: IDashboardSegment;
  edit?: boolean;
}) => {
  const [dvalue, setValue] = useState({ label: "Test", id: "test" });
  const style: DashboardSegmentTransform = {
    "--width": props.segment.transform.dimensions.width,
    "--height": props.segment.transform.dimensions.height,
    "--x": props.segment.transform.position.x,
    "--y": props.segment.transform.position.y,
  };
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
            <AutoComplete
              options={[
                { label: "Test", id: "test" },
                { label: "Test2", id: "test2" },
              ]}
              value={dvalue}
              onChange={(nvalue) => setValue(nvalue)}
              style={{ width: "12em" }}
            />
          </div>
        );
      })}
    </div>
  );
};
