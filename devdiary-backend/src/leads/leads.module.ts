import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { AdminLeadsController } from './admin-leads.controller';
import { Lead } from './entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), MailModule],
  controllers: [LeadsController, AdminLeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
