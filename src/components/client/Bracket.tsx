import { TrackingSession, Tracker } from "../common/Tracking";
import { Nested, Storage, get } from "../common/Storage";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Fragment, useContext, useState } from "react";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { add, stringify, subtract } from "../common/Time";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Item from "./Item";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Switch from "@material-ui/core/Switch";
import { SyncContext } from "./SyncSource";
import { Point } from "../common/Time";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import NotesIcon from "@material-ui/icons/Notes";
import Tooltip from "@material-ui/core/Tooltip";
import EditDialog from "./EditDialog";
import AddDialog from "./AddDialog";
import DeleteDialog from "./DeleteDialog";
import SendCommand from "./SendCommand";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "#2F69FF",
    },
  })
);

const Bracket = (props: {
  session: TrackingSession;
  tracker: Tracker;
  timeOffset: Point;
  storage: Storage;
  active: boolean;
}) => {
  const classes = useStyles();
  const sync = useContext(SyncContext);
  const tparent = props.session.trackers.get(sync.current.active);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const startTime =
    props.tracker.index !== -1
      ? props.tracker.timers[props.tracker.index].start
      : props.timeOffset;
  const endTime =
    props.tracker.index !== -1
      ? props.tracker.timers[props.tracker.index].end
      : add(props.timeOffset, props.tracker.settings.duration);
  const ss = (props.storage as unknown) as Nested;
  let timeoffset = props.timeOffset;
  return (
    <Fragment>
      <TableRow
        classes={classes}
      >
        <TableCell align="center" style={{ width: "5%" }}>
          <IconButton onClick={handleClick}>
            {open ? (
              <ExpandLess />
            ) : props.active ? (
              <PlayArrowIcon style={{ fill: "lawngreen" }} />
            ) : (
              <ExpandMore />
            )}
          </IconButton>
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
          {props.storage.timer.display.toUpperCase()}
        </TableCell>
        <TableCell align="center" style={{ width: "5%" }}>
          {props.storage.timer.behaviour.toUpperCase()}
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>
          <Tooltip title="Go">
            <IconButton
              onClick={() => {
                SendCommand(
                  "goto",
                  props.session.session_id,
                  props.tracker.tracking_id
                );
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={!props.storage.disabled ? "Disable" : "Enable"}>
            <Switch
              onClick={() => {
                SendCommand(
                  "disable",
                  props.session.session_id,
                  props.tracker.tracking_id
                );
              }}
              name="disabled"
              checked={!props.storage.disabled}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>
          <EditDialog
            session={props.session.session_id}
            edit={props.storage.tracking}
          />
          <AddDialog />
          <DeleteDialog
            session={props.session.session_id}
            delete={props.storage.tracking}
          />
        </TableCell>
        <TableCell align="center" style={{ width: "5%" }}>
          <DragIndicatorIcon />
        </TableCell>
      </TableRow>
      <TableRow
        key={`${props.session.session_id}_${props.tracker.tracking_id}-nested`}
      >
        <TableCell colSpan={11} style={{ padding: 0 }}>
          <Collapse in={open}>
            <Table size="small" aria-label="items">
              <TableBody>
                {ss.index.map((key: string) => {
                  const bs = get(ss, key);
                  const cTi = timeoffset;
                  const tracking = props.session.trackers.get(key);
                  const active =
                    props.session.session_id === sync.current.session &&
                    tparent &&
                    tparent.tracking_id === key
                      ? true
                      : false;
                  if (tracking) {
                    timeoffset = add(timeoffset, tracking.settings.duration);
                    return (
                      <Item
                        key = {`${props.session.session_id}_${tracking.tracking_id}`}
                        session={props.session}
                        timeOffset={cTi}
                        storage={bs}
                        tracking={tracking}
                        active={active}
                      />
                    );
                  } else return <Fragment></Fragment>;
                })}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default Bracket;
