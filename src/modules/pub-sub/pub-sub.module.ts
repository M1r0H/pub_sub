import { Module } from '@nestjs/common';
import { PubSubService } from 'src/modules/pub-sub/services';
import { PubSubController } from '@modules/pub-sub/controllers';
import { SseModule } from '@modules/sse';

@Module({
  imports: [ SseModule ],
  controllers: [ PubSubController ],
  providers: [ PubSubService ],
  exports: [ PubSubService ],
})
export class PubSubModule {
}
