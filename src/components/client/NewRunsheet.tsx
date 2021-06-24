import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Dispatch, SetStateAction } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button} from "@material-ui/core";
import { useState } from "react";
import SendCommand from "./Commands";

const SDialog = styled(DialogContent)`
  width: 150px;
`

const SButton = styled(Button)`
    color: ${({theme}) => theme.palette.text.secondary};
`

const NewRunsheet = (props: {
  open: boolean;
  cb: Dispatch<SetStateAction<boolean>>;
}) => {
    const [name,setName] = useState("");
    const clear = (): void => {
        props.cb(false);
    }

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.cb(false);
      }}
      scroll={"body"}
    >
        <DialogTitle id="new-runsheet">New Runsheet</DialogTitle>
        <SDialog>
            <TextField id="name" variant="outlined" label="Name" onChange={(event) => setName(event.target.value)}/>
        </SDialog>
        <DialogActions>
            <SButton onClick={() => clear()}>Cancel</SButton>
            <SButton onClick={() => {clear()}}>Create</SButton>
        </DialogActions>
    </Dialog>
  );
};

export default NewRunsheet;