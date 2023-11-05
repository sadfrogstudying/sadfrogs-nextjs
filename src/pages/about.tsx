import Head from "next/head";

const About = () => {
  return (
    <>
      <Head>
        <title>Sad Frogs - About</title>
        <meta
          name="description"
          content="An Index of Beautiful Places to Study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative h-full flex justify-center items-center">
        <h2 className="text-3xl font-serif font-normal tracking-tight md:text-4xl p-8 text-center">
          An Index of Beautiful Places to Study
        </h2>
      </div>
    </>
  );
};

export default About;
