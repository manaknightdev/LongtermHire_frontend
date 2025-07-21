/**
 * User fixtures for testing
 */

export const TEST_USERS = {
  ADMIN: {
    email: "adminsuper@manaknight.com",
    password: "a123456",
    role: "super_admin",
  },
  USER: {
    email: "user@example.com",
    password: "password123",
    role: "user",
  },
  INVALID: {
    email: "invalid@example.com",
    password: "wrongpassword",
    role: "none",
  },
};
