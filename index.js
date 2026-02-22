const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const guild = client.guilds.cache.first();
  if (!guild) return console.log("No guild found");

  const voiceChannel = guild.channels.cache
    .filter(c => c.type === 2)
    .first();

  if (!voiceChannel)
    return console.log("No voice channel found");

  joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  console.log("Joined:", voiceChannel.name);
});

client.login(process.env.TOKEN);
