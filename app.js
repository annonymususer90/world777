
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

var browser;
var page;

(async function () {
    browser = await puppeteer.launch({
        headless: false,
        timeout: 120000,
        defaultViewport: { width: 1300, height: 800 },
    });
    page = await browser.newPage();
    await login();
})();


// POST endpoint for user registration
app.post('/register', async (req, res) => {
    try {
        const { username } = req.body;

        const result = await register(username);
        if (result.success == false)
            res.json({ message: 'User registration not successful', result });
        else
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
        if (result.success == false)
            res.json({ message: 'deposit not successful', result });
        else
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
        if (result.success == false)
            res.json({ message: 'withdraw not successful', result });
        else
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
    let page = await browser.newPage();
    try {
        await login();
        await page.goto('https://goexch777.com/admin/users/insertuser', { timeout: 120000 });

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

        await page.waitForNavigation({ timeout: 1000 })
            .then(() => console.log("waited for navigation"))
            .catch(async err => {
                let url = await page.url();
                if (url !== null && url !== "https://goexch777.com/admin/activeusers") {
                    throw new Exception("invalid username");
                }
            });

        return { success: true }

    } catch (error) {
        console.error('Error', error.message);
        return { success: false, error: "invalid username" };
    } finally {
        page.close();
    }
}


async function login() {
    try {
        let cookies = await page.cookies();

        if (!isRememberCookiePresent(cookies)) {
            await page.goto('https://goexch777.com/admin', { timeout: 90000 });
            await page.waitForXPath('/html/body/div[2]/div/div/div/div[1]/div[3]/button')
                .then(element => element.click());
            await page.waitForSelector('#input-1');
            await page.type('#input-1', 'Xgoapi');
            await page.type('#input-2', 'More1234');
            await page.evaluate(`document.querySelector('form[data-vv-scope="form-login"]').children[2].firstChild.click();`);
            await page.waitForNavigation({ timeout: 90000 });
            console.log('login successful');
        }
    } catch (err) {

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
    let page = await browser.newPage();

    try {
        await login();
        console.log("Redirecting");

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });
        console.log("Redirected");

        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });
        const searchInput = await page.$('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input');
        await searchInput.type(username + '\n');
        await page.waitForSelector(`span[title='${username}']`, { timeout: 3000 }).catch(() => {
            throw new Error("invalid username");
        });

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
    } finally {
        page.close();
    }
}

async function lockUser(username) {
    let page = await browser.newPage();
    try {
        await login();

        console.log("Redirecting");

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });
        console.log("Redirected");


        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });

        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input')
            .then(element => element.type(username + "\n"));
        await page.waitForSelector(`span[title='${username}']`, { timeout: 3000 })
            .catch(() => {
                throw new Error("invalid username");
            });
        console.log("searching username");

        await page.evaluate(`document.querySelector('span[title="${username}"]').parentElement.parentElement.children[6].firstChild.children[2].click();`);
        await page.evaluate(`document.querySelector('ul[role="tablist"]').children[2].firstChild.click();`);


        await page.waitForSelector('input[name="UserLockMpassword"]')
            .then(async element => await element.type("244092\n"));

        console.log("user locked !!");

    } catch (error) {
        await login();
        console.error('Error', error.message);
        return { success: false, error: error.message };
    } finally {
        page.close();
    }
}


async function deposit(username, amount) {
    let page = await browser.newPage();
    try {
        await login();
        // page.waitForNavigation();
        console.log("Redirecting");

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });
        console.log("Redirected");

        // Wait for the search input field and type username
        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });

        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input')
            .then(element => element.type(username + "\n"));
        await page.waitForSelector(`span[title='${username}']`, { timeout: 3000 }).catch(() => {
            throw new Error("invalid username");
        });
        console.log("searching username");

        await page.evaluate(`document.querySelector('span[title="${username}"').parentElement.parentElement.children[1].children[0].click();`);
        await page.evaluate(`document.querySelector('ul[role="tablist"]').children[0].firstChild.click();`);

        // await page.evaluate(`document.querySelector('input[name="userCreditUpdateamount"]').value = '${amount}';`, { timeout: 3000 });

        const element = await page.waitForSelector('input[name="userCreditUpdateamount"]', { timeout: 30000 });
        await element.type(amount);

        await page.evaluate((amount) => {
            const element = document.querySelector('input[name="userCreditUpdateamount"]');
            if (element && element.value !== amount) {
                element.value = amount;
            }
        }, amount);

        console.log("entered pass");
        await page.waitForSelector('input[name="userCreditUpdatempassword"]', { timeout: 30000 })
            .then(element => element.type("244092\n"));

        await page.waitForSelector('.swal2-container.swal2-top-end.swal2-backdrop-show');
        let msg = await page.evaluate(`document.querySelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]').children[0].children[1].firstChild.innerText;`);
        console.log(msg);
        if (msg.includes("Your Client Does Not Have Sufficient Credit")) {
            return {
                success: false, error: msg
            };
        };

        return {
            success: true,
            message: msg
        };
    } catch (error) {
        await login();
        console.error('Error', error.message);
        return { success: false, error: error.message };
    } finally {
        page.close();
    }
}

async function withdraw(username, amount) {
    let page = await browser.newPage();
    try {
        await login();
        // page.waitForNavigation();

        await page.goto('https://goexch777.com/admin/users', { timeout: 120000 });

        // Wait for the search input field and type username
        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input', { timeout: 120000 });

        await page.waitForSelector('#layout-wrapper > div.main-content > div > div > div > div.row.account-list > div > div > div > div.row.row5 > div.col-md-6.mb-2.search-form > form > div.d-inline-block.form-group.form-group-feedback.form-group-feedback-right > input')
            .then(element => element.type(username + "\n"));
        await page.waitForSelector(`span[title='${username}']`, { timeout: 3000 }).catch(() => {
            throw new Error("invalid username");
        });

        await page.evaluate(`document.querySelector('span[title="${username}"').parentElement.parentElement.children[1].firstChild.click();`);

        await page.evaluate(`document.querySelector('ul[role="tablist"]').children[1].firstChild.click();`);

        // await page.waitForSelector('input[name="userWithdrawCreditUpdateamount"]', { timeout: 120000 })
        //     .then(element => element.type(amount));

        const element = await page.waitForSelector('input[name="userWithdrawCreditUpdateamount"]', { timeout: 30000 });
        await element.type(amount);

        await page.evaluate((amount) => {
            const element = document.querySelector('input[name="userWithdrawCreditUpdateamount"]');
            if (element && element.value !== amount) {
                element.value = amount;
            }
        }, amount);

        await page.waitForSelector('input[name="userWithdrawCreditUpdatempassword"]', { timeout: 120000 })
            .then(element => element.type("244092\n"));

        await page.waitForSelector('.swal2-container.swal2-top-end.swal2-backdrop-show');
        let msg = await page.evaluate(`document.querySelector('div[class="swal2-container swal2-top-end swal2-backdrop-show"]').children[0].children[1].firstChild.innerText;`);

        if (msg.includes("Your Client Does Not Have Sufficient Balance")) {
            return {
                success: false, error: msg
            };
        };

        return {
            success: true,
            message: msg
        };


    } catch (error) {
        await login();
        return { success: false, error: error.message };
    } finally {
        page.close();
    }
}

app.listen(PORT);

process.on('SIGINT', () => {
    browser.close();
});
