import Document from "~/server/models/Document";
import { H3Error } from 'h3';
import puppeteer from 'puppeteer';
import template from './template.html' assert {type: 'html'}
import { Readable } from 'stream'

async function generatePDFfromHTML(htmlContent:string) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const res = await page.pdf({ format: 'A4' });
  await browser.close();
  return res;
}

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.user._id;
    const id = event.context.params?.id;
    const document = await Document.findById({ _id: id, ownerId: userId }).populate('ownerId collaborators', 'name email');
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Document not found',
      });
    }
    const html = template.replace("${document.content}", document.content);
    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(event, 'Content-Disposition', `attachment; filename="${document.title}.pdf"`);
    return sendStream(event, Readable.from(await generatePDFfromHTML(html)))
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching document",
    });
  }
});
