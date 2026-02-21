const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.once('ready', () => {
  console.log('Rap Tounsi Radio Bot is Online!');
});

client.on('messageCreate', async (message) => {
  if (message.content === '+join') {
    if (message.member.voice.channel) {

      joinVoiceChannel({
        channelId: message.member.voice.channel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      message.reply('دخلت للـ Voice ✅');

    } else {
      message.reply('ادخل انت للـ Voice الأول ❌');
    }
  }
});

client.login(process.env.TOKEN);
