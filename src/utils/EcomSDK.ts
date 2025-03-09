interface EcomSDKHeaders {
  Authorization: string;
  "x-project": string;
  "Content-Type": string;
}

interface ProductPayload {
  price?: number;
  category?: number;
  is_featured?: boolean;
  name?: string;
  page?: number;
  limit?: number;
  direction?: "ASC" | "DESC";
  order?: string;
}

interface ApiResponse<T = any> {
  status: number;
  message?: string;
  data?: T;
}

export class EcomSDK {
  private _baseurl: string;
  private _project_id: string;
  private _secret: string;
  private _base64Encode: string;

  constructor() {
    this._baseurl = "https://wireframe.mkdlabs.com";
    this._project_id = "wireframe";
    this._secret = "3c3w0u0scvmcv39q0brods1iv11q6n5lf";
    
    const raw = this._project_id + ":" + this._secret;
    this._base64Encode = btoa(raw);
  }

  private getHeader(additionalHeaders?: Record<string, string>): Headers {
    const baseHeaders: EcomSDKHeaders = {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      "x-project": this._base64Encode,
      "Content-Type": "application/json",
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
  }): Promise<ApiResponse<T>> {
    const {
      endpoint,
      method = "GET",
      body = null,
      params = {},
      additionalHeaders = {},
    } = config;

    const queryString = new URLSearchParams(params).toString();
    const url = `${this._baseurl}${endpoint}${queryString ? `?${queryString}` : ""}`;

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

  public generateUniqueNumber(): number {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % 1000000000;
  }

  public async getProducts<T>(payload: any): Promise<ApiResponse<T>> {
    return this.request({
      endpoint: "/v2/api/lambda/ecom/product",
      method: "POST",
      body: payload,
    });
  }

  public async getFilteredProducts<T>(payload: ProductPayload = {}): Promise<ApiResponse<T>> {
    const params: Record<string, string> = {
      type: "product",
      limit: (payload.limit || 16).toString(),
      direction: payload.direction || "ASC",
      orderBy: payload.order || "id",
    };

    if (payload.price) params.price = payload.price.toString();
    if (payload.category) params.category_id = payload.category.toString();
    if (payload.is_featured !== undefined) params.is_featured = payload.is_featured.toString();
    if (payload.name) params.name = payload.name;
    if (payload.page) params.page = payload.page.toString();

    return this.request({
      endpoint: "/v2/api/lambda/ecom/filters/",
      method: "GET",
      params,
    });
  }

  public async getFilteredProductsByCategory<T>(category_id: number): Promise<ApiResponse<T>> {
    return this.request({
      endpoint: "/v2/api/lambda/ecom/filters/",
      method: "GET",
      params: {
        type: "category",
        id: category_id.toString(),
      },
    });
  }
}
