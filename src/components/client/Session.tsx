import { TrackingSession } from "../common/Tracking";
import { Nested, Storage, get } from "../common/Storage";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { Fragment, useContext, useState } from "react";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
//import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  equals,
  add,
  subtract,
  INVALID as INVALID_POINT,
  stringify,
} from "../common/Time";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Bracket from "./Bracket";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Switch from "@material-ui/core/Switch";
import { SyncContext } from "./SyncSource";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import NotesIcon from "@material-ui/icons/Notes";
import Tooltip from "@material-ui/core/Tooltip";
import SendCommand from "./SendCommand";
import EditDialog from "./EditDialog";
import AddDialog from "./AddDialog";
import DeleteDialog from "./DeleteDialog";

const Session = (props: {
  session: TrackingSession;
  storage: Storage;
  active: boolean;
}) => {
  const sync = useContext(SyncContext);
  const tparent = props.session.trackers.get(sync.current.active)?.parent;
  const [open, setOpen] = useState(props.active);
  const startTime = equals(props.session.timer.start, INVALID_POINT)
    ? props.session.startTime
    : props.session.timer.start;
  const endTime = equals(props.session.timer.start, INVALID_POINT)
    ? add(startTime, props.session.settings.duration)
    : props.session.timer.end;
  const ss = (props.storage as unknown) as Nested;
  let timeoffset = startTime;
  return (
    <Fragment>
      <TableRow>
        <TableCell align="center" style={{ width: "5%" }}>
          <IconButton onClick={() =>setOpen(!open)}>
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
        {stringify(props.session.startTime)}  {props.storage.display}
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
                SendCommand("goto", props.session.session_id, "start");
              }}
            >
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={!props.session.disabled ? "Disable" : "Enable"}>
            <Switch
              onClick={() => {
                SendCommand(
                  "disable",
                  props.session.session_id,
                  ""
                );
              }}
              name="disabled"
              aria-label={!props.session.disabled ? "disable" : "enable"}
              checked={!props.session.disabled}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>
          <EditDialog session={props.session.session_id} edit={props.storage.tracking} />
          <AddDialog parent={props.session.tracking_id} />
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
        key={`${props.session.session_id}_${props.session.tracking_id}-nested`}
      >
        <TableCell colSpan={11} style={{ padding: 0 }}>
          <Collapse in={open} >
            <Table size="small" aria-label="brackets">
              <TableBody>
                {ss.index.map((key: string) => {
                  const bs = get(ss, key);
                  const cTi = timeoffset;
                  const tracking = props.session.trackers.get(key);
                  const active =
                    props.session.session_id === sync.current.session &&
                    tparent &&
                    tparent === key
                      ? true
                      : false;
                  if (tracking) {
                    timeoffset = add(timeoffset, tracking.settings.duration);
                    return (
                      <Bracket
                        key = {`${props.session.session_id}_${tracking.tracking_id}`}
                        session={props.session}
                        timeOffset={cTi}
                        storage={bs}
                        tracker={tracking}
                        active={active}
                      />
                    );
                  }
                  return <Fragment></Fragment>;
                })}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default Session;
