import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import 'dotenv'

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

export async function GET() {
    const cacheKey = `random-word`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return NextResponse.json({ source: 'redis', data: JSON.parse(cachedData) });
    }

    const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
        headers: { 'X-Api-Key': process.env.API_KEY }
    });
    const randomWordData = await response.json();

    const word = randomWordData.word;
    const definitionResponse = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, {
        headers: { 'X-Api-Key': process.env.API_KEY }
    });
    const definitionData = await definitionResponse.json();

    const result = { word, definition: definitionData };
    await redis.set(cacheKey, JSON.stringify(result), 'EX', process.env.CACHE_TTL);
    return NextResponse.json({ source: 'api', data: result });
}
