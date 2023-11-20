// import statements
import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import User from '@/models/user';

// Initializing the MongoDB client
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

// Function to retrieve the content of the quizResults array for a given user
export const GET = async (req: any, res: any) => {
  if (req.method === 'GET') {
    try {
     
      const queryParams = new URLSearchParams(req.url.split('?')[1]); // Extract query parameters

    
      const userMail = queryParams.get('email');
    

      // Find the user based on the provided email
      const user = await User.findOne({ email: userMail }).select("_id");

      if (!user) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "User not found",
          }),
          { status: 404 }
        );
      }

      const db = mongoClient.db('Projekt');
      const collection = db.collection('users');

      // Get the user's content based on userId
      const userData = await collection.findOne({ _id: new ObjectId(user._id) });
      if (!userData) {
        return new NextResponse(
          JSON.stringify({
            status: "error",
            message: "User data not found",
          }),
          { status: 404 }
        );
      }

      const quizResults = userData.quizResults || [];

      return NextResponse.json({
        status: "success",
        message: "Quiz results retrieved successfully",
        data: quizResults,
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
