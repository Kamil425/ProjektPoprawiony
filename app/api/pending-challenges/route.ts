import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';

// Initializing the MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

export const GET = async (req: any, res: any) => {
  if (req.method === 'GET') {
    try {
      const queryParams = new URLSearchParams(req.url.split('?')[1]);
      const userEmail = queryParams.get('email');

      const db = mongoClient.db('Projekt');
      const usersCollection = db.collection('users');

      // Find the user
      const user = await usersCollection.findOne({ email: userEmail });
      if (!user) {
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }

      // Return only the wyzwania array from the user
      let wyzwaniaArray = user.wyzwania || [];

      // Define an array to store the compiled information
      let compiledChallenges = [];

      // Iterate through the wyzwaniaArray
      for (const wyzwanie of wyzwaniaArray) {
        // Check if the wyzwanie has quizResults
        if (wyzwanie.quizResults) {
          // Find the other user involved in the challenge
          const otherUserEmail =
            userEmail === wyzwanie.ChallengerEmail
              ? wyzwanie.ChallengedEmail
              : wyzwanie.ChallengerEmail;

          // Find the other user's quiz result
          const otherUser = await usersCollection.findOne({
            email: otherUserEmail,
          });
          const otherUserResults = otherUser?.wyzwania;

          // Convert ObjectId to string for comparison
          const wyzwanieIdString = wyzwanie.WyzwanieId.toString();

          // Compile the information with WyzwanieId
          const challengeInfo = {
            WyzwanieId: wyzwanie.WyzwanieId,
            QuizId: wyzwanie.QuizId,
            ChallengerEmail: wyzwanie.ChallengerEmail,
            ChallengedEmail: wyzwanie.ChallengedEmail,
            InitiatedAt: wyzwanie.InitiatedAt,
            Active: wyzwanie.Active,
            QuizResult: wyzwanie.quizResults, // Include all quizResults
            OtherUserQuizResult: otherUserResults?.find((result: any) => result.WyzwanieId.toString() === wyzwanieIdString)?.quizResults || null,
          };
          
          // Add the compiled information to the array
          compiledChallenges.push(challengeInfo);
        } else {
          // If quizResults is false, include only basic information
          const basicChallengeInfo = {
            WyzwanieId: wyzwanie.WyzwanieId,
            QuizId: wyzwanie.QuizId,
            ChallengerEmail: wyzwanie.ChallengerEmail,
            ChallengedEmail: wyzwanie.ChallengedEmail,
            InitiatedAt: wyzwanie.InitiatedAt,
            Active: wyzwanie.Active,
          };
          compiledChallenges.push(basicChallengeInfo);
        }
      }

      return NextResponse.json({
        status: "success",
        message: "Challenges and quiz results retrieved successfully",
        data: compiledChallenges,
      });
    } catch (error) {
      console.error('Server Error:', error);
      return new NextResponse(
        JSON.stringify({
          status: "error",
          message: "Internal server error",
        }),
        { status: 500 }
      );
    }
  }
};
