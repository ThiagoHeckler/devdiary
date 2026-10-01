import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    this.from = config.get<string>(
      'MAIL_FROM',
      'DevDiary <no-reply@localhost>',
    );
    this.transporter = host
      ? createTransport({
          host,
          port: Number(config.get('SMTP_PORT', 587)),
          secure: config.get('SMTP_SECURE') === 'true',
          auth: config.get('SMTP_USER')
            ? {
                user: config.get<string>('SMTP_USER'),
                pass: config.get<string>('SMTP_PASS'),
              }
            : undefined,
          connectionTimeout: 10_000,
          greetingTimeout: 10_000,
          socketTimeout: 20_000,
        })
      : null;

    if (!this.transporter) {
      this.logger.warn('SMTP_HOST não definido: e-mails não serão enviados.');
    }
  }

  async send(message: MailMessage): Promise<void> {
    if (!this.transporter) {
      this.logger.warn(`E-mail não enviado (sem SMTP): "${message.subject}"`);
      return;
    }
    await this.transporter.sendMail({ from: this.from, ...message });
  }
}
