import { createClient } from 'redis';
import { NextResponse } from 'next/server';

// 1. Initialize the connection to Vercel KV
const redis = await createClient().connect();

export const POST = async () => {
  // 2. Fetch data from Redis
  const result = await redis.get("item");
  
  // 3. Return the result in the response
  return new NextResponse(JSON.stringify({ result }), { status: 200 });
};
