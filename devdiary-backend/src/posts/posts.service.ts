import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArrayContains,
  LessThanOrEqual,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { Paginated, paginate } from '../common/pagination';
import { AdminListPostsQueryDto } from './dto/admin-list-posts-query.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostStatus } from './entities/post.entity';
import { slugify } from './slugify';

export type PostSummary = Omit<Post, 'content' | 'status' | 'createdAt'>;
export type AdminPostSummary = Omit<Post, 'content'>;

/** Código do Postgres para violação de índice único. */
const UNIQUE_VIOLATION = '23505';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  private publishedWhere() {
    return {
      status: PostStatus.PUBLISHED,
      publishedAt: LessThanOrEqual(new Date()),
    };
  }

  async findPublished({
    page,
    limit,
    tag,
  }: ListPostsQueryDto): Promise<Paginated<PostSummary>> {
    const [items, total] = await this.postsRepository.findAndCount({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        tags: true,
        publishedAt: true,
        updatedAt: true,
      },
      where: {
        ...this.publishedWhere(),
        ...(tag && { tags: ArrayContains([tag]) }),
      },
      order: { publishedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginate(items, total, page, limit);
  }

  async findPublishedBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { ...this.publishedWhere(), slug },
    });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async findAllForAdmin({
    page,
    limit,
    status,
  }: AdminListPostsQueryDto): Promise<Paginated<AdminPostSummary>> {
    const [items, total] = await this.postsRepository.findAndCount({
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        tags: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      where: status ? { status } : {},
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return paginate(items, total, page, limit);
  }

  async findById(id: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }
    return post;
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      ...dto,
      slug: dto.slug || slugify(dto.title),
      coverImageUrl: dto.coverImageUrl ?? null,
      tags: dto.tags ?? [],
      status: dto.status ?? PostStatus.DRAFT,
      publishedAt: dto.publishedAt ?? null,
    });
    this.fillPublishedAt(post);
    return this.save(post);
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findById(id);
    Object.assign(post, dto);
    // Slug apagado no editor: gera de novo a partir do título.
    if (!post.slug) {
      post.slug = slugify(post.title);
    }
    this.fillPublishedAt(post);
    return this.save(post);
  }

  async remove(id: string): Promise<void> {
    const result = await this.postsRepository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException('Post não encontrado');
    }
  }

  /** Ao publicar sem data, o post entra no ar agora. */
  private fillPublishedAt(post: Post) {
    if (post.status === PostStatus.PUBLISHED && !post.publishedAt) {
      post.publishedAt = new Date();
    }
  }

  private async save(post: Post): Promise<Post> {
    if (!post.slug) {
      throw new BadRequestException(
        'Não foi possível gerar o slug a partir do título. Informe um slug.',
      );
    }
    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === UNIQUE_VIOLATION
      ) {
        throw new ConflictException(
          `Já existe um post com o slug "${post.slug}"`,
        );
      }
      throw error;
    }
  }
}
