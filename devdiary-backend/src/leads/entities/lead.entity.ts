import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProjectType {
  SITE = 'site',
  SISTEMA = 'sistema',
  AUTOMACAO = 'automacao',
  IA = 'ia',
  OUTRO = 'outro',
}

export enum Budget {
  ATE_3K = 'ate-3k',
  DE_3K_A_10K = '3k-10k',
  DE_10K_A_30K = '10k-30k',
  ACIMA_30K = 'acima-30k',
  NAO_SEI = 'nao-sei',
}

export enum Deadline {
  URGENTE = 'urgente',
  UM_A_TRES_MESES = '1-3-meses',
  SEM_PRESSA = 'sem-pressa',
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  ARCHIVED = 'archived',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string | null;

  @Column({ type: 'enum', enum: ProjectType })
  projectType: ProjectType;

  @Column({ type: 'enum', enum: Budget, nullable: true })
  budget: Budget | null;

  @Column({ type: 'enum', enum: Deadline, nullable: true })
  deadline: Deadline | null;

  @Column('text')
  message: string;

  @Index()
  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.NEW })
  status: LeadStatus;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
