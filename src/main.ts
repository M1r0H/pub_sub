import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';

async function bootstrap() {
    if (isMainThread) {
      const numCPUs = os.cpus().length;

      for (let i = 0; i < numCPUs; i++) {
        new Worker(__filename, { workerData: { port: 3000 + i } });
      }
    } else {
      const port = workerData.port;

      try {
        const app = await NestFactory.create(AppModule);

        app.use(require('express').json({ limit: '2mb' }));

        await app.listen(port);

        if (parentPort) {
          parentPort.postMessage('ready');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  bootstrap();
