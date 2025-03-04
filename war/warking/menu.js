module.exports.config = {
  name: 'menu',
  version: '2.2.0',
  hasPermssion: 0,
  credits: 'DC-Nam mod by Gojo Satoru',
  description: 'Hiển thị menu lệnh tùy chỉnh theo quyền hạn người dùng',
  commandCategory: 'Tiện ích',
  usages: '[tên lệnh | all]',
  cooldowns: 5,
  envConfig: {
    autoUnsend: { status: true, timeOut: 60 }
  }
};

const { autoUnsend = module.exports.config.envConfig.autoUnsend } = global.config?.menu || {};
const { findBestMatch } = require('string-similarity');

module.exports.run = async function({ api, event, args, permssion }) {
  const { sendMessage: send, unsendMessage: un } = api;
  const { threadID: tid, messageID: mid, senderID: sid } = event;
  const cmds = global.client.commands;
  const isAdmin = permssion === 2 || permssion === 3;
  const adminIDs = await getThreadAdminIDs(api, tid);
  const isGroupAdmin = adminIDs.includes(sid);

  if (args.length >= 1) {
    if (args[0].toLowerCase() === 'all') {
      return sendFullCommandList(send, tid, mid, isAdmin, isGroupAdmin, permssion);
    }

    const cmdName = args.join(' ').toLowerCase();
    const cmd = cmds.get(cmdName) || cmds.find(c => c.config.name.toLowerCase() === cmdName);
    if (cmd && canAccessCommand(cmd.config.hasPermssion, permssion, isGroupAdmin)) {
      return send(infoCmds(cmd.config), tid, mid);
    } else {
      return send(`❌ Không tìm thấy lệnh "${cmdName}" hoặc bạn không có quyền truy cập.`, tid, mid);
    }
  } else {
    const data = commandsGroup(permssion, isGroupAdmin);
    let txt = '╭─────────────⭓\n│ Danh Sách Lệnh\n│\n';
    data.forEach((group, index) => {
      txt += `├─ ${index + 1}. ${group.commandCategory} || có ${group.commandsName.length} lệnh\n`;
    });
    txt += '│\n' +
           '├─ Ghi chú\n' +
           `│  ├─ Tổng có: ${data.reduce((sum, group) => sum + group.commandsName.length, 0)} lệnh\n` +
           `│  ├─ Reply từ 1 đến ${data.length} để chọn\n` +
           `│  └─ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s\n` +
           '╰─────────────⭓';

    send(txt, tid, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: sid,
        'case': 'infoGr',
        data,
        permssion,
        isGroupAdmin
      });
      if (autoUnsend.status) setTimeout(() => un(info.messageID), autoUnsend.timeOut * 1000);
    });
  }
};

module.exports.handleReply = async function({ handleReply: $, api, event }) {
  const { sendMessage: send, unsendMessage: un } = api;
  const { threadID: tid, messageID: mid, senderID: sid, args } = event;
  if (sid !== $.author) {
    return send(`🚫 Bạn không có quyền sử dụng lệnh này`, tid, mid);
  }

  switch ($.case) {
    case 'infoGr': {
      const data = $.data[parseInt(args[0]) - 1];
      if (!data) {
        return send(`❌ "${args[0]}" không nằm trong số thứ tự menu`, tid, mid);
      }
      un($.messageID);
      let txt = `╭─────────────⭓\n│ Danh mục: ${data.commandCategory}\n│\n├─ Danh sách lệnh\n`;
      data.commandsName.forEach((cmd, index) => {
        txt += `│  ├─ ${index + 1}. ${cmd}: ${global.client.commands.get(cmd)?.config.description || "Không có mô tả"}\n`;
      });
      txt += '│\n' +
             '├─ Ghi chú\n' +
             `│  ├─ Reply từ 1 đến ${data.commandsName.length} để chọn\n` +
             `│  ├─ Tự động gỡ tin nhắn sau: ${autoUnsend.timeOut}s\n` +
             `│  └─ Dùng -help + tên lệnh để xem chi tiết cách sử dụng lệnh\n` +
             '╰─────────────⭓';

      send(txt, tid, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: sid,
          'case': 'infoCmds',
          data: data.commandsName,
          permssion: $.permssion,
          isGroupAdmin: $.isGroupAdmin
        });
        if (autoUnsend.status) setTimeout(() => un(info.messageID), autoUnsend.timeOut * 1000);
      });
      break;
    }
  }
};

function commandsGroup(permssion, isGroupAdmin) {
  const groups = [];
  for (const [name, cmd] of global.client.commands) {
    if (canAccessCommand(cmd.config.hasPermssion, permssion, isGroupAdmin)) {
      const { commandCategory } = cmd.config;
      const group = groups.find(g => g.commandCategory === commandCategory);
      if (group) {
        group.commandsName.push(name);
      } else {
        groups.push({ commandCategory, commandsName: [name] });
      }
    }
  }
  return groups.sort((a, b) => b.commandsName.length - a.commandsName.length);
}

async function getThreadAdminIDs(api, threadID) {
  try {
    const threadInfo = await api.getThreadInfo(threadID);
    return threadInfo.adminIDs.map(admin => admin.id);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách admin:", error);
    return [];
  }
}

function canAccessCommand(cmdPermssion, userPermssion, isGroupAdmin) {
  if (userPermssion === 3) return true;
  if (userPermssion === 2) return cmdPermssion <= 2;
  if (isGroupAdmin) return cmdPermssion <= 1;
  return cmdPermssion === 0;
}