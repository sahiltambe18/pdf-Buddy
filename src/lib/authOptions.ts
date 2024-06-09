
import type {NextAuthOptions}  from 'next-auth'

import GoogleProvider from "next-auth/providers/google"
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
  