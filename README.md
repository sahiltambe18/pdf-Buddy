This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

## get an new .env file and add these in it:

1.setup a Postgres database and paste its link here

DATABASE_URL=

run the following command

```bash
npx prisma db push
npx prisma generate
```

2.Go to google console and create new project set OAuth and GenAi Requests

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_API_KEY =


3.NextAuth Secret

NEXTAUTH_SECRET=

4. Domain 

NEXTAUTH_URL="http://localhost:3000"

5. Go to uploadThing , this is the wrapper around AWS S3 bucket
 create new project and get the following credentials

UPLOADTHING_SECRET=

UPLOADTHING_APP_ID=

UPLOADTHING_APP_ID=

6.Head to pinecone , It is a vector database to store pdf semantics and get api key

PINECONE_API_KEY = 


## You are ready to go

run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
