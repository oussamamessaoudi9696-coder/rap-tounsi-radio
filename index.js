const ffmpeg = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpeg;

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const sodium = require('libsodium-wrappers');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const TOKEN = process.env.TOKEN;

// رابط اليوتيوب متاع الراديو (بدلو بالرابط متاعك)
const RADIO_URL = "https://youtu.be/d-XtMwMDY4k?si=1kmbQjuWq7guJKPa";

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

    await sodium.ready;

    const guild = client.guilds.cache.first();
    if (!guild) return;

    const channel = guild.channels.cache.get("1474884054112403609");; // voice channel
    if (!channel) return;

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    const stream = ytdl(RADIO_URL, {
  filter: "audioonly",
  quality: "highestaudio",
  highWaterMark: 1 << 25
});

const resource = createAudioResource(stream);

    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log("Radio is playing!");
    });

});

client.login(TOKEN);
