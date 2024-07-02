import { Module, OnModuleDestroy } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { PrismaService } from '../prisma.service';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { EmailProcessor } from './email.processor';
import { Queue } from 'bullmq';
import { SendGridClient } from './sendgrid-client';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'emails',
      defaultJobOptions: {
        attempts: 1, // Number of attempts to try the job until it completes
        backoff: {
          type: 'fixed', // Backoff strategy (e.g., fixed, exponential)
          delay: 5000, // Delay between attempts in ms
        },
        removeOnComplete: {
          age: 3600, // keep up to 1 hour
          count: 10,
        }, // keep up to 10 jobs
        removeOnFail: 20, // max number of jobs to keep
      },
    }),
    BullBoardModule.forFeature({
      name: 'emails',
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, PrismaService, EmailProcessor, SendGridClient],
})
export class EmailModule implements OnModuleDestroy {
  constructor(@InjectQueue('emails') private readonly emailQueue: Queue) {}

  async onModuleDestroy() {
    await this.emailQueue.drain(); // This empties the queue
  }
}
