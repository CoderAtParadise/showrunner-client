const serverurl = process.env.SHOWRUNNER_SERVER_URL || "localhost:3001";

export const sendCommand = async (
    commandInfo: { show: string; session: string },
    command: string,
    data: any
) => {
    if (!data) data = {};
    return await fetch(
        `http://${serverurl}/production/${commandInfo.show}/${commandInfo.session}/command`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                command: command,
                data: data
            })
        }
    );
};
