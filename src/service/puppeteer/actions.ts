import { launch } from 'puppeteer'
import { getAvailableClasses } from './evaluate'

const AUTIUS_URL = 'https://gestion.autius.com'

export async function getClasses() {
  const browser = await launch({
    headless: true,
    defaultViewport: null,
    args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
  })

  try {
    const [ page ] = await browser.pages()

    await page.goto(AUTIUS_URL, { waitUntil: 'networkidle0' })

    await page.type('#user', process.env.AUTIUS_USER)
    await page.type('#password', process.env.AUTIUS_PASS)
    await page.keyboard.press('Enter')

    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    return await page.evaluate(getAvailableClasses)
  } finally {
    await browser.close()
  }
}
