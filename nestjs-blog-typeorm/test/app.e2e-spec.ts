/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from 'http';
import request from 'supertest';
import { Repository } from 'typeorm';
import { Post } from '../src/posts/entities/post.entity';
import { User } from '../src/users/entities/user.entity';
import { AppModule } from './../src/app.module';

describe('BlogApp (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let userRepository: Repository<User>;
  let postRepository: Repository<Post>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    httpServer = app.getHttpServer() as Server;
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    postRepository = moduleFixture.get<Repository<Post>>(
      getRepositoryToken(Post),
    );

    await app.init();

    await postRepository.clear();
    await userRepository.clear();
  });

  afterEach(async () => {
    await postRepository.clear();
    await userRepository.clear();
    await app.close();
  });

  describe('Users', () => {
    it('/users (POST) - should create a user', () => {
      const createUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Software developer',
      };

      return request(httpServer)
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res: any) => {
          expect(res.body.name).toBe(createUserDto.name);
          expect(res.body.email).toBe(createUserDto.email);
          expect(res.body.bio).toBe(createUserDto.bio);
          expect(res.body.id).toBeDefined();
        });
    });

    it('/users (GET) - should get all users', async () => {
      const user = await userRepository.save({
        name: 'Jane Doe',
        email: 'jane@example.com',
        bio: 'Product manager',
      });

      return request(httpServer)
        .get('/users')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].id).toBe(user.id);
          expect(res.body[0].name).toBe(user.name);
        });
    });

    it('/users/:id (GET) - should get user by id', async () => {
      const user = await userRepository.save({
        name: 'Bob Smith',
        email: 'bob@example.com',
        bio: 'Designer',
      });

      return request(httpServer)
        .get(`/users/${user.id}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.id).toBe(user.id);
          expect(res.body.name).toBe(user.name);
          expect(res.body.email).toBe(user.email);
        });
    });

    it('/users/:id (PATCH) - should update user', async () => {
      const user = await userRepository.save({
        name: 'Alice Johnson',
        email: 'alice@example.com',
        bio: 'Marketing specialist',
      });

      const updateUserDto = {
        name: 'Alice Smith',
        bio: 'Senior marketing specialist',
      };

      return request(httpServer)
        .patch(`/users/${user.id}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.name).toBe(updateUserDto.name);
          expect(res.body.bio).toBe(updateUserDto.bio);
          expect(res.body.email).toBe(user.email);
        });
    });

    it('/users/:id (DELETE) - should delete user', async () => {
      const user = await userRepository.save({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        bio: 'Data analyst',
      });

      await request(httpServer).delete(`/users/${user.id}`).expect(200);

      const deletedUser = await userRepository.findOne({
        where: { id: user.id },
      });
      expect(deletedUser).toBeNull();
    });
  });

  describe('Posts', () => {
    let testUser: User;

    beforeEach(async () => {
      testUser = await userRepository.save({
        name: 'Test Author',
        email: 'author@example.com',
        bio: 'Test author bio',
      });
    });

    it('/posts (POST) - should create a post', () => {
      const createPostDto = {
        title: 'My First Post',
        content: 'This is the content of my first post',
        authorId: testUser.id,
        published: true,
      };

      return request(httpServer)
        .post('/posts')
        .send(createPostDto)
        .expect(201)
        .expect((res: any) => {
          expect(res.body.title).toBe(createPostDto.title);
          expect(res.body.content).toBe(createPostDto.content);
          expect(res.body.authorId).toBe(createPostDto.authorId);
          expect(res.body.published).toBe(createPostDto.published);
          expect(res.body.id).toBeDefined();
        });
    });

    it('/posts (GET) - should get all posts', async () => {
      const post = await postRepository.save({
        title: 'Test Post',
        content: 'Test content',
        authorId: testUser.id,
        published: true,
      });

      return request(httpServer)
        .get('/posts')
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0].id).toBe(post.id);
          expect(res.body[0].title).toBe(post.title);
        });
    });

    it('/posts/:id (GET) - should get post by id', async () => {
      const post = await postRepository.save({
        title: 'Specific Post',
        content: 'Specific content',
        authorId: testUser.id,
        published: false,
      });

      return request(httpServer)
        .get(`/posts/${post.id}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.id).toBe(post.id);
          expect(res.body.title).toBe(post.title);
          expect(res.body.content).toBe(post.content);
          expect(res.body.published).toBe(false);
        });
    });

    it('/posts/author/:authorId (GET) - should get posts by author', async () => {
      await postRepository.save([
        {
          title: 'Post 1',
          content: 'Content 1',
          authorId: testUser.id,
          published: true,
        },
        {
          title: 'Post 2',
          content: 'Content 2',
          authorId: testUser.id,
          published: false,
        },
      ]);

      return request(httpServer)
        .get(`/posts/author/${testUser.id}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveLength(2);
          expect(
            res.body.every((post: any) => post.authorId === testUser.id),
          ).toBe(true);
        });
    });

    it('/posts/:id (PATCH) - should update post', async () => {
      const post = await postRepository.save({
        title: 'Original Title',
        content: 'Original content',
        authorId: testUser.id,
        published: false,
      });

      const updatePostDto = {
        title: 'Updated Title',
        published: true,
      };

      return request(httpServer)
        .patch(`/posts/${post.id}`)
        .send(updatePostDto)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.title).toBe(updatePostDto.title);
          expect(res.body.published).toBe(updatePostDto.published);
          expect(res.body.content).toBe(post.content);
        });
    });

    it('/posts/:id (DELETE) - should delete post', async () => {
      const post = await postRepository.save({
        title: 'Post to Delete',
        content: 'Content to delete',
        authorId: testUser.id,
        published: true,
      });

      await request(httpServer).delete(`/posts/${post.id}`).expect(200);

      const deletedPost = await postRepository.findOne({
        where: { id: post.id },
      });
      expect(deletedPost).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('/users/:id (GET) - should return 404 for non-existent user', () => {
      return request(httpServer).get('/users/999').expect(404);
    });

    it('/posts/:id (GET) - should return 404 for non-existent post', () => {
      return request(httpServer).get('/posts/999').expect(404);
    });

    it('/users (POST) - should return 400 for invalid email', () => {
      const invalidUserDto = {
        name: 'Test User',
        email: 'invalid-email',
        bio: 'Test bio',
      };

      return request(httpServer)
        .post('/users')
        .send(invalidUserDto)
        .expect(400);
    });

    it('/posts (POST) - should return 400 for missing required fields', () => {
      const invalidPostDto = {
        content: 'Content without title',
      };

      return request(httpServer)
        .post('/posts')
        .send(invalidPostDto)
        .expect(400);
    });
  });
});
