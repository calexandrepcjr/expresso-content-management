import { UserId } from "@src/auth/domain/interfaces/userId";
import { Config } from "@src/content-management-system/config/config";
import { Post } from "@src/content-management-system/domain/entities/post";
import { PostRepository as DomainPostRepository } from "@src/content-management-system/domain/interfaces/postRepository";
import { MutableRequired } from "@src/utils/mutableRequired";
import { either } from "fp-ts";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

const someRootUserPosts = [
  new Post({
    id: 1,
    category: "Nerdy stuff",
    content: "Testing some nerdy stuff",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  new Post({
    id: 2,
    category: "Career",
    content: "A serious blog post regarding career",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
];

export class PostRepository implements DomainPostRepository {
  private static readonly storage: Map<UserId, Post[]> = new Map<
    UserId,
    Post[]
  >([[Config.RootUserId, someRootUserPosts]]);

  public async findAll(userId: UserId): Promise<Either<Error, Post[]>> {
    return either.right(PostRepository.storage.get(userId) ?? []);
  }

  public async findById(
    userId: UserId,
    postId: number,
  ): Promise<Either<Error, Post>> {
    const maybeSomePosts = await this.findAll(userId);

    return pipe(
      maybeSomePosts,
      either.map(
        (somePosts: Post[]) =>
          somePosts.find((aPost) => aPost.id === postId) ?? Post.empty(),
      ),
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

      PostRepository.storage.set(userId, [aNewPost]);

      return;
    }
    const lastId = someUserPosts[someUserPosts.length - 1]?.id ?? 1;
    const aNewPost = new Post({
      ...aPost,
      id: lastId + 1,
    });
    aPost.id = aNewPost.id;

    someUserPosts.push(aNewPost);
  }
}
