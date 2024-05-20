This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Idea here is to check whether the given page is fully translated in the given language or not.

### Getting Started
<ul>
  <li>It uses OPEN API</li>
  <l1>Given this is just a POC, It assumes the site on Acquia IDE</l1>
  <li>Add the <strong>OPENAI_API_KEY</strong> and <strong>OPENAI_MODEL</strong> environment variables in <strong>.env.local</strong> file.</li>
  <li>If local testing and on Acquia Cloud Ide, then add <strong>IDE_SHARE_CODE</strong> environment variable in <strong>.env.local</strong> file. Generate this using <strong>acli ide:share</strong></li>
</ul>

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For screenshots, refer <strong>/screenshots</strong> directory.
