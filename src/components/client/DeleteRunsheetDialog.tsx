import { experimentalStyled as styled } from "@material-ui/core/styles";
import { useEffect, useState } from "react";
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

const SDialog = styled(DialogContent)`
  width: 150px;
`

const SList = styled(List)`
  height: 150px;
`

const Li = styled(ListItem)`
  text-align: center;
  justify-content: center;
`

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const DeleteRunsheetDialog = (props: {
  open: boolean;
  cb: Dispatch<SetStateAction<boolean>>;
}) => {
  const initialState: string[] = [];
  const [runsheets, setRunsheets] = useState(initialState);
  useEffect(() => {fetch(`${serverurl}/runsheets`)
  .then((res) => res.json())
  .then((runsheets) => setRunsheets(runsheets));}, []);
  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.cb(false);
      }}
      scroll={"body"}
    >
      <DialogTitle id="form-edit">Load Runsheet</DialogTitle>
      <SDialog dividers={false}>
        <SList>
          {runsheets.map((value: string) => (
            <Li key={value}
              button
              onClick={() => {
                sendCommand("deleterunsheet", "", "", value);
                props.cb(false);
              }}
            >
              {value}
            </Li>
          ))}
        </SList>
      </SDialog>
      <DialogActions>
        <Button onClick={() => props.cb(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRunsheetDialog;
