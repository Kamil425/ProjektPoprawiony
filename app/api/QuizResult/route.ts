import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import User from '@/models/user';

// Inicjalizacja klienta MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const formData = await req.json();
      const quizId = formData.quizId;
      const email = formData.userId;
      const db = mongoClient.db('Projekt');
      const quizyCollection = db.collection('Quizy');
      const usersCollection = db.collection('users');
      const User = await usersCollection.find({ email: email }).toArray();
      
      const user = User[0];
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

      let idQuizu = quizId;
      let idQuizuObject = new ObjectId(idQuizu);
      const query = { _id: idQuizuObject };
      const searchResults = await quizyCollection.find(query).toArray();
      if (user.wyzwania && user.wyzwania.length > 0) {
        const matchingWyzwanie = user.wyzwania.find(
          (wyzwanie: any) => wyzwanie.QuizId && new ObjectId(wyzwanie.QuizId).equals(idQuizu) && wyzwanie.Active === true
        );

        // If a matching 'wyzwanie' is found, update it to set 'Active' to false
        if (matchingWyzwanie) {
          console.log(matchingWyzwanie)
          const res = await usersCollection.updateOne(
            { _id: user._id, "wyzwania.WyzwanieId": matchingWyzwanie.WyzwanieId },
            {
              $set: {
                "wyzwania.$.Active": false,
                "wyzwania.$.quizResults": {
                  quizId: new ObjectId(idQuizu),
                  quizName: searchResults[0].Nazwa_Quizu,
                  quizDifficulty: searchResults[0].Trudność,
                  quizCategory: searchResults[0].Kategoria,
                  quizType: searchResults[0].Typ,
                  quizResult: formData.scoreUser,
                  quizPoints: formData.scoreMax,
                  quizTimeMax: formData.timeMax,
                  quizTimeFinish: formData.timeFinish,
                  quizDate: new Date(),
                },
              },
            }
          );
        console.log(res);
        }
      }
     
      const quizResults = {
        quizId: idQuizuObject,
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

      if (!user.quizResults) {
        user.quizResults = [];
      }

      const maxUserEntries = 10; // Maximum allowed entries per user

      // Add the new quiz result to the user's quizResults array
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $push: {
            quizResults: {
              $each: [quizResults],
              $slice: -maxUserEntries, // Keep only the last 10 elements
            },
          },
        }
      );

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
