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
        const userMail = queryParams.get('email');
  
        const db = mongoClient.db('Projekt');
        const challengesCollection = db.collection('Wyzwania');
        const usersCollection = db.collection('users');
  
        // Check if the userMail exists in the 'users' collection
        const userExists = await usersCollection.findOne({ email: userMail });
        if (!userExists) {
          return NextResponse.json({
            status: "error",
            message: "User not found",
          });
        }
  
        // Find pending challenges based on the provided email
        const pendingChallenges = await challengesCollection.find({
          $or: [
            { challengerEmail: userMail },
            { challengedUserEmail: userMail },
          ],
          initiatedAt: { $exists: true },
        }).toArray();
  
        return NextResponse.json({
          status: "success",
          message: "Pending challenges retrieved successfully",
          data: pendingChallenges,
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