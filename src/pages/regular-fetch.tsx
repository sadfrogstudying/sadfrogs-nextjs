import { Frog } from "@prisma/client";

const RegularFetchPage = ({ data }: { data: Frog[] }) => {
  console.log(data);

  return <div></div>;
};

export default RegularFetchPage;

export const getStaticProps = async () => {
  const res = await fetch("http://localhost:3000/api/frogs.getall", {
    method: "GET",
  });

  const data = await res.json();

  return { props: { data } };
};
