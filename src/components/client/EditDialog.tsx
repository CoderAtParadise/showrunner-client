import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { useState, Fragment } from "react";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import GetStorage from "./GetStorage";
import Button from "@material-ui/core/Button";
import { Display, Behaviour } from "../common/Timer";
import { stringify, parse } from "../common/Time";
import sendCommand from "./SendCommand";
import { Type } from "../common/Storage";
import { JSON as SJSON, SessionStorage } from "../common/Session";
import { BracketStorage, JSON as BJSON } from "../common/Bracket";
import { ItemStorage, JSON as IJSON } from "../common/Item";
const SDialog = styled(DialogContent)`
  width: 250px;
`;

const EditDialog = (props: { session: string; parent:string; edit: string }) => {
  const storage = GetStorage(props.session, props.edit);
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(storage.display);
  const [duration, setDuration] = useState(storage.timer.duration);
  const [type, setType] = useState(storage.timer.display);
  const [behaviour, setBehaviour] = useState(storage.timer.behaviour);
  return (
    <Fragment>
      <Tooltip title="Edit">
        <IconButton onClick={() => setOpen(true)}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle id="form-edit">Edit</DialogTitle>
        <SDialog>
          <TextField
            id="display"
            variant="outlined"
            label="Display"
            defaultValue={display}
            onChange={(event) => setDisplay(event.target.value)}
            placeholder="Display"
          />
          <br />
          <br />
          <TextField
            id="duration"
            label="Duration"
            defaultValue={stringify(duration)}
            placeholder="hh:mm:ss"
            onChange={(event) => setDuration(parse(event.target.value))}
          />
          <br />
          <br />
          <FormControl>
            <InputLabel htmlFor="clock-type">Type</InputLabel>
            <Select
              id="clock-type"
              value={type.toUpperCase()}
              onChange={(event) => {
                setType(event.target.value.toLowerCase() as Display);
              }}
            >
              {Object.keys(Display).map((value: string) => (
                <MenuItem value={value}> {value.toUpperCase()} </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl>
            <InputLabel htmlFor="clock-behavoir">Behaviour</InputLabel>
            <Select
              id="clock-behaviour"
              value={behaviour.toUpperCase()}
              onChange={(event) => {
                setBehaviour(event.target.value.toLowerCase() as Behaviour);
              }}
            >
              {Object.keys(Behaviour).map((value: string) => (
                <MenuItem value={value}> {value.toUpperCase()} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SDialog>
        <DialogActions>
          <Button
            onClick={() => {
              setDisplay(storage.display);
              setDuration(storage.timer.duration);
              setType(storage.timer.display);
              setBehaviour(storage.timer.behaviour);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              storage.display = display;
              storage.timer.duration = duration;
              storage.timer.display = type;
              storage.timer.behaviour = behaviour;
              let json: object = {};
              switch (storage.type) {
                case Type.SESSION:
                  json = SJSON.serialize(storage as SessionStorage);
                  break;
                case Type.BRACKET:
                  json = BJSON.serialize(storage as BracketStorage);
                  break;
                case Type.ITEM:
                  json = IJSON.serialize(storage as ItemStorage);
              }
              sendCommand("update", props.session, props.edit, {parent:props.parent,storage:json});
              setOpen(false);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default EditDialog;
