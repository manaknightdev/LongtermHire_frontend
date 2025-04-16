export interface MethodConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  requiresAuth?: boolean;
  transformResponse?: (response: any) => any;
  dynamicEndpoint?: boolean;
  signal?: AbortSignal;
  excludeHeaders?: Array<string>;
}

export type RestAPIMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PUTWHERE"
  | "DELETE"
  | "DELETEALL"
  | "GETALL"
  | "PAGINATE"
  | "CURSORPAGINATE"
  | "AUTOCOMPLETE";

// Supported REST API method
