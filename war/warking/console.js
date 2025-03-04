const chalk = require('chalk');
const moment = require("moment-timezone");

// Hàm chuyển từ HEX sang RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

// Hàm nội suy màu giữa hai điểm
function interpolateColor(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

// Hàm tạo gradient chuyển màu mượt mà từ xanh → tím → đỏ
function createGradientText(text, colors) {
    const chars = text.split('');
    const total = chars.length;
    let gradientText = '';

    chars.forEach((char, i) => {
        const section = (i / total) * (colors.length - 1);
        const index = Math.floor(section);
        const factor = section - index;

        const color = interpolateColor(colors[index], colors[index + 1] || colors[index], factor);
        gradientText += chalk.hex(color)(char);
    });

    return gradientText;
}

// Bảng màu: từ Xanh → Tím → Đỏ
const gradientColors = ['#00FFFF', '#8A2BE2', '#FF4500'];

module.exports.config = {
    name: "console",
    version: "1.4.0",
    hasPermssion: 3,
    credits: "JRT modified by Satoru, gradient improved by ChatGPT",
    description: "Bật/tắt ghi log console với gradient chuyển dần",
    commandCategory: "Admin",
    usages: "[on/off]",
    cooldowns: 5,
};

// Đảm bảo ghi log mặc định bật
if (typeof global.data.console === "undefined") {
    global.data.console = true;
}

module.exports.handleEvent = async function ({ api, event, Users, Threads }) {
    if (!global.data.console) return;

    moment.locale('vi');
    const time = moment().format('HH:mm DD/MM/YYYY');
    const { threadID, senderID, body, isGroup } = event;

    // Lấy tên nhóm
    let nameBox = "Tin nhắn riêng";
    if (isGroup) {
        try {
            const threadInfo = await Threads.getInfo(threadID);
            nameBox = threadInfo.threadName || "Tên không tồn tại";
        } catch {
            nameBox = "Lỗi lấy tên nhóm";
        }
    }

    // Lấy tên người gửi
    let nameUser = "Không xác định";
    try {
        nameUser = await Users.getNameUser(senderID);
    } catch {}

    // Nội dung tin nhắn
    let msg = body || "Ảnh, video hoặc kí tự đặc biệt";
    if (event.attachments?.length) {
        msg = event.attachments.map(att => att.type === 'photo' ? 'Ảnh' : 'Video').join(', ');
    }

    // Xác định bot hay người dùng
    const isBot = senderID == api.getCurrentUserID();
    const botLabel = isBot ? '[BOT] ' : '';

    // In log ra console với màu gradient chuyển dần
    console.log(createGradientText(`├────────────────────────────────────⭓`, gradientColors));
    console.log(createGradientText(`│ Nhóm: ${nameBox}`, gradientColors));
    console.log(createGradientText(`│ Người gửi: ${botLabel}${nameUser}`, gradientColors));
    console.log(createGradientText(`│ Tin nhắn: `, gradientColors));
    console.log(createGradientText(`│ Thời gian: ${time}`, gradientColors));
    console.log(createGradientText(`├────────────────────────────────────⭓`, gradientColors));
};

module.exports.run = function ({ api, args, event }) {
    const { threadID, messageID } = event;

    if (!args[0] || !["on", "off"].includes(args[0].toLowerCase())) {
        return api.sendMessage("Vui lòng sử dụng 'on' hoặc 'off'.", threadID, messageID);
    }

    global.data.console = args[0].toLowerCase() === "on";
    api.sendMessage(`Ghi log console đã được ${global.data.console ? "bật" : "tắt"}.`, threadID, messageID);
};