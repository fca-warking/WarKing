const fs = require("fs");

module.exports.config = {
    name: "tapngon",
    version: "1.0.0",
    hasPermssion: 1,
    credits: "...",
    description: "Spam vô hạn",
    commandCategory: "WAR",
    usages: "tapngon",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    // Đọc nội dung từ file chửi
    let messages;
    try {
        messages = fs.readFileSync("./../../war/warking/war/chui.txt", "utf8").split("\n");
    } catch (err) {
        return api.sendMessage("Lỗi: Không tìm thấy file chui.txt", event.threadID);
    }

    // Vòng lặp vô hạn
    while (true) {
        for (let msg of messages) {
            api.sendMessage(msg, event.threadID);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây để tránh spam quá nhanh
        }
    }
};