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

export default NextAuth({
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

  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWTUser:", { token, user, account });

      try {
        const { oauth_token, oauth_token_secret, id_token, account } = account;
        const response = await axios.post(
          `${NEXT_PUBLIC_API_URL}/account/${provider}/`,
          provider === "twitter"
            ? {
                access_token_key: oauth_token,
                access_token_secret: oauth_token_secret,
              }
            : provider === "google"
            ? {
                auth_token: id_token,
              }
            : null
        );
        const data = response?.data;
        token.accessToken = data?.access_token;
        token.refreshToken = data?.refresh_token;
        token.sub = data?.id;
        return true;
      } catch (error) {
        console.log("error:", error);
        return false;
      }
      return token;
    },

    async session({ session, token, user, account }) {
      console.log("SessionUser:", { session, token, user, account });
      if (token) {
        const { accessToken, refreshToken, sub } = token;
        session.accessToken = accessToken;
        session.refreshToken = refreshToken;
        session.user.id = sub;
      }
      return session;
    },

    debug: DEBUG_MODE,

    pages: {
      signIn: "/signin",
    },
  },
});
