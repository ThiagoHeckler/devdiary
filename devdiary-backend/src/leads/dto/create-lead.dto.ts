import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Budget, Deadline, ProjectType } from '../entities/lead.entity';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Campos opcionais vazios ("") viram undefined. */
const trimOrUndefined = ({ value }: { value: unknown }) => {
  const trimmed = trim({ value });
  return trimmed === '' ? undefined : trimmed;
};

export class CreateLeadDto {
  @Transform(trim)
  @IsString()
  @Length(2, 100)
  name: string;

  @Transform(trim)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Transform(trimOrUndefined)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @IsEnum(ProjectType)
  projectType: ProjectType;

  @Transform(trimOrUndefined)
  @IsOptional()
  @IsEnum(Budget)
  budget?: Budget;

  @Transform(trimOrUndefined)
  @IsOptional()
  @IsEnum(Deadline)
  deadline?: Deadline;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @Length(20, 5000)
  message: string;

  /**
   * Armadilha para bots: o campo fica escondido no formulário, então só
   * robôs que preenchem tudo o enviam com valor.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
