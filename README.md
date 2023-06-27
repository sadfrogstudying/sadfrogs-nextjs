# Sad Frogs

![pepe](https://media.tenor.com/KvQWsHSsiMwAAAAM/sad-pepe.gif)

## yarn (package manager)

Our package manager is yarn. Install instructions [here](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

## ngrok (access development server on the internet)

_Say if you're making local changes to the API routes, can we test the mobile app with http://localhost:3000/? If not the solution is below:_

ngrok allows us to put localhost on the internet so we can test the mobile app against the **development** backend. Install instructions [here](https://ngrok.com/download)

Run:

```shell
ngrok http 3000
```

In the terminal, the URL should be under `Forwarding`.

You can now fire requests to: `https://8e3b-49-255-185-210.ngrok-free.app/` and `https://8e3b-49-255-185-210.ngrok-free.app/api/studyspots.getall`

## Extensions

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
yarn dev
```

**Production** - `build` and `start` a production site for local testing on http://localhost:3000/:

```shell
yarn build
yarn start
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

If you want to run a script, possibly to seed data

```shell
tsx prisma/some-script-to-seed-data.ts
```
