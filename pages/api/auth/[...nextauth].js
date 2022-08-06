import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";
import axios from "axios";
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_API_URL,
  NEXT_SECRET,
  DEBUG_MODE,
} = process.env;

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  secret: NEXT_SECRET,

  csrfToken: true,

  callbacks: {
    async signIn({ user, account, token }) {
      if (account.provider === "google") {
        try {
          const response = await axios.post(
            `${NEXT_PUBLIC_API_URL}/account/google/`,
            {
              access_token: account?.access_token,
              id_token: account?.id_token,
            }
          );

          const data = response.data;
          user.accessToken = data.access_token;
          user.refreshToken = data.refresh_token;
          user.id = data?.user.id;
          return true;
        } catch (error) {
          console.log("error:", error);
          return false;
        }
      }
      return false;
    },

    async jwt({ token, user }) {
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
