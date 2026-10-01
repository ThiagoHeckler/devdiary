import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListPostsQueryDto } from './dto/list-posts-query.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query() query: ListPostsQueryDto) {
    return this.postsService.findPublished(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.postsService.findPublishedBySlug(slug);
  }
}
