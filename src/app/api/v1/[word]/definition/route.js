import 'dotenv/config';
import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

export async function GET(request, context) {
    console.log("little change")
    const params = await context.params;
    if (!params || !params.word) {
        return NextResponse.json({ error: "Word parameter is missing" }, { status: 400 });
    }

    const { word } = params;
    const cacheKey = `definition:${word}`;

    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return NextResponse.json({ source: 'redis', data: JSON.parse(cachedData) });
        }

        const response = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, {
            headers: { 'X-Api-Key': process.env.API_KEY }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        await redis.set(cacheKey, JSON.stringify(data), 'EX', parseInt(process.env.CACHE_TTL));
        return NextResponse.json({ source: 'api', data });

    } catch (error) {
        console.error("Error fetching word definition:", error);
        return NextResponse.json({ error: "Failed to fetch word definition" }, { status: 500 });
    }
}
