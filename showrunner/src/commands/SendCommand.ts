const serverurl = process.env.SERVER_URL || "http://localhost:3001";

export const sendCommand = (command: string, data: any) => {
    if (!data) data = {};
    fetch(`${serverurl}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            command: command,
            data: data
        })
    }).then((response) => response);
};
