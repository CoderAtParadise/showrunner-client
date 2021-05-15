import { useEffect,useState } from "react";
import { List,ListItem } from "@material-ui/core";
import sendCommand from "./SendCommand";

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
const LoadDialog = () => {
  const [runsheets, setRunsheets] = useState([]);
  useEffect(() =>  {fetch(`${serverurl}/runsheets`)
  .then(res => res.json())
  .then(runsheets => setRunsheets(runsheets))},[runsheets]);
  return (
    <List>
        {runsheets.map((value:string) => <ListItem button onClick={() => sendCommand("load","","",value)}>{value}</ListItem>)}
        </List>
  );

  
};

export default LoadDialog;
