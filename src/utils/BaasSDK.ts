type RestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "DELETEALL"
  | "GETALL"
  | "CURSORPAGINATE"
  | "AUTOCOMPLETE";
// rcovery
interface BaasSDKConfig {
  baseurl?: string;
  projectId?: string;
  secret?: string;
  feBaseurl?: string;
}

interface APIResponse {
  status?: number;
  message?: string;
  [key: string]: any;
}

interface DBModelPayload {
  [key: string]: any;
}

export default class BaasSDK {
  private _baseurl: string;
  private _project_id: string;
  private _baas_project_id: string;
  private _secret: string;
  private _baas_secret: string;
  private fe_baseurl: string;
  private _table: string;
  private _custom: string;
  private _method: string;
  private _base64Encode: string;

  constructor(config: BaasSDKConfig = {}) {
    this._baseurl = config.baseurl || "https://mkdlabs.com";
    this._project_id = config.projectId || "manaknight";
    this._baas_project_id = this._project_id;
    this._secret = config.secret || "5fchxn5m8hbo6jcxiq3xddofodoacskye1";
    this._baas_secret = this._secret;
    this.fe_baseurl = config.feBaseurl || "http://localhost:3000";

    this._table = "";
    this._custom = "";
    this._method = "";

    const raw = this._project_id + ":" + this._secret;
    this._base64Encode = btoa(raw);
  }

  private async handleFetchResponse(result: Response): Promise<APIResponse> {
    const json = await result.json();

    if (result.status === 401 || result.status === 403) {
      throw new Error(json.message);
    }

    return json;
  }

  private getAuthHeader(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-project": this._base64Encode,
      Authorization: "Bearer " + (localStorage.getItem("token") || ""),
    };
  }

  getHeader(): Record<string, string> {
    return {
      Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      "x-project": this._base64Encode,
    };
  }

  baseUrl(): string {
    return this._baseurl;
  }

  getState() {
    return {
      baseurl: this._baseurl,
      projectId: this._project_id,
      secret: this._secret,
      feBaseurl: this.fe_baseurl,
      table: this._table,
      custom: this._custom,
      method: this._method,
      base64Encode: this._base64Encode,
      baasProjectId: this._baas_project_id,
      baasSecret: this._baas_secret,
    };
  }

  setTable(table: string): void {
    this._table = table;
  }

  setProjectId(project_id: string): void {
    this._project_id = project_id;
  }

  getProjectId(): string {
    return this._project_id;
  }

  setSecret(secret: string): void {
    this._secret = secret;
  }

  getSecret(): string {
    return this._secret;
  }

  async getProfile(): Promise<APIResponse> {
    const result = await fetch(this._baseurl + "/v2/api/lambda/profile", {
      method: "GET",
      headers: this.getAuthHeader(),
    });

    return this.handleFetchResponse(result);
  }

  async getSchemaTables(projectId?: string): Promise<APIResponse> {
    let url = this._baseurl + "/v1/api/schema/table";
    if (projectId) {
      url += "?project_id=" + projectId;
    }

    const result = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeader(),
    });

    return this.handleFetchResponse(result);
  }

  async callRestAPI(payload: any, method: RestMethod): Promise<APIResponse> {
    const fetchOptions = {
      method: "POST",
      headers: this.getAuthHeader(),
      body: JSON.stringify(payload),
    };

    const urlMap: Record<RestMethod, string> = {
      GET: `/v1/api/rest/${this._table}/GET`,
      POST: `/v1/api/rest/${this._table}/POST`,
      PUT: `/v1/api/rest/${this._table}/PUT`,
      DELETE: `/v1/api/rest/${this._table}/DELETE`,
      DELETEALL: `/v1/api/rest/${this._table}/DELETEALL`,
      GETALL: `/v1/api/rest/${this._table}/GETALL`,
      CURSORPAGINATE: `/v1/api/rest/${this._table}/CURSORPAGINATE`,
      AUTOCOMPLETE: `/v1/api/rest/${this._table}/AUTOCOMPLETE`,
    };

    const result = await fetch(this._baseurl + urlMap[method], fetchOptions);
    return this.handleFetchResponse(result);
  }

  async createDBModel(
    projectID: string,
    projectSecret: string,
    table: string,
    payload: DBModelPayload
  ): Promise<APIResponse> {
    const raw = projectID + ":" + projectSecret;
    const base64EncodeText = btoa(raw);
    const url = this._baseurl + "/v1/api/baas/create_table";

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project": base64EncodeText,
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
      body: JSON.stringify({
        table,
        payload,
      }),
    });

    return this.handleFetchResponse(result);
  }

  async alterDBModel(
    projectID: string,
    projectSecret: string,
    table: string,
    payload: DBModelPayload
  ): Promise<APIResponse> {
    const raw = projectID + ":" + projectSecret;
    const base64EncodeText = btoa(raw);
    const url = this._baseurl + "/v1/api/baas/alter_table";

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project": base64EncodeText,
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
      body: JSON.stringify({
        table,
        payload,
      }),
    });

    return this.handleFetchResponse(result);
  }

  async dropDBModel(
    projectID: string,
    projectSecret: string,
    table: string
  ): Promise<APIResponse> {
    const raw = projectID + ":" + projectSecret;
    const base64EncodeText = btoa(raw);
    const url = this._baseurl + "/v1/api/baas/delete_table";

    const result = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project": base64EncodeText,
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
      body: JSON.stringify({
        table,
      }),
    });

    return this.handleFetchResponse(result);
  }
}
