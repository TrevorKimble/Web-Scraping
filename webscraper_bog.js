/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable id-length */
const cheerio = require(`cheerio`)
const puppeteer = require(`puppeteer`)

const EBMSData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    const username = `<redacted>`
    const password = `<redacted>`

    await page.goto(`<redacted>`, { waitUntil: `domcontentloaded`, })

    await page.type(`input[type='text']`, username)
    await page.type(`input[type='password']`, password)
    await page.click(`input[type='submit']`)
  
    await page.goto(`<redacted>`, { waitUntil: `domcontentloaded`, })

    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll(`.block.block-book a[href]`)
        return Array.from(linkElements).map((link) => link.href)
    })

    for (const link of links) {
        await page.goto(link, { waitUntil: `domcontentloaded`, })
        const bodyHTML = await page.evaluate(() => document.body.innerHTML)
        const $ = cheerio.load(bodyHTML)
        let title = $(`h1`).last().text()
        title = title.replaceAll(`(`, ``).replaceAll(`)`, ``).replaceAll(`,`, ``).replaceAll(`"`, ``).replaceAll(`-`, ``).replaceAll(`/`, ``).replaceAll(`\\`, ``).replaceAll(`:`, ``).replaceAll(` `, `_`).replaceAll(`__`, `_`)
        const pdfPath = `pdfs/${title}.pdf`
        await page.pdf({ path: pdfPath })
        console.log(`PDF saved: ${pdfPath}`)
    }

    await browser.close()
}

EBMSData()