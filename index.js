const { spawn } = require("child_process");
const chalk = require("chalk");
const logger = require("./utils/log");

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return `${0}:${32}:${71} `;
}

// Hiển thị banner với màu sắc
console.clear();
console.log(chalk.blue(`
╭─────────────────────────────────────⭓
│ ${chalk.green("Uptime:")} ${chalk.yellow(formatUptime(process.uptime()))}   
├───────────────────⭓
│ ${chalk.green("Author:")} Anh Quý                  
│ ${chalk.green("Version:")} 2.0.0             
├─────────────────────────⭓
│ ${chalk.green("Facebook:")} ${chalk.cyan("m.me/aq.dec")}    
├─────────────────────────────────────⭓`));

function startBot(message) {
    if (message) logger(message, chalk.bold("[ Bắt Đầu ]"));

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "warking.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", async (codeExit) => {
        if (codeExit === 1) return startBot(chalk.yellow("Restarting..."));
        else if (codeExit.toString().startsWith("2")) {
            await new Promise(resolve => setTimeout(resolve, parseInt(codeExit.toString().replace("2", "")) * 1000));
            startBot(chalk.green("Opening..."));
        }
    });

    child.on("error", (error) => {
        logger(chalk.red("An error occurred: " + JSON.stringify(error)), "[ Starting ]");
    });
}

startBot();