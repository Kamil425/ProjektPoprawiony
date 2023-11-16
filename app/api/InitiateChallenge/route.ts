import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from 'mongodb';

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
      const challengesCollection = db.collection('Wyzwania');

      // Save challenge details to the 'Wyzwania' collection
      await challengesCollection.insertOne({
        quizId: formData.quizId,
        challengerEmail: formData.challengerEmail,
        challengedUserEmail: formData.challengedUserEmail,
        initiatedAt: new Date(),
      });

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
