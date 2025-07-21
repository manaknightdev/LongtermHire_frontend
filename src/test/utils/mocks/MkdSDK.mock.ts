/**
 * Mock implementation of MkdSDK for testing
 */

export class MockMkdSDK {
  private _baseurl: string;
  private _project_id: string;
  private _secret: string;
  private _table: string;
  private _base64Encode: string;

  constructor() {
    this._baseurl = "https://test-api.example.com";
    this._project_id = "test-project";
    this._secret = "test-secret";
    this._table = "";
    this._base64Encode = btoa(`${this._project_id}:${this._secret}`);
  }

  getProjectId(): string {
    return this._project_id;
  }

  getHeader(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "x-project": this._project_id,
      Authorization: `Bearer ${this._base64Encode}`
    };
  }

  async login(email: string, password: string): Promise<any> {
    // Mock successful login
    if (email === "test@example.com" && password === "password") {
      return {
        error: false,
        message: "Login successful",
        data: {
          user_id: "123",
          token: "mock-token"
        }
      };
    }
    
    // Mock failed login
    return {
      error: true,
      message: "Invalid credentials"
    };
  }

  logout(): void {
    // Mock logout
    console.log("Logged out");
  }
}
