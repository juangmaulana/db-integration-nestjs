import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
      include: {
        author: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
      include: {
        author: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}
