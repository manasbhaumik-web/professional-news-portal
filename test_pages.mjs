import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.goto('http://localhost:3001/', { waitUntil: 'load', timeout: 30000 });
        
        const links = await page.$$('nav button, nav a');
        console.log(`Found ${links.length} nav links`);
        
        for (let i = 0; i < links.length; i++) {
            const link = (await page.$$('nav button, nav a'))[i];
            const text = await page.evaluate(el => el.textContent, link);
            if (!text || text.trim() === '') continue;
            
            console.log(`Clicking ${text.trim()}...`);
            await link.click().catch(() => {});
            await new Promise(r => setTimeout(r, 1000));
        }
        
        await browser.close();
        
        if (errors.length > 0) {
            console.log("ERRORS FOUND:");
            console.log(errors.join('\n'));
        } else {
            console.log("NO ERRORS FOUND ON ANY PAGE.");
        }
    } catch(err) {
        console.error('Puppeteer Script Error:', err);
    }
})();
