const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes 
} = require("discord.js");

const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource 
} = require("@discordjs/voice");

const play = require("play-dl");

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song name or URL')
        .setRequired(true))
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('Commands registered!');
  } catch (error) {
    console.error(error);
  }
})();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const player = createAudioPlayer();

client.once("ready", async () => {
  console.log(`Ready as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "play") {

    const query = interaction.options.getString("song");

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply("❌ ادخل voice channel اول");
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
        inputType: stream.type
      });

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
      });

      connection.subscribe(player);

      player.play(resource);

      interaction.editReply(`🎧 توا نشغل: ${result[0].title}`);

    } catch (err) {
      console.log(err);
      interaction.editReply("❌ صار error");
    }

  }

});

client.login(TOKEN);
