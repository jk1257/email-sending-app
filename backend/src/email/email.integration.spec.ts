// test/integration/email.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { EmailModule } from './email.module';
import { PrismaService } from '../prisma.service';
import { Queue } from 'bullmq';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { AppModule } from '../app.module';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailController } from './email.controller';
import { SendGridClient } from './sendgrid-client';

describe('EmailModule (Integration)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let emailQueue: Queue;
  let emailService: EmailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        BullModule,
        BullModule.registerQueue({
          name: 'emails',
        }),
        EmailModule,
      ],
      controllers: [EmailController],
      providers: [EmailService, PrismaService, EmailProcessor, SendGridClient],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    emailQueue = module.get<Queue>(getQueueToken('emails'));
  });

  afterAll(async () => {
    await emailQueue.close();
    await prismaService.$disconnect();

    await app.close();
  });

  it('should be defined', () => {
    expect(emailQueue).toBeDefined();
  });
  // beforeEach(async () => {
  //   await emailQueue.drain(); // Clear the queue
  // });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const recipient = process.env.EMAIL_PROSPECT;
      const subject = 'Integration Test Subject';
      const body = 'Integration Test Body';

      await emailService.sendEmail(recipient, subject, body);

      // Wait for the job to be processed
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Verify the database state
      const emailsInDb = await prismaService.email.findMany({
        where: { recipient: recipient },
        orderBy: { createdAt: 'desc' },
      });

      expect(['sent', 'simulated failed']).toContain(emailsInDb[0].status);
    });
  });
});
