import 'dotenv/config';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.api-ninjas.com/v1/randomword', {
            headers: { 'X-Api-Key': process.env.API_KEY }
        });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const randomWordData = await response.json();

        const word = randomWordData.word;
        return NextResponse.json({ source: 'api', data: { word } });

    } catch (error) {
        console.error("Error fetching random word:", error);
        return NextResponse.json({ error: "Failed to fetch random word" }, { status: 500 });
    }
}
