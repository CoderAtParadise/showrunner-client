import { useEffect, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { List, ListItem } from "@material-ui/core";
import sendCommand from "./SendCommand";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      width: 500,
    },
    list: {
      height: 150,
    },
  })
);

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const LoadDialog = (props: {
  open: boolean;
  cb: Dispatch<SetStateAction<boolean>>;
}) => {
  const classes = useStyles();
  const initialState: string[] = [];
  const [runsheets, setRunsheets] = useState(initialState);
  const [selected, setSelected] = useState("");
  useEffect(() => {}, []);
  return (
    <Dialog
      open={props.open}
      onEntered={() => {
        fetch(`${serverurl}/runsheets`)
          .then((res) => res.json())
          .then((runsheets) => setRunsheets(runsheets));
      }}
      onClose={() => {
        props.cb(false);
      }}
      scroll={"body"}
    >
      <DialogTitle id="form-edit">Load Runsheet</DialogTitle>
      <DialogContent className={classes.dialog} dividers={false}>
        <List className={classes.list}>
          {runsheets.map((value: string) => (
            <ListItem key={value}
              button
              onClick={() => {
                sendCommand("load", "", "", value);
                props.cb(false);
              }}
            >
              {value}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.cb(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoadDialog;
