const fs = require("fs-extra");

const adminUIDs = ["100030259834679", "100075048608899"]; // Thay bằng UID admin thật của bạn

let isSpamming = {}; // Trạng thái spam từng nhóm

module.exports.config = {
    name: "spam",
    version: "1.4.0",
    hasPermission: 0,
    credits: "Anh Quý",
    description: "Spam tin nhắn chửi mà giữ nguyên nội dung trong file",
    commandCategory: "WAR",
    usages: "spam | spam stop",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
};

module.exports.run = async function({ api, args, event }) {
    let threadID = event.threadID;
    let senderID = event.senderID;

    // Kiểm tra quyền admin
    if (!adminUIDs.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này!", threadID);
    }

    // Lệnh dừng spam
    if (args[0] && args[0].toLowerCase() === "stop") {
        if (isSpamming[threadID]) {
            isSpamming[threadID] = false;
            return api.sendMessage("Đã dừng spam.", threadID);
        } else {
            return api.sendMessage("Không có lệnh spam nào đang chạy.", threadID);
        }
    }

    // Đọc toàn bộ nội dung file chửi
    let filePath = __dirname + "/../../war/warking/war/spam.txt";
    if (!fs.existsSync(filePath)) {
        return api.sendMessage("Lỗi: Không tìm thấy file chửi!", threadID);
    }

    let messageContent = fs.readFileSync(filePath, "utf-8").trim(); // Đọc toàn bộ file

    if (!messageContent) {
        return api.sendMessage("File chửi rỗng!", threadID);
    }

    isSpamming[threadID] = true; // Đánh dấu đang spam

    function sendSpamMessage() {
        if (!isSpamming[threadID]) return; // Nếu có lệnh stop, dừng ngay lập tức

        api.sendMessage(messageContent, threadID); // Gửi toàn bộ nội dung file

        setTimeout(sendSpamMessage, 3000); // Lặp lại sau 3 giây
    }

    api.sendMessage("Bắt đầu spam. Dùng 'spam stop' để dừng.", threadID);
    sendSpamMessage(); // Bắt đầu vòng lặp spam
};