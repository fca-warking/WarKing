const adminUIDs = ["100030259834679", "100075048608899"]; // Thay bằng UID thật của bạn

let isRunning = {}; // Biến lưu trạng thái của từng nhóm

module.exports.config = {
    name: "1c",
    version: "1.0.6",
    hasPermission: 0, 
    credits: "Anh Quý",
    description: "nhây 1 chữ",
    commandCategory: "WAR",
    usages: "1c | 1c stop",
    cooldowns: 10
};

module.exports.run = async function({ api, args, event }) {
    let threadID = event.threadID;
    let senderID = event.senderID;

    if (!adminUIDs.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này!", threadID);
    }

    if (args[0] && args[0].toLowerCase() === "stop") {
        if (isRunning[threadID]) {
            isRunning[threadID] = false;
            return api.sendMessage("Tha m đó con dog 🤪.", threadID);
        } else {
            return api.sendMessage("Không có lệnh chửi nào đang chạy.", threadID);
        }
    }

    let messages = [
        "con", "di", "me", "m", "sua", "di", "k", "thoi", "bo", "sut", "cai", "dau", 

          "thu", "cua", "con", "ma", "m", "vang", "xa", "tam", "phuong", "bon", "huong", 

          "cho", "khoi", "lum", "xac", "ve", "chon", "thay", "luon", "ne", "con", "di",

          "cho", "ngu", "si", "tu", "chi", "bai", "liet", "nhu", "m", "phai", "roi", "vao",

          "tram", "cam", "tuyet", "vong", "tot", "dot", "kinh", "hai", "hon", "via", "than",

          "kinh", "ban", "loan", "con", "nguoi", "tron", "nguoc", "len", "ma", "gao", "khoc",

          "tham", "thuong", "ai", "nhin", "vao", "cung", "tuong", "anh", "hanh", "ha", "m",

          "khong", "khac", "mot", "con", "cho", "nam", "lan", "le", "bo", "let", "duoi",

          "dat", "thoi", "thop", "cho", "doi", "cai", "chet", "r", "quy", "ve", "coi", "am",

          "doan", "tu", "vong", "linh", "con", "me", "m", "o", "duoi", "am", "tau", "dia",

          "phu", "chiu", "nhung", "dang", "cay", "cuoc", "doi", "chx", "duoc", "dau", "thai",

          "chuyen", "kiep", "kia", "úi", "con", "cho", "3d", "o", "moi", "tap", "nham", "dang",

          "duoi", "den", "noi", "phai", "nhai", "kia", "nhin", "m", "nhai", "k", "khac", "gi",

          "anh", "nhai", "co", "lam", "anh", "nhin", "thay", "chan", "qua", "nen", "m", "hang",

          "hai", "len", "di", "thang", "dot", "nay", "yeu", "vai", "dung", "chat", "thang",

          "ngu", "si", "da", "ma", "thích", "xong", "pha", "hien", "mau"
    ];

    isRunning[threadID] = true;

    function sendNextMessage() {
        if (!isRunning[threadID]) return;
        let msg = messages[Math.floor(Math.random() * messages.length)];
        api.sendMessage(msg, threadID);
        setTimeout(sendNextMessage, 1000); // ⏳ **Delay 1 giây**
    }

    api.sendMessage(`con cho ngu nghe chui ne 🤪.`, threadID);
    sendNextMessage();
};