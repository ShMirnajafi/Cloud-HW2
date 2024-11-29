import { NextResponse } from 'next/server';
import client from 'prom-client';

const register = client.register;

const requestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'status_code'],
});

export async function GET() {
    requestCounter.inc({ method: 'GET', status_code: '200' });

    const metrics = await register.metrics();
    return new NextResponse(metrics, {
        headers: { 'Content-Type': register.contentType }
    });
}
