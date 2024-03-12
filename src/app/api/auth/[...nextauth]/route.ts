import NextAuth from "next-auth"

import type {NextAuthOptions}  from 'next-auth'

import GoogleProvider from "next-auth/providers/google"
// import prisma from "../../../../../prisma"

import prisma from "../../../../../prisma";

import { ConnectToDatabase } from "@/helpers/db"
import { randomUUID } from "crypto";




export const authOptions : NextAuthOptions  = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    

    })
  ],
  session:{
    strategy:"jwt",
    maxAge:60*60*24
  },
  callbacks:{
    async signIn({ user, account, profile, email, credentials }) {
      // console.log(user)
      // console.log(account)
      // console.log(profile)
      // console.log(email)
      // console.log(credentials)
      return true
    },
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }