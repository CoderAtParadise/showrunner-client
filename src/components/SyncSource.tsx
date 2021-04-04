import { createContext, useEffect, useReducer, useState } from "react";

interface Sync 
{
    runsheet:any;
}

const syncReducer = (state:any,action:string) => {
    return {};
}

const SyncSource = (props:any) =>
{
    const [stat,dispatch] = useReducer(syncReducer,{})
}
