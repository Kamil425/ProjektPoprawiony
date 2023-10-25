import { NextResponse } from "next/server";
import { MongoClient, MongoClientOptions } from 'mongodb';

// Inicjalizacja klienta MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI as string, {
  useUnifiedTopology: true,
} as MongoClientOptions);

// Zmienna do śledzenia stanu połączenia
let isMongoConnected = false;

// Funkcja inicjalizacji klienta MongoDB
async function initializeMongoClient() {
  if (!isMongoConnected) {
    await mongoClient.connect();
    isMongoConnected = true;
  }
}

export const POST = async (req: any, res: any) => {
  if (req.method === 'POST') {
    try {
      await initializeMongoClient(); // Inicjalizuj klienta przed użyciem

      const formData = await req.json();

      const db = mongoClient.db('Projekt');
      const collection = db.collection('Quizy');

      // Wyszukaj quizy na podstawie zapytania wyszukiwania (Nazwa_Quizu).
      const query = { Nazwa_Quizu: { $regex: formData.searchQuery, $options: 'i' } };
      const searchResults = await collection.find(query).toArray();

      // Nie zamykaj połączenia - pozostaw otwarte na potrzeby przyszłych zapytań

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
