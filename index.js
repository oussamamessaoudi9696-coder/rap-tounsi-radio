require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(3000, () => {
  console.log("Web server started");
});
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder 
} = require("discord.js");

const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource 
} = require("@discordjs/voice");

const play = require("play-dl");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ],
});

const commands = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption(option =>
      option.setName("song")
        .setDescription("Song name or URL")
        .setRequired(true)
    )
    .toJSON(),
];

client.once("ready", async () => {
  console.log(`Ready as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    console.log("Registering commands...");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
});

const player = createAudioPlayer();

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {
    const query = interaction.options.getString("song");

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply("❌ ادخل voice channel أولاً");
    }

    await interaction.reply("🔎 نلوج على الغناية...");

    try {
      const result = await play.search(query, { limit: 1 });

      if (!result.length) {
        return interaction.editReply("❌ ما لقيتش الغناية");
      }

      const url = result[0].url;
      const stream = await play.stream(url);

      const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      connection.subscribe(player);
      player.play(resource);

      interaction.editReply(`🎶 Now playing: ${result[0].title}`);
    } catch (error) {
      console.error(error);
      interaction.editReply("❌ صار مشكل");
    }
  }
});

client.login(TOKEN);
