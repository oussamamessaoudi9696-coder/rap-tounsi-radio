const ffmpeg = require('ffmpeg-static');
process.env.FFMPEG_PATH = ffmpeg;

const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const sodium = require('libsodium-wrappers');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const TOKEN = process.env.TOKEN;

// رابط اليوتيوب متاع الراديو (بدلو بالرابط متاعك)
const RADIO_URL = "https://www.youtube.com/watch?v=jfKfPfyJRdk";

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

    const stream = await play.stream(RADIO_URL);

    const resource = createAudioResource(stream.stream, {
        inputType: stream.type
    });

    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log("Radio is playing!");
    });

});

client.login(TOKEN);
