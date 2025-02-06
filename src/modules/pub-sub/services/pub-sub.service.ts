import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PublishParams } from '@modules/pub-sub/types';

@Injectable()
export class PubSubService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: Redis;

  public async publish(params: PublishParams): Promise<number> {
    const { topicName, message } = params;

    return this.redisClient.publish(topicName, message);
  }
}
