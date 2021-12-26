import TabPanelProps from "./TabPanelProps";
import { Fragment,useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import { experimentalStyled as styled } from "@material-ui/core/styles";

const SButton = styled(Button)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Runsheet = (props: TabPanelProps) => {
  const { children, value, index, cb, ...other } = props;
    const [template,setTemplate] = useState("");
    const [display,setDisplay] = useState("");
  return (
    <Fragment>
      <DialogContent>
        <DialogContentText>Template:</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Display"
          id="display"
          placeholder="Example Runsheet"
          fullWidth
          value={display}
          onChange={(event) => {setDisplay(event.target.value)}}
        />
      </DialogContent>
      <DialogActions>
        <SButton
          onClick={() => {
            cb(false);
          }}
        >
          Create
        </SButton>
        <SButton
          onClick={() => {
            cb(false);
          }}
        >
          Cancel
        </SButton>
      </DialogActions>
    </Fragment>
  );
};

export default Runsheet;
