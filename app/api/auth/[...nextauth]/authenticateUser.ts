
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function authenticateUser(credentials: any) {
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
      return null; // Authentication failed
    }

    user.OstatniaAktywnosc = currentDate;
    await user.save();

    return user; // Authentication successful
  } catch (error) {
    console.log("Error: ", error);
    return null; // Authentication failed due to an error
  }
}