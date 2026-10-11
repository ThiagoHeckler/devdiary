import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '../entities/post.entity';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Campos opcionais vazios ("") viram null. */
const trimOrNull = ({ value }: { value: unknown }) => {
  const trimmed = trim({ value });
  return trimmed === '' ? null : trimmed;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class CreatePostDto {
  @Transform(trim)
  @IsString()
  @Length(3, 200)
  title: string;

  /** Se não vier, é gerado a partir do título. */
  @Transform(trimOrNull)
  @IsOptional()
  @IsString()
  @MaxLength(220)
  @Matches(SLUG_PATTERN, {
    message: 'slug deve ter só letras minúsculas, números e hífens',
  })
  slug?: string | null;

  @Transform(trim)
  @IsString()
  @Length(10, 300)
  excerpt: string;

  /** Markdown. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  content: string;

  @Transform(trimOrNull)
  @IsOptional()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @MaxLength(500)
  coverImageUrl?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @Matches(/^[a-z0-9-]{1,50}$/, {
    each: true,
    message: 'cada tag deve ter só letras minúsculas, números e hífens',
  })
  tags?: string[];

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  /** Data de publicação. Se o post for publicado sem ela, vale a data atual. */
  @Transform(trimOrNull)
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date | null;
}
