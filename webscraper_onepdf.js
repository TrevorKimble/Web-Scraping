const puppeteer = require(`puppeteer`)
const PDFDocument = require(`pdfkit`)
const fs = require(`fs`)

let links

const EBMSData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    })

    const page = await browser.newPage()

    const originLink = `https://www.etown.edu/`
  
    await page.goto(originLink, { waitUntil: `domcontentloaded`, })

    links = await page.evaluate(() => {
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

            const newLinksUnique = [...new Set(newLinks)]

            links = links.concat(newLinksUnique)

            const linksUnique = [...new Set(links)]

            links = linksUnique

            console.log(links.length)
        // const pdfPath = `pdfs2/${x}.pdf`
        // await page.pdf({ path: pdfPath })
        // console.log(`PDF saved: ${pdfPath}`)
        // x += 1
        }
    }
    // console.dir(links, { 'maxArrayLength': null })
    await browser.close()
}

async function scrapeData(links) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const pageTitles = []
  
    for (const link of links) {
        await page.goto(link)
        const title = await page.title()
        pageTitles.push(title)
        console.log(title)
    }
  
    await browser.close()
    return pageTitles
}

function generatePDF(data) {
    const doc = new PDFDocument()
    doc.pipe(fs.createWriteStream(`pdfs2/output.pdf`))
  
    for (const title of data) {
        doc.fontSize(20).text(title, { align: `center` })
        doc.moveDown()
    }
  
    doc.end()
}

console.log(`test`)
  
EBMSData()
    .then(console.log(`test2`))


scrapeData(links).then((pageTitles) => {
    generatePDF(pageTitles)
    console.log(`PDF generated successfully!`)
}).catch((error) => {
    console.error(error)
})