import { betterAuth } from "better-auth";
import { prisma } from "./prisma"
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
   emailAndPassword:{
    enabled : true,
    requireEmailVerification: false,
   },
   ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
     ? {
         socialProviders: {
           google: {
             clientId: process.env.GOOGLE_CLIENT_ID,
             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
           },
         },
       }
     : {}),
});