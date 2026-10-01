import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArrayContains } from 'typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  const repository = {
    findAndCount: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
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
});
