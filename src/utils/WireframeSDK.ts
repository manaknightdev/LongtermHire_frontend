import { empty } from "./utils";

interface WireframeSDKHeaders {
  Authorization: string;
  "x-project": string;
  "Content-Type"?: string;
}

interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data?: T;
}

interface JoinsOptions {
  [key: string]: string[];
}

interface WireframeSDKConfig {
  baseurl?: string;
  project_id?: string;
  secret?: string;
  table?: string;
}

export default class WireframeSDK {
  private _baseurl: string;
  private _project_id: string;
  private _secret: string;
  private _table: string;
  private _base64Encode: string;

  constructor(config: WireframeSDKConfig = {}) {
    this._baseurl = config.baseurl || "https://wireframe.mkdlabs.com";
    this._project_id = config.project_id || "wireframe";
    this._secret = config.secret || "3c3w0u0scvmcv39q0brods1iv11q6n5lf";
    this._table = config.table || "";

    const raw = this._project_id + ":" + this._secret;
    this._base64Encode = btoa(raw);
  }

  private getHeader(additionalHeaders?: Record<string, string>): Headers {
    const baseHeaders: WireframeSDKHeaders = {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      "x-project": this._base64Encode,
    };

    const headers = new Headers();
    Object.entries({ ...baseHeaders, ...(additionalHeaders || {}) }).forEach(
      ([key, value]) => headers.append(key, value)
    );
    return headers;
  }

  private async request<T>(config: {
    endpoint: string;
    method?: string;
    body?: any;
    params?: Record<string, string>;
    additionalHeaders?: Record<string, string>;
    baseUrlOverride?: string;
  }): Promise<ApiResponse<T>> {
    const {
      endpoint,
      method = "GET",
      body = null,
      params = {},
      additionalHeaders = {},
      baseUrlOverride,
    } = config;

    const baseUrl = baseUrlOverride || this._baseurl;
    const queryString = new URLSearchParams(params).toString();
    const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method,
      headers: this.getHeader(additionalHeaders),
      body: body ? JSON.stringify(body) : null,
    });

    const json = await response.json();

    if (json.status === 401 || json.status === 403) {
      throw new Error(json.message);
    }

    return json;
  }

  private joinsPropertyHasValue(options: JoinsOptions): { joins: string } {
    let joins = "";
    Object.entries(options).forEach(([prop, value]) => {
      if (value?.length) {
        joins += `&${prop}=${value}`;
      }
    });
    return { joins };
  }

  public baseUrl(): string {
    return this._baseurl;
  }

  public getProjectId(): string {
    return this._project_id;
  }

  public getTable(): string {
    return this._table;
  }

  public wireBaseUrl(): string {
    return `${this._baseurl}/v5/api/deployments`;
  }

  public async makeFolder<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/make-folder/${id}`,
      method: "POST",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async makeWireframeRow<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/make-wireframe-row/${id}`,
      method: "POST",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async makeRequirement<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/make-requirement/${id}`,
      method: "POST",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async saveWireframeConfig<T>(
    id: string,
    config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/save-wireframe-config/${id}`,
      method: "POST",
      body: { config },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async saveDBConfig<T>(
    id: string,
    config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/save-db-config/${id}`,
      method: "POST",
      body: { config },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async getWireframeConfig<T>(
    id: string,
    type: string,
    _config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(type)) throw new Error("type is required.");

    return this.request({
      endpoint: `/sow/get-wireframe-config/${id}/${type}`,
      method: "GET",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async saveApiConfig<T>(
    id: string,
    config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/save-api-config/${id}`,
      method: "POST",
      body: { config },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async saveIosConfig<T>(
    id: string,
    config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/save-ios-config/${id}`,
      method: "POST",
      body: { config },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async saveAndroidConfig<T>(
    id: string,
    config: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/save-android-config/${id}`,
      method: "POST",
      body: { config },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async commitFileToRepo<T>(
    id: string,
    file: string,
    isPrivate: boolean = false,
    message: string
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(file)) throw new Error("file is required.");
    if (empty(message)) throw new Error("message is required.");

    return this.request({
      endpoint: `/sow/commit-file-to-repo/${id}`,
      method: "POST",
      body: { file, isPrivate, message },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async commitFilesToRepo<T>(
    id: string,
    files: string[],
    isPrivate: boolean = false,
    message: string = ""
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (!files.length) throw new Error("files are required.");

    return this.request({
      endpoint: `/sow/commit-files-to-repo/${id}`,
      method: "POST",
      body: { files, isPrivate, message },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async askGpt<T>(
    prompt: string,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(prompt)) throw new Error("prompt is required.");

    return this.request({
      endpoint: `/sow/ask-gpt`,
      method: "POST",
      body: { prompt, ...options },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async askGptCustom<T>(
    prompt: string,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(prompt)) throw new Error("prompt is required.");

    return this.request({
      endpoint: `/sow/ask-gpt-custom`,
      method: "POST",
      body: { prompt, ...options },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async customAICompletion<T>(
    data: Record<string, any>,
    model: string,
    prompt: string
  ): Promise<ApiResponse<T>> {
    return this.request({
      endpoint: `/sow/custom-ai-completion`,
      method: "POST",
      body: { data, model, prompt },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async getProjectDeployment<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/get-project-deployment/${id}`,
      method: "GET",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async initializeProjectDeployment<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/initialize-project-deployment/${id}`,
      method: "POST",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async createRepo<T>(
    id: string,
    name: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(name)) throw new Error("name is required.");

    return this.request({
      endpoint: `/sow/create-repo/${id}`,
      method: "POST",
      body: { name },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async createDomainRecord<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/create-domain-record/${id}`,
      method: "POST",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async deleteDomainRecord<T>(
    id: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    return this.request({
      endpoint: `/sow/delete-domain-record/${id}`,
      method: "DELETE",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async createJenkinsJob<T>(
    id: string,
    name: string,
    branch: string = "main",
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(name)) throw new Error("name is required.");

    return this.request({
      endpoint: `/sow/create-jenkins-job/${id}`,
      method: "POST",
      body: { name, branch },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async provisionProject<T>(
    id: string,
    name: string,
    branch: string = "main",
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(name)) throw new Error("name is required.");

    return this.request({
      endpoint: `/sow/provision-project/${id}`,
      method: "POST",
      body: { name, branch },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async getRepoBranches<T>(
    id: string,
    name: string,
    _options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");
    if (empty(name)) throw new Error("name is required.");

    return this.request({
      endpoint: `/sow/get-repo-branches/${id}`,
      method: "POST",
      body: { name },
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }

  public async getPaginate<T>(
    id: string,
    options: Record<string, any> = {}
  ): Promise<ApiResponse<T>> {
    if (empty(id)) throw new Error("id is required.");

    const { joins } = this.joinsPropertyHasValue(options);
    return this.request({
      endpoint: `/sow/get-paginate/${id}${joins}`,
      method: "GET",
      baseUrlOverride: this.wireBaseUrl(),
      additionalHeaders: { "Content-Type": "application/json" },
    });
  }
}
