import { convert } from 'html-to-text';
import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  
  // Fetch the HTML content of the URL.
  const htmlData = (await (await fetch(data.url, {
    'headers': {
      "cookie": 'share=' + process.env.IDE_SHARE_CODE,
    },
  })).text());

  // Only get the content of body of ".main-content__container" element.
  // Ignore the image reading.
  // Ignore the elements which are visually hidden.
  const options = {
      baseElements: { selectors: ['body'] },
      selectors: [
        { selector: 'a', options: { linkBrackets: false, ignoreHref: true } },
        { selector: 'img', format: 'skip' },
        { selector: '.visually-hidden', format: 'skip' }
      ]
  }
  const convertedData = convert(htmlData, options);

  console.log(convertedData);

  // Initialize OpenAI API
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // OpenAI api call to get the result.
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a content auditor. You are responsible to review the content and provide feedback whether content is fully translated in " + data.language + "language or not. If content is not full translated, you provide content which is not translated in JSON format with key 'not_translated'. If full translated, provide in JSON key 'fully_translated'" },
      { role: "user", content: convertedData }
    ],
    model: process.env.OPENAI_MODEL,
    response_format: { "type":"json_object" }
  });

  console.log(chatCompletion.choices[0]);

  console.log(chatCompletion.choices[0]['message']['content']);
  
  return NextResponse.json({ message: chatCompletion.choices[0]['message']['content'] });

}