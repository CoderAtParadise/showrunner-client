import Runsheet from "./Runsheet";

const serverurl = process.env.SERVER_URL || "http://localhost:3001";
function sendCommand(command: string, data: any) {
  if (!data) data = {};
  fetch(`${serverurl}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      command: command,
      data: data,
    }),
  }).then((response) => response);
}

export const Update = (
  show: string,
  tracking: string,
  properties: { reset: boolean; override: boolean; property: any }[]
) =>
  sendCommand("update", {
    show: show,
    tracking: tracking,
    properties: properties,
  });
export const Goto = (show: string, tracking: string) =>
  sendCommand("goto", { show: show, tracking: tracking });
export const LoadRunsheet = (runsheet:string) => {
  sendCommand("load_runsheet",{id:runsheet});
}
export const DeleteRunsheet = (runsheet:string) => {
  sendCommand("delete_runsheet",{id:runsheet});
}

export default sendCommand;
