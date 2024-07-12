import { d as defineEventHandler, c as createError, s as setHeader, a as sendStream, H as H3Error } from '../../../../runtime.mjs';
import { D as Document } from '../../../../_/Document.mjs';
import puppeteer from 'puppeteer';
import { Readable } from 'stream';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'mongoose';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import 'bcrypt';

// ROLLUP_NO_REPLACE 
 const template = "<html>\n  <div\n    contenteditable=\"true\"\n    translate=\"no\"\n    class=\"tiptap ProseMirror\"\n    tabindex=\"0\"\n  >\n    ${document.content}\n  </div>\n  <style>\n    .tiptap {\n      min-height: 24rem;\n      padding: 1em;\n    }\n\n    .tiptap :first-child {\n      margin-top: 0;\n    }\n\n    .tiptap ul,\n    .tiptap ol {\n      list-style: revert;\n      padding: 0 1rem;\n      margin: 1.25rem 1rem 1.25rem 0.4rem;\n    }\n\n    .tiptap ul li p,\n    .tiptap ol li p {\n      margin-top: 0.25em;\n      margin-bottom: 0.25em;\n    }\n\n    .tiptap h1,\n    .tiptap h2,\n    .tiptap h3,\n    .tiptap h4,\n    .tiptap h5,\n    .tiptap h6 {\n      line-height: 1.1;\n      margin-top: 2.5rem;\n      text-wrap: pretty;\n    }\n\n    .heading-button-1,\n    .heading-button-2,\n    .heading-button-3,\n    .heading-button-4 {\n      line-height: 1.4;\n    }\n\n    .tiptap h1,\n    .tiptap h2 {\n      margin-top: 3.5rem;\n      margin-bottom: 1.5rem;\n    }\n\n    .tiptap h1,\n    .heading-button-1 {\n      font-size: 1.4rem;\n    }\n\n    .tiptap h2,\n    .heading-button-2 {\n      font-size: 1.2rem;\n    }\n\n    .tiptap h3,\n    .heading-button-3 {\n      font-size: 1.1rem;\n    }\n\n    .tiptap h4,\n    .tiptap h5,\n    .tiptap h6,\n    .heading-button-4 {\n      font-size: 1rem;\n    }\n\n    .tiptap mark {\n      background-color: #faf594;\n      border-radius: 0.4rem;\n      box-decoration-break: clone;\n      padding: 0.1rem 0.3rem;\n      border: solid;\n    }\n\n    .tiptap blockquote {\n      border-left: 3px solid #cbd5e1;\n      margin: 1.5rem 0;\n      padding-left: 1rem;\n    }\n\n    .tiptap hr {\n      border: none;\n      border-top: 1px solid #94a3b8;\n      margin: 2rem 0;\n    }\n\n    .tiptap a {\n      color: #8b5cf6;\n      cursor: pointer;\n      text-decoration: underline;\n    }\n\n    .tiptap a:hover {\n      color: #5b21b6;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] {\n      list-style: none;\n      margin-left: 0;\n      padding: 0;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] li {\n      align-items: flex-start;\n      display: flex;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] li > label {\n      flex: 0 0 auto;\n      margin-right: 0.5rem;\n      user-select: none;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] li > div {\n      flex: 1 1 auto;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] input[type=\"checkbox\"] {\n      cursor: pointer;\n    }\n\n    .tiptap ul[data-type=\"taskList\"] ul[data-type=\"taskList\"] {\n      margin: 0;\n    }\n\n    .tiptap .collaboration-cursor__caret {\n      border-left: 1px solid #0d0d0d;\n      border-right: 1px solid #0d0d0d;\n      margin-left: -1px;\n      margin-right: -1px;\n      pointer-events: none;\n      position: relative;\n      word-break: normal;\n    }\n\n    /* Render the username above the caret */\n    .tiptap .collaboration-cursor__label {\n      border-radius: 3px 3px 3px 0;\n      color: #0d0d0d;\n      font-size: 12px;\n      font-style: normal;\n      font-weight: 600;\n      left: -1px;\n      line-height: normal;\n      padding: 0.1rem 0.3rem;\n      position: absolute;\n      top: -1.4em;\n      user-select: none;\n      white-space: nowrap;\n    }\n  </style>\n</html>\n";

async function generatePDFfromHTML(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  const res = await page.pdf({ format: "A4" });
  await browser.close();
  return res;
}
const _id__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const userId = event.context.user._id;
    const id = (_a = event.context.params) == null ? void 0 : _a.id;
    const document = await Document.findById({ _id: id, ownerId: userId }).populate("ownerId collaborators", "name email");
    if (!document) {
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found"
      });
    }
    const html = template.replace("${document.content}", document.content);
    setHeader(event, "Content-Type", "application/pdf");
    setHeader(event, "Content-Disposition", `attachment; filename="${document.title}.pdf"`);
    return sendStream(event, Readable.from(await generatePDFfromHTML(html)));
  } catch (error) {
    if (error instanceof H3Error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching document"
    });
  }
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
