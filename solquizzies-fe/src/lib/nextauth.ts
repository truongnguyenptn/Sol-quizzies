import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
// import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "@/lib/web3/SigninMessage";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      publicKey?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
const providers = [
  CredentialsProvider({
    name: "Solana",
    credentials: {
      message: {
        label: "Message",
        type: "text",
      },
      signature: {
        label: "Signature",
        type: "text",
      },
    },
    async authorize(credentials) {
      try {
        const signinMessage = new SigninMessage(
          JSON.parse(credentials?.message || "{}")
        );
        // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
        // if (signinMessage.domain !== nextAuthUrl.host) {
        //   return null;
        // }

        if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
          return null;
        }

        const validationResult = await signinMessage.validate(
          credentials?.signature || ""
        );

        if (!validationResult)
          throw new Error("Could not validate the signed message");

        return {
          id: signinMessage.publicKey,
        };
      } catch (e) {
        return null;
      }
    },
  }),
];


export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE!) || 1209600,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.publicKey = token.sub;
      if (session.user) {
        session.user.name = token.sub;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
      }
      return session;
    },
    jwt: async ({ token }) => {
      // const db_user = await prisma.user.findFirst({
      //   where: {
      //     email: token?.email,
      //   },
      // });
      // if (db_user) {
      //   token.id = db_user.id;
      // }
      return token;
    }
  },
  // },
  // adapter: PrismaAdapter(prisma),
  providers: providers
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};





