import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import User from '@/models/user';

// Inicjalizacja klienta MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

// ...

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const formData = await req.json();
      const quizId = formData.quizId;
      const email = formData.userId;

      // Find the user based on the provided email
      const user = await User.findOne({ email }).select("_id");

      // If the user doesn't exist, return an error response
      if (!user) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "User not found",
          }),
          { status: 404 }
        );
      }

      const idQuizu = new ObjectId(quizId);
      const db = mongoClient.db('Projekt');
      const collection = db.collection('users'); // Zmiana kolekcji na 'users'
      const collection2 = db.collection('Quizy');
      const query = { _id: idQuizu };
      const searchResults = await collection2.find(query).toArray();
      const quizResults = {
        quizId: idQuizu,
        quizName: searchResults[0].Nazwa_Quizu,
        quizDifficulty: searchResults[0].Trudność,
        quizCategory: searchResults[0].Kategoria,
        quizType: searchResults[0].Typ,
        quizResult: formData.scoreUser,
        quizPoints: formData.scoreMax,
        quizTimeMax: formData.timeMax,
        quizTimeFinish: formData.timeFinish,
        quizDate: new Date(),
      };

      // Check the number of entries for the user
      if (!user.quizResults) {
        user.quizResults = [];
      }

      const maxUserEntries = 10; // Maximum allowed entries per user

      if (user.quizResults.length >= maxUserEntries) {
        // Sort the entries by date in descending order
        user.quizResults.sort((a:any, b:any) => b.quizDate - a.quizDate);

        // Remove the excess entries
        user.quizResults.splice(maxUserEntries - 1);
      }

      // Add the new quiz result to the user's quizResults array
      user.quizResults.push(quizResults);

      // Update the user document in the 'users' collection
      await collection.updateOne({ _id: user._id }, { $set: { quizResults: user.quizResults } });

      console.log("Quiz results saved to the database.");

      return NextResponse.json({
        status: "success",
        message: "Quiz results saved to the database",
      });
    } catch (error) {
      console.error('Błąd serwera:', error);
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Wewnętrzny błąd serwera",
        }),
        { status: 500 }
      );
    }
  }
};