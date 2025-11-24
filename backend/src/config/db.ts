import config from "./config.js";
import { PrismaClient } from "@prisma/client";
import { MongoClient, MongoClientOptions, MongoError } from "mongodb";
const prisma = new PrismaClient()

const connectDB = async (): Promise<void> => {
  console.clear();

  // MongoDB connection options (no deprecated options)
  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if MongoDB can't be reached
  };


  console.log("Connecting to database...");
  const client = new MongoClient(config.DATABASE_URL, options);


  try {
    // using mongo driver to ping connection 
    await client.connect();
    const db = client.db();

    const name = db.databaseName;
    const host = client.options?.hosts?.[0]?.host ?? "unknown";
    const port = client.options?.hosts?.[0]?.port ?? "unknown";
    console.log(`MongoDB connected successfully`);
    console.log(`Connection Name: ${name}`);
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);


    process.on("SIGINT", async () => {
      await prisma.$disconnect();
      console.log("prisma disconnected (SIGINT)");
      process.exit(0);
    });

  } catch (error) {
    if (error instanceof MongoError) {
      console.error(" Failed to connect to MongoDB:", error.message);
    } else {
      console.error(" Unexpected error while connecting to MongoDB:", error);
    }

    await client.close(); // Ensure client is closed on error
    process.exit(1);
  } finally {
    await client.close(); // Ensure client is closed after connection
  }
};

export default connectDB;
export { prisma };
