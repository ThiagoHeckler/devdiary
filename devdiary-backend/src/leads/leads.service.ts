import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paginated, paginate } from '../common/pagination';
import { MailService } from '../mail/mail.service';
import { AdminListLeadsQueryDto } from './dto/admin-list-leads-query.dto';
import { CreateLeadDto } from './dto/create-lead.dto';
import {
  Budget,
  Deadline,
  Lead,
  LeadStatus,
  ProjectType,
} from './entities/lead.entity';

const projectTypeLabels: Record<ProjectType, string> = {
  [ProjectType.SITE]: 'Site',
  [ProjectType.SISTEMA]: 'Sistema web',
  [ProjectType.AUTOMACAO]: 'Automação',
  [ProjectType.IA]: 'Solução com IA',
  [ProjectType.OUTRO]: 'Outro',
};

const budgetLabels: Record<Budget, string> = {
  [Budget.ATE_3K]: 'Até R$ 3 mil',
  [Budget.DE_3K_A_10K]: 'R$ 3 mil a R$ 10 mil',
  [Budget.DE_10K_A_30K]: 'R$ 10 mil a R$ 30 mil',
  [Budget.ACIMA_30K]: 'Acima de R$ 30 mil',
  [Budget.NAO_SEI]: 'Ainda não sei',
};

const deadlineLabels: Record<Deadline, string> = {
  [Deadline.URGENTE]: 'Urgente (até 1 mês)',
  [Deadline.UM_A_TRES_MESES]: '1 a 3 meses',
  [Deadline.SEM_PRESSA]: 'Sem pressa',
};

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadsRepository: Repository<Lead>,
    private readonly mailService: MailService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateLeadDto): Promise<void> {
    const { website, ...data } = dto;
    if (website) {
      // Responde como sucesso para não ensinar o bot a contornar a armadilha.
      this.logger.warn('Contato descartado pelo honeypot.');
      return;
    }

    const lead = await this.leadsRepository.save(
      this.leadsRepository.create({
        ...data,
        company: data.company ?? null,
        budget: data.budget ?? null,
        deadline: data.deadline ?? null,
      }),
    );

    // O contato já está salvo: uma falha no e-mail não deve virar erro para o visitante.
    try {
      await this.notify(lead);
    } catch (error) {
      this.logger.error(
        `Falha ao enviar o aviso do contato ${lead.id}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async findAll({
    page,
    limit,
    status,
  }: AdminListLeadsQueryDto): Promise<Paginated<Lead>> {
    const [items, total] = await this.leadsRepository.findAndCount({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return paginate(items, total, page, limit);
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.leadsRepository.findOneBy({ id });
    if (!lead) {
      throw new NotFoundException('Contato não encontrado');
    }
    lead.status = status;
    return this.leadsRepository.save(lead);
  }

  private async notify(lead: Lead) {
    const to = this.config.get<string>('LEADS_NOTIFY_TO');
    if (!to) {
      this.logger.warn('LEADS_NOTIFY_TO não definido: aviso não enviado.');
      return;
    }

    // Quebras de linha no assunto poderiam injetar cabeçalhos no e-mail.
    const name = lead.name.replace(/[\r\n]+/g, ' ');
    await this.mailService.send({
      to,
      replyTo: lead.email,
      subject: `Novo contato: ${name} (${projectTypeLabels[lead.projectType]})`,
      text: [
        `Nome: ${lead.name}`,
        `E-mail: ${lead.email}`,
        `Empresa: ${lead.company ?? '-'}`,
        `Tipo de projeto: ${projectTypeLabels[lead.projectType]}`,
        `Orçamento: ${lead.budget ? budgetLabels[lead.budget] : '-'}`,
        `Prazo: ${lead.deadline ? deadlineLabels[lead.deadline] : '-'}`,
        '',
        'Mensagem:',
        lead.message,
        '',
        '---',
        `Recebido em ${lead.createdAt.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
        'Responda este e-mail para falar direto com o contato.',
      ].join('\n'),
    });
  }
}
