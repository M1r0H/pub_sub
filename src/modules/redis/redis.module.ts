import { DynamicModule, Global, Inject, Module, OnModuleInit, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from '@modules/redis/services';

@Global()
@Module({})
export class RedisModule implements OnModuleInit{
  private static redisUrl: string;

  @Inject()
  private configService: ConfigService;

  public static forRoot(): DynamicModule {
    const clientProvider: Provider = {
      provide: 'REDIS_CLIENT',
      useFactory: (): Redis => {
        const client = new Redis(this.redisUrl);

        client.on('error', (err) =>
          console.error('ioredis Client Error', err)
        );

        return client;
      },
    };

    const clientFactoryProvider: Provider = {
      provide: 'REDIS_SUBSCRIBER_FACTORY',
      useFactory: () => {
        return async (): Promise<Redis> => {
          const client = new Redis(this.redisUrl);

          client.on('error', (err) =>
            console.error('ioredis Subscriber Error', err),
          );

          return client;
        };
      },
    };

    const module = this.getModule();

    module.imports = [ ConfigModule ];

    module.providers = [
      clientProvider,
      clientFactoryProvider,
      RedisService,
    ];

    module.exports =[
      'REDIS_CLIENT',
      RedisService,
    ];

    return module;
  }

  public static forFeature(): DynamicModule {
    return this.getModule();
  }

  public static getModule(): DynamicModule {
    return {
      global: true,
      module: RedisModule,
      exports: [],
      imports: [],
      controllers: [],
      providers: [],
    };
  }

  public onModuleInit(): any {
    RedisModule.redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );
  }
}
