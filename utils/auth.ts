import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Auth0Provider({
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    issuer: process.env.AUTH0_ISSUER
  }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "Password"}
      },
      async authorize(credentials){
        if (!credentials?.email || credentials?.password) {
          throw new Error("Both fields are required!")
        }

        try {
          await dbConnect()
          const user = await User.findOne({email: credentials.email})
          if (!user) {
            throw new Error ("No user found with this email!")
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          )
          if (!isValid) {
            throw new Error ("Incorrect password!")
          }

          return {
            id: user._id.toString(),
            email: user.email
          }
        } catch (error) {
          console.error("Auth error", error)
          throw error
          
        }
      }
    })

  ],
  callbacks: {
    async jwt({token, user}){
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({session,token}){
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge:30*24*60*60 
  },
  secret: process.env.NEXTAUTH_SECRET,  
}
