import { Test, TestingModule } from '@nestjs/testing';
import { EmailController, GetMessagesDto } from './email.controller';
import { EmailService } from './email.service';
import { BadRequestException } from '@nestjs/common';

class MockEmailService {
  async queueEmail(recipient: string, subject: string, body: string) {
    return Promise.resolve();
  }

  async getEmailsByRecipient(recipient: string) {
    return Promise.resolve([
      { recipient, subject: 'Test Subject', body: 'Test Body' },
    ]);
  }
}

describe('EmailController', () => {
  let emailController: EmailController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        EmailService,
        {
          provide: EmailService,
          useClass: MockEmailService,
        },
      ],
    }).compile();

    emailController = module.get<EmailController>(EmailController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(emailController).toBeDefined();
  });

  describe('queueEmail', () => {
    it('should queue an email successfully', async () => {
      const data = {
        email: 'unit_test@example.com',
        subject: 'Unit Test Subject',
        body: 'Unit Test Body',
      };

      jest.spyOn(emailService, 'queueEmail').mockResolvedValueOnce(undefined);

      const result = await emailController.queueEmail(data);
      expect(result).toEqual({ message: 'Email queued successfully' });
    });

    it('should throw BadRequestException for invalid email', async () => {
      const data = {
        email: 'invalid-email',
        subject: 'Unit Test Subject',
        body: 'Unit Test Body',
      };

      await expect(emailController.queueEmail(data)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for empty subject', async () => {
      const data = {
        email: 'test@example.com',
        subject: '',
        body: 'Test Body',
      };

      await expect(emailController.queueEmail(data)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for empty body', async () => {
      const data = {
        email: 'test@example.com',
        subject: 'Test Subject',
        body: '',
      };

      await expect(emailController.queueEmail(data)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getEmailsByRecipient', () => {
    it('should return emails for a valid recipient', async () => {
      const validRecipient: GetMessagesDto = { recipient: 'test@example.com' };

      jest
        .spyOn(emailService, 'getEmailsByRecipient')
        .mockResolvedValueOnce([
          {
            id: 13,
            recipient: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
            status: 'sent',
            error: null,
            createdAt: new Date('2024-06-30T23:36:22.283Z'),
          },
        ]);

      const result = await emailController.getEmailsByRecipient(validRecipient);
      console.log(result);

      expect(emailService.getEmailsByRecipient).toHaveBeenCalledWith(
        validRecipient.recipient,
      );
      expect(result).toHaveLength(1);
    });

    it('should throw BadRequestException for invalid email query', async () => {
      const invalidRecipient = { recipient: 'invalid-email' };

      await expect(
        emailController.getEmailsByRecipient(invalidRecipient),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
