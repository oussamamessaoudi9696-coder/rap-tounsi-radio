require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

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
  "﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾",
  "﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾",
  "﴿ وَتَوَكَّلْ عَلَى اللَّهِ وَكَفَىٰ بِاللَّهِ وَكِيلًا ﴾",
  "﴿ رَبِّ اشْرَحْ لِي صَدْرِي ﴾",
  "﴿ حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ﴾",
  "﴿ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ﴾",
  "﴿ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ ﴾",
  "﴿ رَبِّ زِدْنِي عِلْمًا ﴾",
  "سبحان الله وبحمده، سبحان الله العظيم 🤍",
  "لا إله إلا أنت سبحانك إني كنت من الظالمين 🤍",
  "اللهم صل وسلم على نبينا محمد 🤍",
  "أستغفر الله العظيم وأتوب إليه 🤍"
];

async function sendZikr(channel) {
  const randomZikr = azkar[Math.floor(Math.random() * azkar.length)];

  const embed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle("🕌 ذكر اليوم")
    .setDescription(`✨ ${randomZikr}`)
    .setFooter({ text: "🤍 Azkar Bot - تذكير دائم بذكر الله" })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}

client.once("clientReady", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel) return console.log("Channel not found!");

    // أول ذكر مباشرة
    await sendZikr(channel);

    // كل ساعتين
    setInterval(() => {
      sendZikr(channel);
    }, 7200000);

  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);
