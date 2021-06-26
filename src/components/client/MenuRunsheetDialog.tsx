import { useEffect, useState } from "react";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { List } from "@material-ui/core";
import ListItemButton from "@material-ui/core/ListItemButton";
import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import RunsheetHandler from "../common/RunsheetHandler";

const SDialog = styled(DialogContent)`
  width: 200px;
`;

const SList = styled(List)`
  height: 150px;
`;

const Li = styled(ListItemButton)`
  text-align: center;
  justify-content: center;
  border-radius: 25px;
`;

const Title = styled(DialogTitle)`
  text-align: center;
`;

const SButton = styled(Button)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;
export type StorageKey = { display: string; id: string };
export const initialStorageKey = { display: "", id: "" };

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const MenuRunsheetDialog = (props: {
  handler: RunsheetHandler;
  display: string;
  open: boolean;
  openCb: Dispatch<SetStateAction<boolean>>;
  cb: (runsheet: StorageKey) => void;
}) => {
  const initialState: StorageKey[] = [];
  const [selected, setSelected] = useState(initialStorageKey);
  const [runsheets, setRunsheets] = useState(initialState);
  useEffect(() => {
    fetch(`${serverurl}/runsheets`)
      .then((res) => res.json())
      .then((newR) => setRunsheets(Array.from(newR)));
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.openCb(false);
      }}
      scroll={"paper"}
    >
      <Title id="form-edit">{props.display} Runsheet</Title>
      <SDialog dividers={false}>
        <SList>
          {runsheets.map((value: StorageKey) => (
            <Li
              key={value.id}
              disabled={props.handler.id() === value.id}
              selected={selected === value}
              onClick={() => {
                setSelected(value);
              }}
            >
              {value.display}
            </Li>
          ))}
        </SList>
      </SDialog>
      <DialogActions>
        <SButton
          onClick={() => {
            props.cb(selected);
            props.openCb(false);
          }}
        >
          {props.display}
        </SButton>
        <SButton onClick={() => props.openCb(false)}>Cancel</SButton>
      </DialogActions>
    </Dialog>
  );
};

export default MenuRunsheetDialog;
