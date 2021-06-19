import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Dispatch, SetStateAction } from "react";
import {
  PlayArrow,
  ExpandMore,
  ExpandLess,
  ArrowRight,
} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";

const Container = styled(Grid)`
  width: 5%;
  vertical-align: middle;
  line-height: 48px;
`;

const Active = styled(PlayArrow)`
  color: lawngreen;
`;

const Status = (props: {
  active: boolean;
  hasChildren: boolean;
  open: boolean;
  cb: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Container item>
      <IconButton onClick={() => props.cb(!props.open)}>
        {props.hasChildren ? (
          props.open ? (
            <ExpandLess />
          ) : props.active ? (
            <Active />
          ) : (
            <ExpandMore />
          )
        ) : props.active ? (
          <Active />
        ) : (
          <ArrowRight />
        )}
      </IconButton>
    </Container>
  );
};

export default Status;
