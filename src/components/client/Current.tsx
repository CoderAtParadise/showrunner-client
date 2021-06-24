import { experimentalStyled as styled } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import {
  stringify,
  subtract,
  INVALID as INVALID_POINT,
} from "../common/TimePoint";
import {Goto} from "./Commands";
import RunsheetHandler from "../common/RunsheetHandler";
import { getProperty } from "../common/Storage";
import { TimerProperty } from "../common/property/Timer";
import Storage from "../common/Storage";
import Timer from "./Timer";

const HGrid = styled(Grid)`
  flex-grow: 1;
  height: 200px;
  padding: ${({ theme }) => theme.spacing(1)};
  position: fixed;
  z-index: 5;
`;
const JGrid = styled(Grid)`
  justify-content: center;
`;

const SGrid = styled(JGrid)`
  align-items: stretched;
`;

const HPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  height: 80%;
`;

const Go = styled(Button)`
  height: 70px;
  width: 70px;
  border: solid;
  border-color: ${({ theme }) => theme.palette.text.secondary};
  color: ${({ theme }) => theme.palette.text.secondary};
`;

const Current = (props: { handler: RunsheetHandler;}) => {
  const clock = props.handler.getClock("internal")?.clock() || INVALID_POINT;
  const tshow = props.handler.getTrackingShow(props.handler.activeShow());
  const show = props.handler.getShow(props.handler.activeShow());
  const active = props.handler.getStorage(tshow?.active || "");
  const next = props.handler.getStorage(tshow?.next || "");
  const session = props.handler.getStorage(show?.session || "");
  let bracket: Storage<any> | undefined;
  if (active && show)
    bracket = props.handler.getStorage(
      getProperty(active, show, "parent")?.value
    );
  return (
    <HGrid container>
      <JGrid container>
        <Grid item xs={2}>
          <HPaper>
            <b>Total Run Time</b>
            <br />
            {stringify(
              subtract(
                clock,
                tshow?.trackers.get(show?.session || "")?.timer.start ||
                  INVALID_POINT
              )
            )}
          </HPaper>
        </Grid>
        <Grid item xs={3}>
          <HPaper>
            <b>Service</b>
            <br />
            {session && show
              ? getProperty(session, show, "display")?.value
              : ""}
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <b>Start Time</b>
            <br />
            {stringify(
              session && show
                ? getProperty(session, show, "start_time")?.value ||
                    INVALID_POINT
                : INVALID_POINT
            )}
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <b>Projected End Time</b>
            <br />
            {stringify(
              tshow?.trackers.get(show?.session || "")?.timer.end ||
                INVALID_POINT
            )}
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <b>Time</b>
            <br />
            {stringify(clock)}
          </HPaper>
        </Grid>
      </JGrid>
      <SGrid container>
        <Grid item xs={2}>
          <HPaper>
            Bracket Duration:{" "}
            {stringify(
              bracket && show
                ? (getProperty(bracket, show, "timer") as TimerProperty).value
                    .duration
                : INVALID_POINT
            )}
            <br />
            <b>
              Item Duration:{" "}
              {stringify(
                active && show
                  ? (getProperty(active, show, "timer") as TimerProperty).value
                      .duration
                  : INVALID_POINT
              )}
            </b>
          </HPaper>
        </Grid>
        <Grid item xs={4}>
          <HPaper>
            Current Bracket:{" "}
            {bracket && show
              ? getProperty(bracket, show, "display")?.value
              : ""}
            <br />
            <b>
              Current Item:{" "}
              {active && show
                ? getProperty(active, show, "display")?.value
                : ""}
            </b>
          </HPaper>
        </Grid>
        <Grid item xs={3}>
          <HPaper>
            Bracket Timer: <Timer/>
            <br />
            <b>Item Timer: <Timer/></b>
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <Go onClick={() => {if(tshow && show) Goto(show.id,tshow.next)}}>Go</Go>
            <br />
            <b>
              Next:{" "}
              {next && show ? getProperty(next, show, "display")?.value : ""}
            </b>
          </HPaper>
        </Grid>
      </SGrid>
    </HGrid>
  );
};

export default Current;
