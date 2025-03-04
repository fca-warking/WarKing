const adminUIDs = ["100030259834679", "100075048608899"]; // Thay bằng UID thật của bạn

let isRunning = {}; // Biến lưu trạng thái của từng nhóm

module.exports.config = {
		name: "treo",
		version: "1.0.9",
		hasPermission: 0,
		credits: "ANH QUÝ",
		description: "Tag liên tục để chửi đứa mà bạn ghét, chạy hết danh sách rồi lặp lại, có lệnh stop",
		commandCategory: "WAR",
		usages: "treo | treo stop",
		cooldowns: 10
};

module.exports.run = async function({ api, args, event }) {
		let threadID = event.threadID;
		let senderID = event.senderID;

		// Kiểm tra quyền admin UID
		if (!adminUIDs.includes(senderID)) {
				return api.sendMessage("Bạn không có quyền sử dụng lệnh này!", threadID);
		}

		// Dừng lệnh nếu nhập "stop"
		if (args[0] && args[0].toLowerCase() === "stop") {
				if (isRunning[threadID]) {
						isRunning[threadID] = false;
						return api.sendMessage("tha cho m đó.", threadID);
				} else {
						return api.sendMessage("Không có lệnh chửi nào đang chạy.", threadID);
				}
		}

		// Kiểm tra nếu không có tag ai
		if (!event.mentions || Object.keys(event.mentions).length === 0) {
				return api.sendMessage("m quên @tag kìa con chó", threadID);
		}

		let mention = Object.keys(event.mentions)[0];
		let name = event.mentions[mention] || "người nào đó";
		let arraytag = [{ id: mention, tag: name }];

		// Danh sách câu chửi
		let messages = [
				"🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒🐼🍃💫💮☘️💨ℂ𝕙𝕚𝕖̂́𝕟 𝕋𝕙𝕒̂̀𝕟 𝔹𝕠𝕥 𝕎𝕒𝕣 𝔻𝕠 ℚ𝕦𝕠𝕔 (𝔹𝕚) 𝕕𝕖̂́𝕟 𝕕𝕒̂𝕪 𝕥𝕣𝕖̂𝕟 𝕤𝕒̀𝕟 𝕨𝕒𝕣 𝕞𝕖𝕤𝕤𝕒𝕘𝕖𝕣🌨️☔🌊🫧✨🌟 💫💮☘️﹏❣𝐅𝐫𝐨𝐦  𝒂𝒆𝒅𝒅𝒒𒅒"
		];

		isRunning[threadID] = true;
		let index = 0; // Biến đếm để chạy hết danh sách rồi lặp lại

		function sendNextMessage() {
				if (!isRunning[threadID]) return;

				let msg = messages[index].replace(/{name}/g, name); // Thay {name} bằng tên người bị tag
				api.sendMessage({ body: msg, mentions: arraytag }, threadID);

				index++; // Chuyển sang câu tiếp theo
				if (index >= messages.length) index = 0; // Nếu hết danh sách thì quay lại từ đầu

				setTimeout(sendNextMessage, 8000); // Delay 1 phút giữa mỗi tin nhắn
					}

		api.sendMessage(`con dog ${name}. đang bị bi treo.`, threadID);
		sendNextMessage();
};