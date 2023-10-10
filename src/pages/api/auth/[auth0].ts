import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const authOptions = {
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res);
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  },
};

export default handleAuth(authOptions);
