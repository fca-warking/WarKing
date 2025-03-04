const os = require('os');
const moment = require('moment-timezone');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const si = require('systeminformation'); // Dùng để lấy thông tin ổ cứng

module.exports = {
    config: {
        name: "upt",
        version: "3.2.0",
        hasPermission: 2,
        credits: "Anh Quý",
        description: "Hiển thị thông tin hệ thống của bot",
        commandCategory: "Admin",
        usages: "[cpu/ram/disk/all]",
        cooldowns: 5,
        image: []
    },
    run: async ({ api, event, args }) => {
        const startTime = Date.now();

        function getSystemRAMUsage() {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            return {
                totalMem: Math.round(totalMem / 1024 / 1024),
                usedMem: Math.round(usedMem / 1024 / 1024),
                freeMem: Math.round(freeMem / 1024 / 1024)
            };
        }

        function getHeapMemoryUsage() {
            const heap = process.memoryUsage();
            return {
                heapTotal: Math.round(heap.heapTotal / 1024 / 1024),
                heapUsed: Math.round(heap.heapUsed / 1024 / 1024),
                external: Math.round(heap.external / 1024 / 1024),
                rss: Math.round(heap.rss / 1024 / 1024)
            };
        }

        async function getDependencyCount() {
            try {
                const packageJsonString = await fs.readFile('package.json', 'utf8');
                const packageJson = JSON.parse(packageJsonString);
                return Object.keys(packageJson.dependencies).length;
            } catch (error) {
                return -1;
            }
        }

        function getFilteredUptime() {
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`.trim();
        }

        async function getCPUUsage() {
            const startMeasure = process.cpuUsage();
            await new Promise(resolve => setTimeout(resolve, 100));
            const endMeasure = process.cpuUsage(startMeasure);
            return ((endMeasure.user + endMeasure.system) / 1000000).toFixed(1);
        }

        async function getDiskUsage() {
            try {
                const disk = await si.fsSize();
                const total = Math.round(disk[0].size / 1024 / 1024 / 1024);
                const used = Math.round(disk[0].used / 1024 / 1024 / 1024);
                const available = total - used;
                return { total, used, available };
            } catch {
                return { total: 'N/A', used: 'N/A', available: 'N/A' };
            }
        }

        const systemRAM = getSystemRAMUsage();
        const heapMemory = getHeapMemoryUsage();
        const uptimeString = getFilteredUptime();
        const dependencyCount = await getDependencyCount();
        const cpuUsage = await getCPUUsage();
        const diskUsage = await getDiskUsage();
        const cpuModel = os.cpus()[0].model;

        try {
            const pingReal = Date.now() - startTime;
            const botStatus = pingReal < 200 ? 'mượt mà' : pingReal < 800 ? 'bình thường' : 'lag';

            const fullInfo = `
⏰ Thời gian: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss | DD/MM/YYYY')}
⏱️ Uptime: ${uptimeString}
📝 Tiền tố: ${global.config.PREFIX}
🗂️ Dependencies: ${dependencyCount >= 0 ? dependencyCount : "N/A"}
🔣 Trạng thái bot: ${botStatus}
📋 Hệ điều hành: ${os.type()} ${os.release()} (${os.arch()})
💻 CPU: ${cpuModel} (${os.cpus().length} cores)
   🔥 Sử dụng: ${cpuUsage}%
📊 RAM: ${systemRAM.usedMem}MB/${systemRAM.totalMem}MB
🧠 Heap:
   Tổng: ${heapMemory.heapTotal}MB | Đã dùng: ${heapMemory.heapUsed}MB
🛢️ Ổ đĩa: ${diskUsage.used}GB/${diskUsage.total}GB (Còn trống: ${diskUsage.available}GB)
🛜 Ping: ${pingReal}ms
`.trim();

            const cpuInfo = `
💻 CPU: ${cpuModel}
   Số core: ${os.cpus().length}
   Sử dụng: ${cpuUsage}%
`.trim();

            const ramInfo = `
📊 RAM: ${systemRAM.usedMem}MB/${systemRAM.totalMem}MB
🧠 Heap:
   Tổng: ${heapMemory.heapTotal}MB | Đã dùng: ${heapMemory.heapUsed}MB
`.trim();

            const diskInfo = `
🛢️ Ổ đĩa:
   Tổng: ${diskUsage.total}GB
   Đã dùng: ${diskUsage.used}GB
   Còn trống: ${diskUsage.available}GB
`.trim();

            let replyMsg;
            const command = args[0]?.toLowerCase();
            switch (command) {
                case 'cpu': replyMsg = cpuInfo; break;
                case 'ram': replyMsg = ramInfo; break;
                case 'disk': replyMsg = diskInfo; break;
                case 'all': 
                default: replyMsg = fullInfo;
            }

            api.sendMessage({ body: replyMsg }, event.threadID, event.messageID);

        } catch (error) {
            api.sendMessage('Đã xảy ra lỗi khi lấy thông tin hệ thống.', event.threadID, event.messageID);
        }
    }
};