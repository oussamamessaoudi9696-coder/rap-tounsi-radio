require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(3000, () => {
  console.log("Web server started");
});

const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID; // تحط هنا id الشانل

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const azkar = [
  "سبحان الله 🤍",
  "الحمد لله 🤍",
  "لا إله إلا الله 🤍",
  "الله أكبر 🤍",
  "استغفر الله 🤍",
  "لا حول ولا قوة إلا بالله 🤍",
  "اللهم صل وسلم على نبينا محمد ﷺ 🤍"
];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);

  if (!channel) {
    console.log("Channel not found!");
    return;
  }

  setInterval(() => {
    const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
    channel.send(randomZikr);
  }, 7200000); // كل ساعتين
});

client.login(TOKEN);
