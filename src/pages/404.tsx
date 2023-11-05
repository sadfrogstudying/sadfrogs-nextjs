import Head from "next/head";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Sad Frogs - 404</title>
        <meta name="description" content="404 - Page not found." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 h-full w-full flex justify-center items-center">
        <h1 className="font-mono">404 - Page Not Found</h1>
      </main>
    </>
  );
}
