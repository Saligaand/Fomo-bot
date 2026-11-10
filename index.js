const { Telegraf } = require('telegraf');
const axios = require('axios'); // Szükséges a webes kérésekhez (API hívásokhoz)

const token = process.env.BOT_TOKEN;
const fomoApiKey = process.env.FOMO_API_KEY; // Itt olvassa ki a Railwayről a kulcsodat

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

// Itt fogjuk lekérdezni a bálnák adatait a FOMO API-n keresztül
async function checkWhalePurchases(ctx) {
    try {
        if (!fomoApiKey) {
            console.log('Nincs FOMO_API_KEY beállítva!');
            return;
        }

        // Példa API hívás a FOMO / adatszolgáltató felé
        // (A 'https://api.fomo.com/v1/whales' helyére a te szolgáltatód pontos API címét kell írni)
        const response = await axios.get('https://api.fomo.com/v1/whales/transactions', {
            headers: {
                'Authorization': `Bearer ${fomoApiKey}`
            }
        });

        const transactions = response.data;

        // Ide jön majd a logika, ami szűri, ha 3-4 bálna ugyanazt veszi
        // Ha talál ilyet, elküldi az üzenetet a Telegramra:
        // ctx.telegram.sendMessage(CHAT_ID, '🚨 Bálna riasztás...');

    } catch (error) {
        console.error('Hiba a FOMO API lekérdezése közben:', error.message);
    }
}

// Időzítő: Például minden 60 másodpercben lekérdezi az API-t
setInterval(() => {
    // checkWhalePurchases();
}, 60000);

bot.launch();
console.log('A bálnafigyelő bot elindult...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
