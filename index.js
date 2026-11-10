const { Telegraf } = require('telegraf');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const fomoApiKey = process.env.FOMO_API_KEY;

if (!token) {
    console.error('Hiba: A BOT_TOKEN környezeti változó nincs beállítva!');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply('🐋 A FOMO Bálnafigyelő Bot elindult és aktívan figyeli a láncot a megadott API-val!');
});

bot.command('status', (ctx) => {
    const hasKey = fomoApiKey ? 'Igen (Beállítva)' : 'Nincs beállítva';
    ctx.reply(`✅ A bot fut!\nFOMO API kapcsolat: ${hasKey}`);
});

async function checkWhalePurchases() {
    try {
        if (!fomoApiKey) {
            console.log('Nincs FOMO_API_KEY beállítva!');
            return;
        }

        // Ide jön majd a te FOMO API végpontod, ha pontosítod a címet
        const response = await axios.get('https://api.fomo.com/v1/whales/transactions', {
            headers: {
                'Authorization': `Bearer ${fomoApiKey}`
            }
        });

        console.log('API adatok lekérdezve:', response.data);

    } catch (error) {
        console.error('Hiba a FOMO API lekérdezése közben:', error.message);
    }
}

// Ellenőrzés 60 másodpercenként
setInterval(() => {
    checkWhalePurchases();
}, 60000);

bot.launch();
console.log('A bálnafigyelő bot elindult...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
