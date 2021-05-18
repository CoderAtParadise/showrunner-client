import { experimentalStyled as styled } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper } from "@material-ui/core";
import { SyncContext } from "./SyncSource";
import { stringify, subtract } from "../common/Time";
import { get, Nested, Storage } from "../common/Storage";
import { ClockContext } from "./ClockSource";
import { useContext } from "react";
import TimePoint from "./TimePoint";
import sendCommand from "./SendCommand";
import {
  INVALID_SESSION,
  INVALID_TRACKER,
  TrackingSession,
} from "../common/Tracking";

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
`

function GetTSession(id: string): TrackingSession {
  const sync = useContext(SyncContext);
  return sync.tracking.get(id) || INVALID_SESSION;
}

function GetInSession(session: TrackingSession, id: string) {
  return session.trackers.get(id) || INVALID_TRACKER;
}

const Current = () => {
  const sync = useContext(SyncContext);
  const clock = useContext(ClockContext);

  const tsession = GetTSession(sync.current.session);
  const titem = GetInSession(tsession, sync.current.active);
  const tbracket = GetInSession(tsession, titem.parent);
  const session = get(sync.runsheet, tsession.tracking_id) as Storage & Nested;
  const bracket = get(session, tbracket.tracking_id) as Storage & Nested;
  const item = get(bracket, titem.tracking_id);

  const ntitem = GetInSession(tsession, sync.current.next);
  const ntbracket = GetInSession(tsession, ntitem.parent);
  const nbracket = get(session, ntbracket.tracking_id) as Storage & Nested;
  const nitem = get(nbracket, ntitem.tracking_id);

  return (
    <HGrid container>
      <JGrid container>
        <Grid item xs={2}>
          <HPaper>
            <b>Total Run Time</b>
            <br />
            {stringify(subtract(clock, tsession.timer.start))}
          </HPaper>
        </Grid>
        <Grid item xs={3}>
          <HPaper>
            <b>Service</b>
            <br />
            {get(sync.runsheet, tsession.tracking_id).display}
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <b>Start Time</b>
            <br />
            {stringify(tsession.timer.start)}
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <b>Projected End Time</b>
            <br />
            {stringify(tsession.timer.end)}
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
            Bracket Duration: {stringify(tbracket.settings.duration)}
            <br />
            <b>Item Duration: {stringify(titem.settings.duration)} </b>
          </HPaper>
        </Grid>
        <Grid item xs={4}>
          <HPaper>
            Current Bracket: {bracket.display}
            <br />
            <b>Current Item: {item.display}</b>
          </HPaper>
        </Grid>
        <Grid item xs={3}>
          <HPaper>
            Bracket Timer: <TimePoint tracker={tbracket} clock={clock} />
            <br />
            <b>
              Item Timer: <TimePoint tracker={titem} clock={clock} />
            </b>
          </HPaper>
        </Grid>
        <Grid item xs={2}>
          <HPaper>
            <Go
              onClick={() => {
                sendCommand("goto", sync.current.session, sync.current.next);
              }}
            >
              Go
            </Go>
            <br />
            <b>Next: {nitem.display}</b>
          </HPaper>
        </Grid>
      </SGrid>
    </HGrid>
  );
};

export default Current;
