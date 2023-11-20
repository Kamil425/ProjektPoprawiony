import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import User from '@/models/user';

const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

let isMongoConnected = false;

async function initializeMongoClient() {
  if (!isMongoConnected) {
    await mongoClient.connect();
    isMongoConnected = true;
  }
}

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      await initializeMongoClient();
      const formData = await req.json();

      const db = mongoClient.db('Projekt');
      const challengesCollection = db.collection('users');
      
      // Find the challenger user
      const challengerEmail = formData.challengerEmail;
      const challengerUser = await User.findOne({ email: challengerEmail });
      const quizId = formData.quizId;
      const initiatedAt = new Date();

      // Generate a new ObjectId for the WyzwanieId
      const wyzwanieId = new ObjectId();

      // Create a new challenge array for the challenger user
      const challengerChallenge = {
        WyzwanieId: wyzwanieId,
        QuizId: quizId,
        ChallengerEmail: challengerEmail,
        ChallengedEmail: formData.challengedUserEmail,
        InitiatedAt: initiatedAt,
        Active: true,
      };

      // Update the challenger user's 'wyzwana' field with the new challenge array
      await challengesCollection.updateOne(
        { _id: challengerUser._id },
        {
          $push: {
            wyzwania: challengerChallenge,
          },
        },
        { upsert: true } // Creates the document if it does not exist
      );

      // Find the challenged user
      const challengedUserEmail = formData.challengedUserEmail;
      const challengedUser = await User.findOne({ email: challengedUserEmail });

      // Create a new challenge array for the challenged user
      const challengedChallenge = {
        WyzwanieId: wyzwanieId,
        QuizId: quizId,
        ChallengerEmail: challengerEmail,
        ChallengedEmail: challengedUserEmail,
        InitiatedAt: initiatedAt,
        Active: true,
      };

      // Update the challenged user's 'wyzwana' field with the new challenge array
      await challengesCollection.updateOne(
        { _id: challengedUser._id },
        {
          $push: {
            wyzwania: challengedChallenge,
          },
        },
        { upsert: true } // Creates the document if it does not exist
      );

      return NextResponse.json({
        status: 'success',
        message: 'Challenge initiated successfully',
      });
    } catch (error) {
      console.error('Server error:', error);
      return new NextResponse(
        JSON.stringify({
          status: 'error',
          message: 'Internal server error',
        }),
        { status: 500 }
      );
    }
  }
};
