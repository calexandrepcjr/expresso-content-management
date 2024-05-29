import { UserId } from "@src/auth/domain/interfaces/userId";
import { PostId } from "@src/content-management-system/domain/interfaces/postId";
import { Config } from "@src/content-management-system/config/config";
import { Post } from "@src/content-management-system/domain/entities/post";
import { PostRepository as DomainPostRepository } from "@src/content-management-system/domain/interfaces/postRepository";
import { MutableRequired } from "@src/utils/mutableRequired";
import { either } from "fp-ts";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BuiltinLogger } from "express-zod-api";

const someRootUserPosts = new Map<PostId, Post>([
  [
    1,
    new Post({
      id: 1,
      category: "Nerdy stuff",
      content: "Testing some nerdy stuff",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ],
  [
    2,
    new Post({
      id: 2,
      category: "Career",
      content: "A serious blog post regarding career",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ],
]);

export class PostRepository implements DomainPostRepository {
  private static readonly storage: Map<UserId, Map<PostId, Post>> = new Map<
    UserId,
    Map<PostId, Post>
  >([[Config.RootUserId, someRootUserPosts]]);
  private static lastId: PostId = 2;
  private readonly logger: BuiltinLogger;

  public constructor(logger?: BuiltinLogger) {
    // TODO: Move to the outmost layer with DI

    this.logger =
      logger ??
      new BuiltinLogger({
        level: process.env["NODE_ENV"] === "development" ? "debug" : "info",
        color: true,
      });
  }

  public async findAll(userId: UserId): Promise<Either<Error, Post[]>> {
    return either.right([
      ...(PostRepository.storage.get(userId)?.values() ?? []),
    ]);
  }

  public async findById(
    userId: UserId,
    postId: number,
  ): Promise<Either<Error, Post>> {
    return pipe(
      PostRepository.storage.get(userId)?.get(postId),
      either.fromNullable(new Error("Post Not Found")),
    );
  }

  public async create(
    userId: UserId,
    aPost: MutableRequired<Post>,
  ): Promise<void> {
    const someUserPosts = PostRepository.storage.get(userId);

    if (!someUserPosts) {
      const aNewPost = new Post({
        ...aPost,
        id: 1,
      });
      aPost.id = aNewPost.id;

      PostRepository.storage.set(
        userId,
        new Map<PostId, Post>([[aNewPost.id, aNewPost]]),
      );

      PostRepository.lastId = aNewPost.id;

      return;
    }

    PostRepository.lastId += 1;

    const aNewPost = new Post({
      ...aPost,
      id: PostRepository.lastId,
    });
    aPost.id = aNewPost.id;

    someUserPosts.set(aNewPost.id, aNewPost);
  }

  public async update(userId: string, aPost: Post): Promise<void> {
    const someUserPosts = PostRepository.storage.get(userId);
    const aLoadedPost = someUserPosts?.get(aPost.id);

    pipe(
      aLoadedPost,
      either.fromNullable(new Error("Post Not Found")),
      either.match(
        (anError) => {
          this.logger.error(anError.message, { post: aPost });

          aPost.invalidate(anError);
        },
        () => {
          const aNewPost = new Post({
            ...aPost,
            updatedAt: new Date(),
          });

          someUserPosts?.set(aNewPost.id, aNewPost);
        },
      ),
    );
  }
  public async removeByUser(userId: string): Promise<void> {
    pipe(
      PostRepository.storage.get(userId),
      either.fromNullable(new Error("User has no posts to remove")),
      either.match(
        (anError) => {
          this.logger.error(anError.message, { userId });
        },
        (userIdStorage) => {
          userIdStorage.clear();
        },
      ),
    );
  }
}
