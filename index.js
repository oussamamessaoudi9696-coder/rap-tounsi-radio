require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Azkar Bot is running!");
});

app.listen(3000, () => {
  console.log("Web server started");
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const azkar = [
  "سبحان الله 🤍",
  "الحمد لله 🤍",
  "الله أكبر 🤍",
  "لا إله إلا الله 🤍",
  "استغفر الله 🤍",
  "لا حول ولا قوة إلا بالله 🤍",
  "اللهم صل وسلم على نبينا محمد 🤍"
];

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log("Channel not found!");
      return;
    }

    // يبعث أول ذكر مباشرة
    const firstZikr = azkar[Math.floor(Math.random() * azkar.length)];
    await channel.send(firstZikr);

    // يبعث كل ساعتين
    setInterval(async () => {
      const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];
      await channel.send(randomZikr);
    }, 7200000);

  } catch (error) {
    console.error("Error:", error);
  }
});

client.login(TOKEN);
