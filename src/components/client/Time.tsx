import { experimentalStyled as styled } from "@material-ui/core/styles";
import RunsheetHandler from "../common/RunsheetHandler";
import TimePoint, {
  stringify,
  equals,
  add,
  subtract,
  INVALID as INVALID_POINT,
} from "../common/TimePoint";
import Grid from "@material-ui/core/Grid";
import { getProperty, hasProperty } from "../common/Storage";
import { TimerProperty } from "../common/property/Timer";

const Container = styled(Grid)`
  width: 5%;
  color: ${({ theme }) => theme.palette.text.secondary};
  text-align: center;
  vertical-align: middle;
  line-height: 48px;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

export const Time = (props: {
  handler: RunsheetHandler;
  show: string;
  id: string;
  offset?: TimePoint;
  calEnd?: boolean;
}) => {
  const show = props.handler.getShow(props.show);
  const tshow = props.handler.getTrackingShow(props.show);
  const storage = props.handler.getStorage(props.id);
  if (storage && show && tshow) {
  }
  return <Container item>{stringify(INVALID_POINT)}</Container>;
};

export default Time;
