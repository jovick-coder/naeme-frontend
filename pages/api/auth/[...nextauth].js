import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import NextAuth from "next-auth/next";
import axios from "axios";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_API_URL,
  NEXT_SECRET,
  DEBUG_MODE,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
} = process.env;

export default async function auth(req, res) {
  return await NextAuth(req, res, {
    providers: [
      GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      }),
      TwitterProvider({
        clientId: TWITTER_CLIENT_ID,
        clientSecret: TWITTER_CLIENT_SECRET,
      }),
    ],

    secret: NEXT_SECRET,
    session: {
      cookie: {
        secure: !DEBUG_MODE,
      },
    },
    csrfToken: true,

    callbacks: {
      async signIn({ user, account, token }) {
        console.log("signIn", user, account, token);
        const { provider } = account;

        try {
          const { oauth_token, oauth_token_secret, access_token, id_token } =
            account;
          const response = await axios.post(
            `${NEXT_PUBLIC_API_URL}/account/${provider}/`,
            account.provider === "twitter"
              ? {
                  access_token_key: oauth_token,
                  access_token_secret: oauth_token_secret,
                }
              : account.provider === "google"
              ? {
                  auth_token: id_token,
                }
              : null
          );

          const data = response.data;
          user.accessToken = data?.tokens?.access;
          user.refreshToken = data?.tokens?.refresh;
          user.id = data?.id;
          return true;
        } catch (error) {
          console.log("error:", error);
          return false;
        }
      },
      async jwt({ token, user }) {
        console.log("jwt", { token, user });
        if (user) {
          const { accessToken, refreshToken } = user;
          token.accessToken = accessToken;
          token.refreshToken = refreshToken;
        }
        return token;
      },
      async session({ session, token, user }) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.sub;
        return session;
      },

      debug: DEBUG_MODE,

      pages: {
        signIn: "/signin",
      },
    },
  });
}
