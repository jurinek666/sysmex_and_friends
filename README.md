# SYSMEX & Friends

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project notes (SYSMEX & Friends)

### Requirements

- Node.js 20.9+ recommended (LTS)
- PostgreSQL database (Prisma)

### Setup (local)

1) Install deps

```bash
npm ci
```

1) Create `.env` from `.env.example` and set `DATABASE_URL`.

2) Prisma: generate + migrate + seed (optional)

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

1) Run dev server

1) Run dev server

```bash
npm run dev
```

### Routes implemented

- `/` (home)
- `/clanky` + `/clanky/[slug]`
- `/vysledky` (filter via `?season=CODE`)
- `/tym`
- `/galerie`

### Admin (interní)

Admin je na `/admin` a je chráněný HTTP Basic Auth přes `proxy.ts`.

V `.env` / Render nastav:

- `ADMIN_USER`
- `ADMIN_PASSWORD`

Pokud nejsou proměnné nastavené, `/admin` se v dev režimu neblokuje.

### Lint / Typecheck / Build

```bash
npm run lint
npm run check
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
