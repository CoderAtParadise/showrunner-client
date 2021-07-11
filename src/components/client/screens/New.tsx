import { AppBar, Dialog, Tabs,Tab } from "@material-ui/core";
import {useState,Dispatch, SetStateAction,Fragment } from "react";


const New = (props:{open:boolean; cb:Dispatch<SetStateAction<boolean>>;screen?:string}) => {
    const [tab,setTab] = useState(0);
    if(props.screen !== undefined)
    {
        switch(props.screen) {
            case "runsheet":

            break;
            case "template":
                break;
            case "stageplot":
                break;
        }
        return <div></div>
    }
    else {
        return <Fragment><Dialog open={props.open} onClose={() => {
            props.cb(false);
          }}>
                <Tabs value={tab}>
                    <Tab label= "Runsheet"/>
                    <Tab label= "Template"/>
                    <Tab label= "Stageplot"  disabled/>
                </Tabs>
        </Dialog>
        </Fragment>
    }
}

export default New;