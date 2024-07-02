import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { PrismaService } from '../prisma.service';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SendGridClient } from './sendgrid-client';
import { EmailModule } from './email.module';
import { EmailController } from './email.controller';
import { AppModule } from '../app.module';
import { EmailProcessor } from './email.processor';

describe('EmailService', () => {
  let emailService: EmailService;
  let prismaService: PrismaService;
  let queue: Queue;

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
      providers: [EmailService, PrismaService, SendGridClient],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    prismaService = module.get<PrismaService>(PrismaService);
    queue = module.get<Queue>(getQueueToken('emails'));
  });

  // afterEach(async () => {
  //   await prismaService.email.deleteMany();
  // });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('queueEmail', () => {
    it('should add email to queue successfully', async () => {
      const recipient = process.env.EMAIL_PROSPECT;
      const subject = 'Email Service Test Subject';
      const body = 'Email Service Test Body';

      const response = await emailService.queueEmail(recipient, subject, body);
      await new Promise((resolve) => setTimeout(resolve, 500));
      //queueEmail doesn't return anything
      expect(response).toBeUndefined();
    });
  });

  describe('getEmailsByRecipient', () => {
    it('should return emails for a valid recipient', async () => {
      const result =
        await emailService.getEmailsByRecipient('test@example.com');
      console.log(result);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
