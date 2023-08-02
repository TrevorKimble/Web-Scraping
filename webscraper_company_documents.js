/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable id-length */
const cheerio = require(`cheerio`)
const puppeteer = require(`puppeteer`)

const EBMSData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        IgnoreHTTPSErrors: true,
        args: [
            `--proxy-server='direct://'`,
            `--proxy-bypass-list=*`,
            `--disable-gpu`,
            `--disable-dev-shm-usage`,
            `--disable-setuid-sandbox`,
            `--no-first-run`,
            `--no-sandbox`,
            `--no-zygote`,
            `--single-process`,
            `--ignore-certificate-errors`,
            `--ignore-certificate-errors-spki-list`,
            `--enable-features=NetworkService`
        ]
    })
  
    const page = await browser.newPage()
  
    originLink = `<redacted>/documentation/`

    await page.goto(`<redacted>`, { waitUntil: `domcontentloaded` })


    await page.type(`input[type="text"]`, `<redacted>`)

    await page.type(`input[type="password"]`, `<redacted>`)

    await page.click(`input[type="submit"]`)
  
    await page.goto(originLink, { waitUntil: `domcontentloaded` })
  
    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll(`a[href]`)
        return Array.from(linkElements).map((link) => link.href)
    })
  
    for (let a = 0; a < links.length; a++) {
        const link = links[a]
        if (link.includes(`<redacted>/departments`)) {
            await page.goto(link, { waitUntil: `domcontentloaded` })

            const linksInternal = await page.evaluate(() => {
                const linkElements = document.querySelectorAll(`a[href]`)
                return Array.from(linkElements).map((link) => link.href)
            })
            console.log(`\n\n\n New Page #${a}\n\n\n`)
            for (let b = 0; b < linksInternal.length; b++) {
                const linkInternal = linksInternal[b]

                if (linkInternal.includes(`docs`)) {
                    await page.goto(linkInternal, { waitUntil: `domcontentloaded` })
                    const bodyHTML = await page.evaluate(() => document.body.innerHTML)
                    const $ = cheerio.load(bodyHTML)
                    let title = $(`h1:nth-child(1)`).text()
                    title = title.replaceAll(`(`, ``).replaceAll(`)`, ``).replaceAll(`,`, ``).replaceAll(`"`, ``).replaceAll(`-`, ``).replaceAll(`/`, ``).replaceAll(`\\`, ``).replaceAll(`:`, ``).replaceAll(`-`, ``).replaceAll(`#`, ``).replaceAll(` `, `_`).replaceAll(`__`, `_`)
                    const pdfPath = `pdfs/${title}.pdf`
                    await page.pdf({ path: pdfPath })
                    console.log(`Page: ${pdfPath}`)
                }
            }
    
        }
    }
    await browser.close()
}

EBMSData()