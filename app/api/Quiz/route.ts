import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';

// Inicjalizacja klienta MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);


export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      const formData = await req.json();
      const id = formData;
      const idQuizu = new ObjectId(id.quizId);
      const db = mongoClient.db('Projekt');
      const collection = db.collection('Quizy');
      console.log("halo")
      const query = { _id: idQuizu };
      const searchResults = await collection.find(query).toArray();
      mongoClient.close();

      return NextResponse.json({
        status: "success",
        message: "Wyniki wyszukiwania",
        data: searchResults,
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
