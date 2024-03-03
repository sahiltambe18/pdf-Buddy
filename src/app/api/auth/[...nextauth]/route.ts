import NextAuth from "next-auth"
import type {NextAuthOptions}  from 'next-auth'
import bcrypt from 'bcrypt'

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
// import prisma from "../../../../../prisma"

import prisma from "../../../../../prisma";

import { ConnectToDatabase } from "@/helpers/db"



export const authOptions : NextAuthOptions  = {
  providers: [
    CredentialsProvider({
      name: "Creds",
      credentials: {
        username: { label: "username", type: "text", placeholder: "user name" },
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          await ConnectToDatabase()
          let user = await prisma.user.findFirst({
            where: {
              email: credentials?.email
            }
          });

          // user not found
          if (!user) {
            return null
          }

          if (!user?.hashedPassword) {
            return null
          }

          let isPasswordCorrect = await bcrypt.compare(credentials.password, user?.hashedPassword);
          if (isPasswordCorrect) {
            return user
          } 
          return null

        } catch (error) {
          console.log(error)
          return null
        } finally {
          await prisma.$disconnect
        }

        return null
      }
    })
    ,GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      
      //  profile(profile) {
      //   return {
      //     id:1
      //     // Return all the profile information you need.
      //     // The only truly required field is `id`
      //     // to be able identify the account when added to a database
      //   }
      //},

    })
  ],
  session:{
    strategy:"jwt",
    maxAge:60*60*24
  },
  callbacks:{
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user)
      console.log(account)
      console.log(profile)
      console.log(email)
      console.log(credentials)
      return true
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }