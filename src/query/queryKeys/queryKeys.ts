const queryKeys: Record<string, any> = {
  project: {
    all: "project:all",
    byId: "project:byId",
    byName: "project:byName",
    bySlug: "project:bySlug",
    create: "project:create",
    update: "project:update",
    delete: "project:delete",
  },
  user: {
    all: "user:all",
    byId: "user:byId",
    byName: "user:byName",
    bySlug: "user:bySlug",
    create: "user:create",
    update: "user:update",
    delete: "user:delete",
  },
  role: {
    all: "role:all",
    byId: "role:byId",
    byName: "role:byName",
    bySlug: "role:bySlug",
    create: "role:create",
    update: "role:update",
    delete: "role:delete",
  },
  permission: {
    all: "permission:all",
    byId: "permission:byId",
    byName: "permission:byName",
    bySlug: "permission:bySlug",
    create: "permission:create",
    update: "permission:update",
    delete: "permission:delete",
  },
};

export default queryKeys;
