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

    originLink = `https://findbullionprices.com`
  
    await page.goto(originLink, { waitUntil: `domcontentloaded`, })

    let links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll(`a[href]`)
        return Array.from(linkElements).map((link) => link.href)
    })
    console.log(links.length)

    // let x = 0
    for (const link of links) {
        if (link.includes(originLink)) {
            await page.goto(link, { waitUntil: `domcontentloaded`, })

            const newLinks = await page.evaluate(() => {
                const linkElements = document.querySelectorAll(`a[href]`)
                return Array.from(linkElements).map((link) => link.href)
            })

            newLinksUnique = [...new Set(newLinks)]

            links = links.concat(newLinksUnique)

            console.log(links.length)
            // const pdfPath = `pdfs2/${x}.pdf`
            // await page.pdf({ path: pdfPath })
            // console.log(`PDF saved: ${pdfPath}`)
            // x += 1
        }
    }

    await browser.close()
}

EBMSData()