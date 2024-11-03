import { NextResponse } from 'next/server';
import client from 'prom-client';

const register = client.register;

export async function GET() {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
        headers: { 'Content-Type': register.contentType }
    });
}
