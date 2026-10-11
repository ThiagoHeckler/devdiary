import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArrayContains, QueryFailedError } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  const repository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    repository.create.mockImplementation((data: Partial<Post>) => ({
      ...data,
    }));
    repository.save.mockImplementation((post: Post) => Promise.resolve(post));
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: repository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('findPublished', () => {
    it('returns only published posts, paginated and newest first', async () => {
      repository.findAndCount.mockResolvedValue([[{ slug: 'a' }], 21]);

      const result = await service.findPublished({ page: 3, limit: 10 });

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.not.objectContaining({ tags: expect.anything() }),
          order: { publishedAt: 'DESC' },
          skip: 20,
          take: 10,
        }),
      );
      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: PostStatus.PUBLISHED }),
          select: expect.not.objectContaining({ content: true }),
        }),
      );
      expect(result).toEqual({
        items: [{ slug: 'a' }],
        total: 21,
        page: 3,
        limit: 10,
        totalPages: 3,
      });
    });

    it('filters by tag', async () => {
      repository.findAndCount.mockResolvedValue([[], 0]);

      await service.findPublished({ page: 1, limit: 10, tag: 'nestjs' });

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ tags: ArrayContains(['nestjs']) }),
        }),
      );
    });
  });

  describe('findPublishedBySlug', () => {
    it('returns the published post', async () => {
      const post = { slug: 'meu-post' } as Post;
      repository.findOne.mockResolvedValue(post);

      await expect(service.findPublishedBySlug('meu-post')).resolves.toBe(post);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: expect.objectContaining({
          slug: 'meu-post',
          status: PostStatus.PUBLISHED,
        }),
      });
    });

    it('throws NotFoundException when the post does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findPublishedBySlug('nao-existe')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const dto = {
      title: 'Olá, Mundo!',
      excerpt: 'Um resumo do post.',
      content: '# Conteúdo',
    };

    it('creates a draft with a slug generated from the title', async () => {
      const post = await service.create(dto);

      expect(post).toMatchObject({
        slug: 'ola-mundo',
        status: PostStatus.DRAFT,
        publishedAt: null,
        tags: [],
        coverImageUrl: null,
      });
    });

    it('sets publishedAt when publishing without a date', async () => {
      const post = await service.create({
        ...dto,
        status: PostStatus.PUBLISHED,
      });

      expect(post.publishedAt).toBeInstanceOf(Date);
    });

    it('keeps the given publishedAt', async () => {
      const publishedAt = new Date('2026-12-01T12:00:00Z');
      const post = await service.create({
        ...dto,
        status: PostStatus.PUBLISHED,
        publishedAt,
      });

      expect(post.publishedAt).toBe(publishedAt);
    });

    it('throws ConflictException when the slug already exists', async () => {
      const error = new QueryFailedError('INSERT', [], new Error('duplicate'));
      Object.assign(error.driverError, { code: '23505' });
      repository.save.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('regenerates the slug when it is cleared', async () => {
      repository.findOneBy.mockResolvedValue({
        id: '1',
        title: 'Título antigo',
        slug: 'titulo-antigo',
        status: PostStatus.DRAFT,
        publishedAt: null,
      });

      const post = await service.update('1', {
        title: 'Título novo',
        slug: null,
      });

      expect(post.slug).toBe('titulo-novo');
    });

    it('throws NotFoundException for an unknown id', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.update('1', { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
