import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from "~/components/Header";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <UserProvider>
      <Header />
      <Component {...pageProps} />
    </UserProvider>
  );
};

export default api.withTRPC(MyApp);
