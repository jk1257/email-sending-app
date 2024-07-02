import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';
import * as sgMail from '@sendgrid/mail';
import { SendGridClient } from './sendgrid-client';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('emails') readonly emailQueue: Queue,
    private readonly prismaService: PrismaService,
    private readonly sendGridClient: SendGridClient,
  ) {}

  private async createDBEmail(data: {
    recipient: string;
    subject: string;
    body: string;
    status: string;
    error?: string;
  }) {
    return this.prismaService.email.create({ data });
  }

  async getEmailsByRecipient(recipient: string) {
    return this.prismaService.email.findMany({
      where: { recipient },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmailStatistics() {
    return this.prismaService.email.findMany({
      select: {
        status: true,
        createdAt: true,
      },
    });
  }

  async queueEmail(recipient: string, subject: string, body: string) {
    try {
      await this.emailQueue.add(
        'sendEmail',
        { recipient, subject, body },
        { delay: 1000 },
      );
    } catch (error) {
      throw new Error('Failed to add job to queue');
    }
  }

  private async sendToSendGrid(
    recipient: string,
    subject: string,
    body: string,
  ) {
    const mail: sgMail.MailDataRequired = {
      to: recipient,
      from: process.env.EMAIL_USER,
      subject: subject,
      content: [{ type: 'text/plain', value: body }],
    };
    await this.sendGridClient.send(mail);
  }

  private async sendToSendGridTemplate(
    recipient: string,
    subject: string,
    body: string,
  ) {
    const mail: sgMail.MailDataRequired = {
      to: recipient,
      from: process.env.EMAIL_USER,
      subject: subject,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: { body: body, subject: subject },
    };
    await this.sendGridClient.send(mail);
  }

  async sendEmail(recipient: string, subject: string, body: string) {
    if (Math.random() < 0.1) {
      await this.createDBEmail({
        recipient,
        subject,
        body,
        status: 'simulated failed',
        error: 'Simulated failure',
      });
      throw new Error('Failed to send email');
    }

    try {
      await this.sendToSendGrid(recipient, subject, body);
      await this.createDBEmail({
        recipient,
        subject,
        body,
        status: 'sent',
      });
    } catch (error) {
      console.log(error);
      await this.createDBEmail({
        recipient,
        subject,
        body,
        status: 'failed',
        error: error.message,
      });
      throw new Error('Failed to send email');
    }
  }
}
