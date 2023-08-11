// app.js
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;
// Middleware to parse JSON data in the request body
app.use(express.json());


var browser;
var page;

async function startup() {
    browser = await puppeteer.launch({
        headless: false,
        timeout: 120000,
        defaultViewport: { width: 1300, height: 800 },
    });
    page = await browser.newPage();

    await page.goto('https://goexch777.com/admin', { timeout: 90000 });
    await login();
}

startup();


// POST endpoint for user registration
app.post('/register', async (req, res) => {
    try {
        const { username } = req.body;

        const result = await register(username);

        // Return success message
        res.json({ message: 'User registration successful', result });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/changepass', async (req, res) => {
    try {
        const { username, pass, confirmpass } = req.body;

        const result = await changePass(username, pass, confirmpass);

        // Return success message
        res.json({ message: 'Password Change successful', result });
    } catch (error) {
        console.error('Error during password change:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/deposit', async (req, res) => {
    try {
        const { username, amount } = req.body;

        const result = await deposit(username, amount);

        // Return success message
        res.json({ message: 'deposited successfully', result });
    } catch (error) {
        console.error('Error during deposit:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/withdraw', async (req, res) => {
    try {
        const { username, amount } = req.body;

        const result = await withdraw(username, amount);

        // Return success message
        res.json({ message: 'Withdrawn successfully', result });
    } catch (error) {
        console.error('Error during withdrawal:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/lockuser', async (req, res) => {
    try {
        const { username } = req.body;

        const result = await lockUser(username);

        res.json({ message: 'User locked successfully', result });
    } catch (error) {
        console.error('Error during User Lock:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function register(username) {

    try {
        await login();
        page.waitForNavigation();
        await page.goto('https://goexch777.com/admin/users/insertuser', { timeout: 120000 });

        page.waitForNavigation();

        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[1]/div/div/div[1]/input', { timeout: 120000 })
            .then(element => element.type(username));
        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[1]/div/div/div[2]/input', { timeout: 120000 })
            .then(element => element.type(username));
        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[1]/div/div/div[3]/input', { timeout: 120000 })
            .then(element => element.type('Abcd@332211'));
        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[1]/div/div/div[4]/input', { timeout: 120000 })
            .then(element => element.type('Abcd@332211'));
        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[2]/div/div/div[2]/select', { timeout: 120000 })
            .then(element => element.select('7'));
        await page.waitForXPath('/html/body/div[2]/div/div[2]/div/div/div/form/div/div[2]/div/div/div[5]/input', { timeout: 120000 })
            .then(element => element.type('244092\n'));


    } catch (error) {
        console.error('Error', error.message);
        return { success: false, error: error.message };
    }
}


async function login() {
    let cookies = await page.cookies();

    if (!isRememberCookiePresent(cookies)) {
        await page.waitForXPath('/html/body/div[2]/div/div/div/div[1]/div[3]/button')
            .then(element => element.click());
        await page.waitForSelector('#input-1');
        await page.type('#input-1', 'Xgoapi');
        await page.type('#input-2', 'More1234\n');
        await page.waitForNavigation({ timeout: 90000 });
        console.log('login successful');
    }
}

function isRememberCookiePresent(cookies) {
    for (const cookie of cookies) {
        if (cookie.name === 'rememberMe') {
            return true;
        }
    }

    return false;
}


async function changePass(username, pass, confirmpass) {
    try {
        await login();
        page.waitForNavigation();
        console.log("Redirecting");

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });
        page.waitForNavigation();
        console.log("Redirected");

        // Wait for the search input field and type username
        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });
        const searchInput = await page.$('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input');
        await searchInput.type(username + '\n');
        await page.waitForSelector(`span[title='${username}']`);
        console.log("searching username");

        let js = `
        document.querySelector('span[title="${username}"]').parentElement.parentElement.children[6].firstChild.children[2].click();
        `;
        let res = await page.evaluate(js);
        res = await page.evaluate(`document.querySelector('ul[role="tablist"]').children[1].firstChild.click();`);

        await page.waitForSelector('input[name="userchangepasswordpassword"]', { timeout: 120000 })
            .then(element => element.type(pass));
        await page.waitForSelector('input[name="userchangepasswordcpassword"]', { timeout: 120000 })
            .then(element => element.type(confirmpass));
        console.log("entered pass");
        await page.waitForSelector('input[name="userchangepasswordmpassword"]', { timeout: 120000 })
            .then(element => element.type("244092\n"));
        console.log("password changed !!");
    } catch (error) {
        console.error('Error', error.message);
        return { success: false, error: error.message };
    }
}

async function lockUser(username) {
    try {
        await login();
        page.waitForNavigation();
        console.log("Redirecting");

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });
        page.waitForNavigation();
        console.log("Redirected");

        // Wait for the search input field and type username
        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });
        const searchInput = await page.$('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input');
        await searchInput.type(username + '\n');
        await page.waitForSelector(`span[title='${username}']`);
        console.log("searching username");

        let js = `
        document.querySelector('span[title="${username}"]').parentElement.parentElement.children[6].firstChild.children[2].click();`;
        let res = await page.evaluate(js);
        res = await page.evaluate(`document.querySelector('ul[role="tablist"]').children[2].firstChild.click();`);

        res = await page.evaluate(`document.querySelector('form[data-vv-scope="UserLock"]').children[1].children[1].firstChild.click();`)

        await page.waitForSelector('input[name="UserLockMpassword"]', { timeout: 120000 })
            .then(element => element.type("244092\n"));

        console.log("user locked !!");

    } catch (error) {
        console.error('Error', error.message);
        return { success: false, error: error.message };
    }
}


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    browser.close();
});
