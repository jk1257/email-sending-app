import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';

@Processor('emails', {
  concurrency: 3, //  number of jobs to be processed by worker in parallel
  limiter: {
    max: 100, // limit the rate at which jobs are processed, 100 jobs/minute
    duration: 60000, //
  },
  lockDuration: 30000, // Time in milliseconds before a job lock expires
  stalledInterval: 30000, // Check for stalled jobs every 30 seconds
  runRetryDelay: 5000, // Retry failed jobs after 5 seconds
  sharedConnection: true, // Use shared Redis connection
})
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    this.logger.log(`Processing ${job.id}`);
    console.log(`Processing ${job.id}`);

    console.log(job.data);
    await this.emailService.sendEmail(
      job.data.recipient,
      job.data.subject,
      job.data.body,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Active ${job.id}`);
    console.log(`Active ${job.id}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Completed ${job.id}`);
    console.log(`Completed ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    this.logger.log(`Failed ${job.id}`);
    console.log(`Failed ${job.id}`);
  }
}
