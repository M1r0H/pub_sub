import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SseService } from '@modules/sse/services';
import Redis from 'ioredis';
import { PubSubService } from '@modules/pub-sub/services';
import { RedisService } from '@modules/redis/services';

@Controller('topics')
export class PubSubController {
  @Inject()
  public readonly redisService: RedisService;
  @Inject()
  private readonly pubSubService: PubSubService;
  @Inject()
  private readonly sseService: SseService;

  @Post(':name')
  public async publish(
    @Param('name') topicName: string,
    @Body() data: Record<string, unknown>,
    @Res() res: Response
  ) {
    if (!data || typeof data !== 'object') {
      throw new HttpException('Unexpected data format', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.pubSubService.publish({
        topicName,
        message: JSON.stringify(data),
      });

      return res.status(HttpStatus.OK).send();
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: error.message,
      });
    }
  }

  @Get(':name')
  public async subscribe(
    @Param('name') topicName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.sseService.initSseResponse(res);

    let subscriber: Redis;

    try {
      subscriber = await this.redisService.createSubscriber({ topicName });

      subscriber.on('message', (channel: string, message: string) => {
        if (channel === topicName) {
          this.sseService.sendEvent(res, message);
        }
      });
    } catch (error) {
      res.write(`event: error\ndata: ${ JSON.stringify(error) }\n\n`);
      res.end();

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error: error.message,
      });
    }

    req.on('close', async () => {
      if (subscriber) {
        await subscriber.unsubscribe(topicName);

        subscriber.disconnect();
      }

      res.end();
    });
  }
}
