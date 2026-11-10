const { Telegraf } = require('telegraf');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Hiba: A BOT_TOKEN környezeti változó nincs beállítva!');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply('A FOMO Bot sikeresen elindult és figyel!');
});

bot.command('status', (ctx) => {
  ctx.reply('A bot aktív és fut a felhőben!');
});

bot.launch();
console.log('A Telegram bot elindult...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
