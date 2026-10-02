import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminListLeadsQueryDto } from './dto/admin-list-leads-query.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';
import { LeadsService } from './leads.service';

/** Contatos recebidos, vistos pelo painel admin. */
@Controller('admin/leads')
@UseGuards(JwtAuthGuard)
export class AdminLeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@Query() query: AdminListLeadsQueryDto) {
    return this.leadsService.findAll(query);
  }

  @Patch(':id')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, dto.status);
  }
}
