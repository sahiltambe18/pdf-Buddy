import { authOptions } from "@/lib/authOptions"
import NextAuth from "next-auth"

// import prisma from "../../../../../prisma"




const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }