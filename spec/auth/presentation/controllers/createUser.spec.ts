import { createUser } from "@spec/auth/test-utils/createUser";

describe("[Auth] Users", () => {
  describe("POST /auth/users/signup", () => {
    it("creates a user", createUser);
  });
});
