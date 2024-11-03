import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

export async function GET(request, { params }) {
    const { word } = params;
    const cacheKey = `definition:${word}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
        return NextResponse.json({ source: 'redis', data: JSON.parse(cachedData) });
    }

    const response = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, {
        headers: { 'X-Api-Key': process.env.API_KEY }
    });
    const data = await response.json();

    await redis.set(cacheKey, JSON.stringify(data), 'EX', process.env.CACHE_TTL);
    return NextResponse.json({ source: 'api', data });
}
