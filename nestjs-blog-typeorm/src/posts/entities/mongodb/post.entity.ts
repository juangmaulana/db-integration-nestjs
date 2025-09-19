import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @ObjectIdColumn()
  _id: ObjectId;

  get id(): string {
    return this._id.toHexString();
  }

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  published: boolean;

  @Column()
  authorId: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
