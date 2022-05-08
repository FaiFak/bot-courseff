const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./option.js");
const token = "5395118112:AAE93W-NUKx3gWfammDsS7a6Cp-TCn_4d5E";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен её отгадать!"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  console.log(randomNumber);
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователи" },
    { command: "/game", description: "Хочешь сыграть со мной?" },
    { command: "/time", description: "Узнать время" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://cdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/11.webp"
      );
      return bot.sendMessage(chatId, "Hello!");
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Name: ${msg.from.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я не понимаю Вас.");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты угадал! Это была цифра ${data}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению, но ты не угадал! Это была цифра ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
