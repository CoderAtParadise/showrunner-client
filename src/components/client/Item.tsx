import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Storage } from "../common/Storage";
import { Tracker, TrackingSession } from "../common/Tracking";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Point, add, subtract, stringify } from "../common/Time";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Switch from "@material-ui/core/Switch";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import NotesIcon from "@material-ui/icons/Notes";
import Tooltip from "@material-ui/core/Tooltip";
import EditDialog from "./EditDialog";
import sendCommand from "./SendCommand";
import NewDialog from "./NewDialog";
import DeleteDialog from "./DeleteDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#CB1BF7",
    },
  })
);

const Item = (props: {
  session: TrackingSession;
  timeOffset: Point;
  storage: Storage;
  tracking: Tracker;
  active: boolean;
}) => {
  const classes = useStyles();
  const startTime =
    props.tracking.index !== -1
      ? props.tracking.timers[props.tracking.index].start
      : props.timeOffset;
  const endTime =
    props.tracking.index !== -1
      ? props.tracking.timers[props.tracking.index].end
      : add(props.timeOffset, props.tracking.settings.duration);
  return (
    <TableRow
      key={`${props.session.session_id}-${props.tracking.tracking_id}`}
      classes={classes}
    >
      <TableCell align="center" style={{ width: "5%" }}>
        {props.active ? (
          <PlayArrowIcon style={{ fill: "lawngreen" }} />
        ) : (
          <ArrowRightIcon />
        )}
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        {stringify(startTime)}
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        {stringify(endTime)}
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        {stringify(subtract(endTime, startTime))}
      </TableCell>
      <TableCell align="center" style={{ width: "35%" }}>
        {props.storage.display}
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        <IconButton>
          <NotesIcon />
        </IconButton>
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        {props.storage.timer.display}
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        {props.storage.timer.behaviour}
      </TableCell>
      <TableCell align="center" style={{ width: "15%" }}>
        <Tooltip title="Go">
          <IconButton
            onClick={() => {
              sendCommand(
                "goto",
                props.session.session_id,
                props.tracking.tracking_id
              );
            }}
          >
            <ExitToAppIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={!props.storage.disabled ? "Disable" : "Enable"}>
          <Switch
            onClick={() => {
              sendCommand(
                "disable",
                props.session.session_id,
                props.tracking.tracking_id
              );
            }}
            name="disabled"
            checked={!props.storage.disabled}
          />
        </Tooltip>
      </TableCell>
      <TableCell align="center" style={{ width: "15%" }}>
      <Tooltip title="New">
        <EditDialog edit={props.storage.tracking}/>
        </Tooltip>
        <Tooltip title="New">
        <NewDialog/>
        </Tooltip>
        <Tooltip title="Delete">
          <DeleteDialog delete={props.storage.tracking}/>
        </Tooltip>
      </TableCell>
      <TableCell align="center" style={{ width: "5%" }}>
        <DragIndicatorIcon />
      </TableCell>
    </TableRow>
  );
};

export default Item;
