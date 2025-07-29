// @ts-nocheck
/**
 * MkdSDK - React Frontend SDK
 * Simplified version focusing on upload functionality
 */
//
class MkdSDK {
  constructor(config: any = {}) {
    this._baseurl = "http://localhost:5172";
    this._project_id = config.project_id || "longtermhire";
    this._table = config.table || "";
    this._secret = config.secret || "longtermhire_secret"; // Default secret for longtermhire
    this._base64Encode = "";

    // Always initialize the x-project header
    this.resetXProject();
  }

  // Set table for operations
  setTable(table) {
    this._table = table;
  }

  // Get project ID
  getProjectId() {
    return this._project_id;
  }

  // Get user role from localStorage
  getRole() {
    return localStorage.getItem("userRole") || "super_admin";
  }

  // Get auth token from localStorage
  getToken() {
    return localStorage.getItem("authToken") || "";
  }

  // Reset base64 encoding for project authentication
  resetXProject() {
    const raw = this._project_id + ":" + this._secret;
    this._base64Encode = btoa(raw);
  }

  // Get base URL
  baseUrl() {
    return this._baseurl;
  }

  // Get upload URL (local storage)
  uploadUrl() {
    return `${this.baseUrl()}/v1/api/${this.getProjectId()}/${this.getRole()}/lambda/upload`;
  }

  // Get S3 upload URL
  uploadS3Url() {
    return `${this.baseUrl()}/v1/api/${this.getProjectId()}/${this.getRole()}/lambda/s3/upload`;
  }

  // Generate headers for API requests
  getHeader(additionalHeaders = {}, excludeHeaders = []) {
    const baseHeaders = {
      "x-project": this._base64Encode,
      Authorization: `Bearer ${this.getToken()}`,
    };

    // Merge with additional headers
    const headers = { ...baseHeaders, ...additionalHeaders };

    // Remove excluded headers
    excludeHeaders.forEach((header) => {
      delete headers[header];
    });

    return headers;
  }

  // Generate headers specifically for file uploads (FormData)
  getUploadHeaders() {
    console.log("Upload: No auth headers needed - matches other APIs");

    return {
      // No headers needed - matches other API routes that work without auth
    };
  }

  // Handle fetch response
  async handleFetchResponse(result) {
    try {
      const json = await result.json();

      if (!result.ok) {
        throw new Error(json.message || `HTTP error! status: ${result.status}`);
      }

      return json;
    } catch (error) {
      console.error("Fetch response handling error:", error);
      throw error;
    }
  }

  /**
   * Upload file to the server (S3 storage)
   * @param {File} file - The file to upload
   * @returns {Promise<Object>} - Upload response with {id, url}
   */
  async upload(file) {
    try {
      if (!file) {
        throw new Error("No file provided for upload");
      }

      const formData = new FormData();
      formData.append("file", file);

      const uploadUrl = this.uploadS3Url();
      const headers = this.getUploadHeaders();

      console.log("Upload URL:", uploadUrl);
      console.log("Upload headers:", headers);

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: headers,
        body: formData,
      });

      console.log("Upload response status:", result.status);
      return this.handleFetchResponse(result);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  /**
   * Upload file to local storage
   * @param {File} file - The file to upload
   * @returns {Promise<Object>} - Upload response with {id, url}
   */
  async uploadLocal(file) {
    try {
      if (!file) {
        throw new Error("No file provided for upload");
      }

      const formData = new FormData();
      formData.append("file", file);

      const result = await fetch(this.uploadUrl(), {
        method: "POST",
        headers: this.getUploadHeaders(), // Use upload-specific headers with Bearer token
        body: formData,
      });

      return this.handleFetchResponse(result);
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  }

  /**
   * Upload image specifically (alias for upload)
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Upload response with {id, url}
   */
  async uploadImage(file) {
    return this.upload(file);
  }

  /**
   * Upload image for editor use
   * @param {File} file - The image file to upload
   * @returns {Promise<Object>} - Upload response
   */
  async editorUploadImage(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint = `${this.baseUrl()}/v1/api/${this.getProjectId()}/${this.getRole()}/lambda/s3/upload`;
      const result = await fetch(endpoint, {
        method: "POST",
        headers: this.getUploadHeaders(), // Use upload-specific headers with Bearer token
        body: formData,
      });

      return this.handleFetchResponse(result);
    } catch (error) {
      console.error("Editor upload error:", error);
      throw error;
    }
  }

  /**
   * Generic request method for API calls
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} - API response
   */
  async request(config) {
    const {
      endpoint,
      method = "GET",
      body = null,
      params = {},
      additionalHeaders = {},
      excludeHeaders = [],
    } = config;

    // Replace placeholders in endpoint
    let finalEndpoint = endpoint
      .replace("{{project}}", this.getProjectId())
      .replace("{{role}}", this.getRole());

    // Add query parameters if method is GET and params exist
    if (method === "GET" && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      finalEndpoint += `?${queryString}`;
    }

    // Prepare headers
    const headers = this.getHeader(
      {
        "Content-Type": "application/json",
        ...additionalHeaders,
      },
      excludeHeaders
    );

    // Prepare fetch configuration
    const fetchConfig = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const result = await fetch(
        `${this._baseurl}${finalEndpoint}`,
        fetchConfig
      );
      return this.handleFetchResponse(result);
    } catch (error) {
      console.error("API Call Error:", error);
      throw error;
    }
  }

  /**
   * Login method
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role
   * @returns {Promise<Object>} - Login response
   */
  async login(email, password, role) {
    return this.request({
      endpoint: `/v1/api/${this.getProjectId()}/${role}/lambda/login`,
      method: "POST",
      body: { email, password, is_refresh: true },
    });
  }

  /**
   * Get user profile
   * @returns {Promise<Object>} - Profile response
   */
  async getProfile() {
    return this.request({
      endpoint: `/v1/api/{{project}}/{{role}}/lambda/profile`,
      method: "GET",
    });
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.clear();
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default MkdSDK;
