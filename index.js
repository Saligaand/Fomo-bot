const { Telegraf } = require('telegraf');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const fomoApiKey = process.env.FOMO_API_KEY;

if (!token) {
    console.error('Hiba: A BOT_TOKEN környezeti változó hiányzik!');
    process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) => {
    ctx.reply('🐳 A FOMO Bálnafigyelő bot elindult és készenlétben áll!');
});

bot.command('status', (ctx) => {
    const hasKey = fomoApiKey ? 'Igen' : 'Nem';
    ctx.reply(`✅ A bot fut!\nFOMO API kulcs beállítva: ${hasKey}`);
});

// Bálnák ellenőrzése a FOMO API-n keresztül
async function checkWhalePurchases(ctxChatId = null) {
    try {
        if (!fomoApiKey) {
            console.log('Nincs FOMO_API_KEY megadva.');
            return;
        }

        // Itt történik a lekérdezés a FOMO API-tól
        const response = await axios.get('https://api.fomoapi.dev/v1/whales', {
            headers: {
                'Authorization': `Bearer ${fomoApiKey}`
            }
        });

        console.log('API adatok sikeresen lekérdezve:', response.data);
        
        // Ha kapunk új bálna tranzakciókat, azokat továbbíthatjuk
        // (A szerver oldalon ez fut a háttérben percenként)

    } catch (error) {
        console.error('Hiba a FOMO API lekérdezése közben:', error.message);
    }
}

// Automatikus ellenőrzés 60 másodpercenként
setInterval(() => {
    checkWhalePurchases();
}, 60000);

bot.launch();
console.log('A bálnafigyelő bot elindult és figyel...');

// Biztonságos leállítás
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
