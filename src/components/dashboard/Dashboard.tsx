import { SnapMode } from "@coderatparadise/showrunner-common";
import "./Dashboard.css";
import { DashboardSegment } from "./DashboardSegment";

export const Dashboard = (props: { id: string,edit?:boolean }) => {
  return (
    <div className="dashboard">
      <DashboardSegment
        edit={props.edit}
        segment={{
          id: "test",
          transform: {
            snapMode: SnapMode.RESIZE,
            dimensions: { width: 6, height: 5 },
            position: { x: 120, y: 120 },
          },
          widgets: [
            {
              id: "test",
              widget: "test-widget",
              transform: {
                snapMode: SnapMode.SNAP,
                dimensions: { width: 1, height: 1 },
                position: { x: 1, y: 1 },
              },
              settings: {},
            },
          ],
        }}
      />
    </div>
  );
};
