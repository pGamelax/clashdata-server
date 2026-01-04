import { Redis } from "ioredis";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ElysiaAdapter } from "@bull-board/elysia";
import { Queue as QueueMQ, Worker, Job } from "bullmq";

// 1. Conexão Redis
export const redisConnection = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

// 2. Criação das Filas
const createQueueMQ = (name: string) =>
  new QueueMQ(name, { connection: redisConnection });

export const findWarQueue = createQueueMQ("findWar-queue");
export const saveWarStatsQueue = createQueueMQ("save-war-stats-queue");

// 4. Configuração do Dashboard (BullBoard)
export const serverAdapter = new ElysiaAdapter("/ui");

createBullBoard({
  queues: [
    new BullMQAdapter(findWarQueue),
    new BullMQAdapter(saveWarStatsQueue),
  ],
  serverAdapter,
  // Removido o uiBasePath manual, o ElysiaAdapter costuma lidar com isso internamente
});
