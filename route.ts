import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const currentDate = new Date();
          const hashedPassword = await bcrypt.hash(password, 10);
        

         
          let user = await User.findOneAndUpdate(
              { email },
              {
                $set: {
                  email,
                  password: hashedPassword,
                  OstatniaAktywnosc: currentDate,
                  powiadomieniaWyslane: 0,
                }
              },
              { upsert: false }
            );
          

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            alert("Złe dane logowania");
            return;
          }

          user.OstatniaAktywnosc = currentDate;
          await user.save()
          .then(console.log(user))

          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
