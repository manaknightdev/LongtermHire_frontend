export enum RestAPIMethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PUTWHERE = "PUTWHERE",
  DELETE = "DELETE",
  DELETEALL = "DELETEALL",
  GETALL = "GETALL",
  PAGINATE = "PAGINATE",
  CURSORPAGINATE = "CURSORPAGINATE",
  AUTOCOMPLETE = "AUTOCOMPLETE",
}

export enum RoleEnum {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum TableActionEnum {
  ADD = "add",
  EDIT = "edit",
  VIEW = "view",
  DELETE = "delete",
  EXPORT = "export",
  BULK_ADD = "bulk_add",
  BULK_VIEW = "bulk_view",
  BULK_EDIT = "bulk_edit",
  BULK_DELETE = "bulk_delete",
}

export enum ToastStatusEnum {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
