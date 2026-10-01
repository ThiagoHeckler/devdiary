import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, LessThanOrEqual, Repository } from 'typeorm';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { Post, PostStatus } from './entities/post.entity';

export type PostSummary = Omit<Post, 'content' | 'status' | 'createdAt'>;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
}
