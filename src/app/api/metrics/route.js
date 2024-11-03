import { NextResponse } from 'next/server';
import Redis from 'ioredis';
import client from 'prom-client';

const redis = new Redis({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT });

const requestCounter = new client.Counter({
    name: 'api_request_count',
    help: 'Total number of requests to API endpoints',
    labelNames: ['endpoint']
});

const redisCounter = new client.Counter({
    name: 'redis_request_count',
    help: 'Total number of requests read from Redis'
});

const successCounter = new client.Counter({
    name: 'api_request_success_count',
    help: 'Total number of successful API requests',
    labelNames: ['endpoint']
});

const failureCounter = new client.Counter({
    name: 'api_request_failure_count',
    help: 'Total number of failed API requests',
    labelNames: ['endpoint']
});

const latencyHistogram = new client.Histogram({
    name: 'api_request_latency',
    help: 'Latency of API requests in milliseconds',
    labelNames: ['endpoint']
});

export async function GET() {
    const metrics = await client.register.metrics();
    return NextResponse.json(metrics, {
        headers: { 'Content-Type': client.register.contentType }
    });
}
