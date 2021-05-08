const serverurl = process.env.SERVER_URL || "http://localhost:3001";
function sendCommand(command: string, session: string, id: string, data?: any) {
  if (!data) data = {};
  fetch(`${serverurl}/command`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      command: command,
      session: session,
      tracking_id: id,
      data: data,
    }),
  }).then((response) => response);
}

export default sendCommand;
