import { Module } from '@nestjs/common';
import { SseService } from '@modules/sse/services';

@Module({
  providers: [ SseService ],
  exports: [ SseService ],
})
export class SseModule {
}
