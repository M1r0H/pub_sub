import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class SseService {
  public initSseResponse(res: Response): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
  }

  public sendEvent(res: Response, data: string): void {
    res.write(`data: ${ data }\n\n`);
  }
}
