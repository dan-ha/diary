const puppeteer = require('puppeteer');
const assert = require('chai').assert;
const util = require('util');
const { URL } = require('url');

function frameEvent(evtname, frame) {
    console.log(`${evtname} ${frame.url()} ${frame.title()}`);
}

function ignoreURL(url) {
    if (url.match(/\/assets\//) === null
        && url.match(/\/fonts.gstatic.com/) === null
        && url.match(/\/fonts.googleapis.com/ === null)) {
        return false;
    } else {
        return true;
    }
}

describe("Diary", function () {
    this.timeout(10000);
    let browser;
    let page;

    before(async function () {
        browser = await puppeteer.launch({ slomo: 500 });
        page = await browser.newPage();

        page.on('console', msg => {
            console.log(`${msg.type()} ${msg.text()} ${msg.args().join(' ')}`);
        });
        page.on('error', err => {
            console.error(`page ERROR ${err.stack}`);
        });
        page.on('pageerror', err => {
            console.error(`page PAGEERROR ${err.stack}`);
        });
        page.on('request', req => {
            if (ignoreURL(req.url())) return;
            console.log(`page request ${req.method()} ${req.url()}`);
        });
        page.on('respose', async (res) => {
            if (ignoreURL(res.url())) return;
            console.log(`page response ${res.status()} ${res.url()}`);
        });
        page.on('frameattached', async (frame) => frameEvent('frameattached', await frame));
        page.on('framedetached', async (frame) => frameEvent('framedetached', await frame));
        page.on('framenavigated', async (frame) => frameEvent('framenavigated', await frame));
        await page.goto(process.env.DIARY_HOME_URL);
    });

    after(async function () {
        await page.close();
        await browser.close();
    });

    describe("Login", function () {
        it('shoul click on login button', async function () {
            const btnLogin = await page.waitForSelector('#btnLoginLocal');
            await btnLogin.click();
        });
        it('should fill in login form', async function () {
            const loginForm = await page.waitForSelector('#diaryLoginPage #diaryLoginForm');
            await page.type('#diaryLoginForm #username', "me");
            await page.type('#diaryLoginForm #password', "pass");
            await page.click('#formLoginBtn');
        });
        it('should return to home page', async function () {
            const home = await page.waitForSelector('#diaryHomePage');
            const btnLogout = await page.waitForSelector('#btnLogout');
            const btnAddEntry = await page.$('#btnAddEntry');
            assert.exists(btnAddEntry);
        })
    });

    describe("Add diary Entry", function () {
        it("should see Add button", async function () {
            const btnAddEntry = await page.waitForSelector('#btnAddEntry');
            await btnAddEntry.click();
        });
        it("should fill in Add Entry form", async function () {
            const formAddEditEntry = await page.waitForSelector('#formAddEditEntry');
            await page.type('#date', '01/01/0001');
            await page.type('#title', 'Test Title');
            await page.type('#content', 'Test Content');
            await page.click('#btnSave');
        });
        it("should view entry", async function () {
            await page.waitForSelector('#entryView');
            // Entry Date
            const shownDate = await page.$eval('#showDate', el => el.innerText);
            assert.exists(shownDate);
            assert.isString(shownDate);
            assert.include(shownDate, '01/01/0001');
            // Entry Title
            const shownTitle = await page.$eval('#entryTitle', el => el.innerText);
            assert.exists(shownTitle);
            assert.isString(shownTitle);
            assert.include(shownTitle, 'Test Title');
            // Entry Content
            const shownContent = await page.$eval('#entryContent', el => el.innerText);
            assert.exists(shownContent);
            assert.isString(shownContent);
            assert.include(shownContent, 'Test Content');
        });
        it("should go to home page", async function () {
            await page.waitForSelector('#btnGoHome');
            await page.goto(process.env.DIARY_HOME_URL);
            // await page.click('#btnGoHome');
            await page.waitForSelector('#diaryHomePage');
            const titles = await page.$('#diaryTitles');
            assert.exists(titles);
            const date01 = await page.$('#01\/01\/0001');
            assert.exists(date01);
            const btnLogout = await page.$('#btnLogout');
            assert.exists(btnLogout);
            const btnAddEntry = await page.$('#btnAddEntry');
            assert.exists(btnAddEntry);
        })
    })
});