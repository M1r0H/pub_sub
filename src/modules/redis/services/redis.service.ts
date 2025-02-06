import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CreateSubscribeParams } from '@modules/redis/types';

@Injectable()
export class RedisService {
  @Inject('REDIS_SUBSCRIBER_FACTORY')
  private readonly subscriberFactory: () => Promise<Redis>;

  public async createSubscriber(params: CreateSubscribeParams): Promise<Redis> {
    const { topicName } = params;
    const subscriber = await this.subscriberFactory();

    await subscriber.subscribe(topicName);

    return subscriber;
  }
}
