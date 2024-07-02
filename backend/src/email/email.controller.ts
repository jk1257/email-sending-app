import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class SendEmailDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;
}

export class GetMessagesDto {
  @IsEmail()
  recipient: string;
}

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async queueEmail(@Body() data: SendEmailDto) {
    console.log(data);
    const sendEmailDto = plainToInstance(SendEmailDto, data);
    console.log(sendEmailDto);
    const errors = await validate(sendEmailDto);
    console.log(errors);
    if (errors.length > 0) {
      const errorMessages = errors.map((err) => err.constraints);
      console.log(errorMessages);
      throw new BadRequestException(
        `Validation failed: ${JSON.stringify(errorMessages)}`,
      );
    }
    const { email, subject, body } = sendEmailDto;
    await this.emailService.queueEmail(email, subject, body);

    return { message: 'Email queued successfully' };
  }

  @Get('messages')
  async getEmailsByRecipient(@Query() recipient: GetMessagesDto) {
    console.log(recipient);
    const getMessagesDto = plainToInstance(GetMessagesDto, recipient);
    const errors = await validate(getMessagesDto);

    if (errors.length > 0) {
      throw new BadRequestException(
        'Validation failed: recipient must be a valid email address',
      );
    }

    return this.emailService.getEmailsByRecipient(getMessagesDto.recipient);
  }

  @Get('statistics')
  async getEmailStats() {
    return this.emailService.getEmailStatistics();
  }
}
