import { UserEntity } from '../user/user.entity';
import { Comment } from './comment.entity';

// @Entity('article')
// export class ArticleEntity {

//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   slug: string;

//   @Column()
//   title: string;

//   @Column({default: ''})
//   description: string;

//   @Column({default: ''})
//   body: string;

//   @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
//   created: Date;

//   @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP"})
//   updated: Date;

//   @BeforeUpdate()
//   updateTimestamp() {
//     this.updated = new Date;
//   }

//   @Column('simple-array')
//   tagList: string[];

//   @ManyToOne(type => UserEntity, user => user.name)
//   author: UserEntity;

//   @OneToMany(type => Comment, comment => comment.article, {eager: true})
//   @JoinColumn()
//   comments: Comment[];

//   @Column({default: 0})
//   favoriteCount: number;
// }

// model Article {
//   id             Int       @id @default(autoincrement())
//   slug           String
//   title          String
//   description    String    @default('')
//   body           String    @default('')
//   created        DateTime  @default(now())
//   updated        DateTime  @default(now()) @updatedAt
//   tagList        String[]
//   favoriteCount  Int       @default(0)

//   // Relationships
//   author         User      @relation(fields: [authorId], references: [id])
//   authorId       Int

//   comments       Comment[] @relation("CommentToArticle")
// }
