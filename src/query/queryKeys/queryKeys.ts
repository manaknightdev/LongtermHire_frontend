const queryKeys: Record<string, any> = {
  project: {
    all: "project:all",
    byId: "project:byId",
    byName: "project:byName",
    bySlug: "project:bySlug",
    create: "project:create",
    update: "project:update",
    delete: "project:delete",
    list: "project:list",
    many: "project:many",
    paginate: "project:paginate"
  },
  user: {
    all: "user:all",
    byId: "user:byId",
    byName: "user:byName",
    bySlug: "user:bySlug",
    create: "user:create",
    update: "user:update",
    delete: "user:delete",
    list: "user:list",
    many: "user:many",
    paginate: "user:paginate"
  }
};

export default queryKeys;
