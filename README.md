# International**StudySpots** 🧐📖

_Previously SadFrogsStudying_

[International**StudySpots**](https://sadfrogs-nextjs.vercel.app/) is an index of beautiful study spots around the world - anywhere that you can sit down and escape the city-mayhem. Locations include cafes, office buildings, food courts and libraries. Users can upload spots and explore existing ones.

## Motivation

I love architecture, interior design and studying. Relocating to a different location always seemed to provide me with newfound energy. Finding an **secret, under-utilised, charming** space that I could just sit and do some work was like striking diamonds.

I figured it would be nice to have a dedicated place that people with similar interests could share these spots. And I can quickly push out features that we all need. Of course wanting to display these spots in an attractive way was a big motivation.

- If you're in another country, helps you to quickly find nice spaces.
- Motivates people to study, read and get out of the house!
- Brings more customers to businesses - just don't stay for hours if it's busy, we're trying to keep them alive 😅!
- Brings more appreciation to well-designed spaces!
- Brings attention to places that seem to be under-utilised. There's so many random, secret spots around!

## Features

- Users should be able to quickly create a study spot after they have signed up.
- The form should have good UX: full validation using Zod, good error messages, should focus incorrect field if validation fails.
- Correct geographical data should be captured. Utilise Google Places API. Build a combobox, handle Autocomplete Sessions and debounce Autocomplete requests.
- To reduce S3 storage costs, new study spot images should be compressed on the client.
- To ensure no malicious S3 activity, uploads are handled with presigned URLs that are generated on the server. These URLs ensure correct file type, file size and quantity.
- Map page should exist, so user can quickly find spots.
- Create illusion of super-fast loading of study spot detail pages by utilising the Tanstack Query cache. I can populate parts of the page with initial data that was fetched on the index page.
- Users should be able to edit spots. This should create a new PendingEdit, which admins should be able to confirm or reject on a private page.

## Limitations

- Concerning the map - due to time and knowledge limitations, geographic queries have not been implemented. Opted to simply statically generate the map page, fetching all spots - at most, once per minute.
- Cold starts are long. Prisma's large size combined with Vercel's serverless is a problem. On the index page, opted to create an illusion, where the first section of the page is statically generated, thus will load extremely quickly - i.e. the Hero section. Only when the user scrolls further, they will see the dynamic content.

## Motivation

- Improve knowledge on more complicated, larger forms.
- Improve knowledge on validating client and server inputs and how they mix.
- Improve knowledge on AWS services such as S3 and Cloudfront.
- Improve knowledge on full-stack development, bootstrapped with `create t3 app`

## Setup

```shell
git clone https://github.com/sadfrogstudying/sadfrogs-nextjs.git
cd sadfrogs-nextjs
pnpm i
```

## Recommended Extensions

Please install these. In the left pane there should be an extensions icon, click into it and search for these plugins to install:

- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors)
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components)
  [Community Material Theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-community-material-theme)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Auto Formatting

Run `command + p` and type in `settings.json`. Ensure `"editor.formatOnSave": true,` is in the json object.

## Scripts

**Start** the project for local development on http://localhost:3000/:

```shell
pnpm dev
```

**Production** - `build` and `start` a production site for local testing on http://localhost:3000/:

```shell
pnpm build
pnpm start
```

After making changes to schema.prisma

```shell
npx prisma db push
```

Visual interface to manually make changes to the database

```shell
npx prisma studio
```

Put http://localhost:3000/ on the internet

```shell
ngrok http 3000
```

If you want to run the seed script

```shell
pnpm db-seed
```

## Testing dev API route changes on Mobile

`ngrok` allows us to put `localhost` on the internet so we can test the mobile app against the **development** backend. Install instructions [here](https://ngrok.com/download)

Run:

```shell
ngrok http 3000
```

In the terminal, the URL should be under `Forwarding`.

You can now fire requests to: `https://8e3b-49-255-185-210.ngrok-free.app/` and `https://8e3b-49-255-185-210.ngrok-free.app/api/studyspots.getall`.

---

![pepe](https://media.tenor.com/KvQWsHSsiMwAAAAM/sad-pepe.gif)
