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
import { CurrentContext } from "./SyncSource";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteIcon from "@material-ui/icons/Delete";
import NotesIcon from "@material-ui/icons/Notes";
import Tooltip from "@material-ui/core/Tooltip";
import SendCommand from "./SendCommand";
import EditDialog from "./EditDialog";
import NewDialog from "./NewDialog";

const Session = (props: {
  session: TrackingSession;
  storage: Storage;
  active: boolean;
}) => {
  const current = useContext(CurrentContext);
  const tparent = props.session.trackers.get(current.active)?.parent;
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
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
      <TableRow
        key={`${props.session.session_id}-${props.session.tracking_id}`}
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
          {props.storage.timer.display}
        </TableCell>
        <TableCell align="center" style={{ width: "5%" }}>
          {props.storage.timer.behaviour}
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>
          <Tooltip title="Go">
            <IconButton onClick={() => { SendCommand("goto", props.session.session_id, "start") }}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={!props.storage.disabled ? "Disable" : "Enable"}>
            <Switch
              onClick={() => {
                SendCommand(
                  "disable",
                  props.session.session_id,
                  props.session.tracking_id
                );
              }}
              name="disabled"
              aria-label={!props.storage.disabled ? "disable" : "enable"}
              checked={!props.storage.disabled}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="center" style={{ width: "15%" }}>
          <EditDialog edit={props.storage.tracking}/>
          <NewDialog parent={props.session.tracking_id}/>
          <Tooltip title="Delete">
            <IconButton
              onClick={() => {
                SendCommand(
                  "delete",
                  props.session.session_id,
                  props.session.tracking_id
                );
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="center" style={{ width: "5%" }}>
          <DragIndicatorIcon />
        </TableCell>
      </TableRow>
      <TableRow
        key={`${props.session.session_id}-${props.session.tracking_id}-nested`}
      >
        <TableCell colSpan={11} style={{ padding: 0 }}>
          <Collapse in={open}>
            <Table size="small" aria-label="nested-brackets">
              <TableBody>
                {ss.index.map((key: string) => {
                  const bs = get(ss, key);
                  const cTi = timeoffset;
                  const tracking = props.session.trackers.get(key);
                  const active = tparent && tparent === key ? true : false;
                  if (tracking) {
                    timeoffset = add(timeoffset, tracking.settings.duration);
                    return (
                      <Bracket
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
