import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead, LeadStatus, ProjectType } from './entities/lead.entity';
import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;
  const repository = { create: jest.fn(), save: jest.fn() };
  const mailService = { send: jest.fn() };
  const config = { get: jest.fn() };

  const dto: CreateLeadDto = {
    name: 'Maria Silva',
    email: 'maria@exemplo.com',
    projectType: ProjectType.SITE,
    message: 'Preciso de um site para a minha empresa.',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    repository.create.mockImplementation((data: Partial<Lead>) => data);
    repository.save.mockImplementation((lead: Partial<Lead>) =>
      Promise.resolve({
        ...lead,
        id: 'lead-1',
        status: LeadStatus.NEW,
        createdAt: new Date('2026-10-01T12:00:00Z'),
      }),
    );
    config.get.mockReturnValue('eu@exemplo.com');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        { provide: getRepositoryToken(Lead), useValue: repository },
        { provide: MailService, useValue: mailService },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<LeadsService>(LeadsService);
  });

  it('saves the lead and notifies by e-mail', async () => {
    await service.create(dto);

    expect(repository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Maria Silva',
        company: null,
        budget: null,
        deadline: null,
      }),
    );
    expect(mailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'eu@exemplo.com',
        replyTo: 'maria@exemplo.com',
        subject: 'Novo contato: Maria Silva (Site)',
        text: expect.stringContaining(dto.message),
      }),
    );
  });

  it('removes line breaks from the name in the subject', async () => {
    await service.create({ ...dto, name: 'Maria\r\nBcc: x@y.com' });

    expect(mailService.send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Novo contato: Maria Bcc: x@y.com (Site)',
      }),
    );
  });

  it('does not fail when the e-mail cannot be sent', async () => {
    mailService.send.mockRejectedValue(new Error('SMTP fora do ar'));

    await expect(service.create(dto)).resolves.toBeUndefined();
    expect(repository.save).toHaveBeenCalled();
  });

  it('discards submissions that fill the honeypot field', async () => {
    await service.create({ ...dto, website: 'http://spam.example' });

    expect(repository.save).not.toHaveBeenCalled();
    expect(mailService.send).not.toHaveBeenCalled();
  });
});
