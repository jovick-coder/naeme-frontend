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
    // async signIn({ user, account, token }) {
    //   console.log("signIn", user, account, token);
    //   const { provider } = account;
    //   try {
    //     const response = await axios.post(
    //       `${NEXT_PUBLIC_API_URL}/account/${provider}/`,
    //       {
    //         access_token: account?.access_token,
    //         token_secret: account?.id_token,
    //       }
    //     );

    //     const data = response.data;
    //     user.accessToken = data.access_token;
    //     user.refreshToken = data.refresh_token;
    //     user.id = data?.user.id;
    //     return true;
    //   } catch (error) {
    //     console.log("error:", error);
    //     return false;
    //   }
    // },

    async jwt({ token, user, account }) {
      console.log("JWTUser:", { token, user, account });

      if (user) {
        const { accessToken, refreshToken } = user;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
      }
      return token;
    },

    async session({ session, token, user, account }) {
      console.log("SessionUser:", { session, token, user, account });
      if (account) {
        const { accessToken, refreshToken } = account;
        session.accessToken = accessToken;
        session.refreshToken = refreshToken;
      }
      return session;
    },

    debug: DEBUG_MODE,

    pages: {
      signIn: "/signin",
    },
  },
});
