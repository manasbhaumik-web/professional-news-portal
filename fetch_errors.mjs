import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.message || err));
        
        await page.goto('https://thehorizonpost-363602571141.europe-west1.run.app/', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        await browser.close();
        console.log('Puppeteer finished successfully');
    } catch(err) {
        console.error('Puppeteer Script Error:', err);
    }
})();
