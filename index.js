const { spawn } = require("child_process");
const logger = require("./utils/log");

function startBot(message) {
    // Add the custom ASCII art without gradient
    const customAsciiArt = `
------------------------------------
| Uptime: ${process.uptime()} seconds |
------------------------------------
| Author: Anh Quý.               |
| Version: 2.0.0.                |
------------------------------------
| Facebook: m.me/aq.dec          |
------------------------------------
`;
    (message) ? logger(`${customAsciiArt}\n${message}`, "[ Bắt Đầu ]") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "warking.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", async (codeExit) => {
        var x = 'codeExit'.replace('codeExit', codeExit);
        if (codeExit == 1) return startBot("Restarting...");
        else if (x.indexOf(2) == 0) {
            await new Promise(resolve => setTimeout(resolve, parseInt(x.replace(2, '')) * 1000));
            startBot("Open ...");
        }
        else return;
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "[ Starting ]");
    });
}

startBot();
