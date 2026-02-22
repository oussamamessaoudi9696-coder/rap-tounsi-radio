const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song')
    .addStringOption(option =>
      option.setName('song')
        .setDescription('Song name or YouTube URL')
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
