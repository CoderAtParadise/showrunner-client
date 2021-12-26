import {Dialog, Tabs,Tab } from "@material-ui/core";
import React, {useState,Dispatch, SetStateAction,Fragment } from "react";
import Runsheet from "./panels/Runsheet";

const New = (props:{open:boolean; cb:Dispatch<SetStateAction<boolean>>;screen?:string}) => {
    const [tab,setTab] = useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    }
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
                <Tabs value={tab} onChange={handleChange}>
                    <Tab label= "Runsheet" id="runsheet"/>
                    <Tab label= "Template" id="template"/>
                    <Tab label= "Stageplot" id="stageplot"  disabled/>
                </Tabs>
                <Runsheet value={tab} cb={props.cb} index={0}/>
        </Dialog>
        </Fragment>
    }
}

export default New;