import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Cluster, Command } from 'ioredis';
import { RedisService } from '@modules/redis/services';
import { ClusterOptions } from 'ioredis/built/cluster/ClusterOptions';

@Global()
@Module({})
export class RedisModule {
  private static clusterOptions: ClusterOptions;
  private static nodes: { host: string; port: number }[];

  public static forRoot(): DynamicModule {
    const clientProvider: Provider = {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService): Promise<Cluster> => {
        const redisHosts = configService.get<string>('REDIS_HOSTS', 'redis-node-1:7001');
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '');

        RedisModule.nodes = redisHosts.split(',').map((host) => {
          const [hostname, port] = host.split(':');

          return { host: hostname, port: Number(port) };
        });

        RedisModule.clusterOptions = {
          redisOptions: {
            password: redisPassword,
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            reconnectOnError: () => true,
          },
        };

        const cluster = new Cluster(this.nodes, this.clusterOptions);

        await new Promise((resolve) => {
          cluster.on('ready', resolve);
        });

        await RedisModule.applyClusterConfig(cluster);

        cluster.on('error', (err) =>
          console.error('ioredis Cluster Client Error', err),
        );

        return cluster;
      },
      inject: [ConfigService],
    };

    const clientFactoryProvider: Provider = {
      provide: 'REDIS_SUBSCRIBER_FACTORY',
      useFactory: () => {
        return async (): Promise<Cluster> => {
          const cluster = new Cluster(this.nodes, this.clusterOptions);

          cluster.on('error', (err) =>
            console.error('ioredis Cluster Subscriber Error', err),
          );

          return cluster;
        };
      },
    };

    const module = this.getModule();

    module.imports = [ConfigModule];

    module.providers = [
      clientProvider,
      clientFactoryProvider,
      RedisService,
    ];

    module.exports = [
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

  private static async applyClusterConfig(cluster: Cluster) {
    const masters = cluster.nodes('master');

    for (const node of masters) {
      await node.sendCommand(new Command('CONFIG', ['SET', 'maxclients', '10000']));
      await node.sendCommand(new Command('CONFIG', ['SET', 'notify-keyspace-events', 'KEA']));
      await node.sendCommand(new Command('CONFIG', ['SET', 'repl-disable-tcp-nodelay', 'no']));
      await node.sendCommand(new Command('CONFIG', ['SET', 'client-query-buffer-limit', '512mb']));
    }
  }
}
