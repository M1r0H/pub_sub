import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubSubModule } from '@modules/pub-sub';
import { RedisModule } from '@modules/redis';
import { SseModule } from '@modules/sse';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule.forRoot(),
    PubSubModule,
    SseModule,
  ],
})
export class AppModule {
}
