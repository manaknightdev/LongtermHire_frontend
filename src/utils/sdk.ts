/**
 * SDK Instance Configuration
 * Centralized SDK instance for the entire application
 */

import MkdSDK from "./MkdSDK";

// Create a singleton SDK instance
const sdk = new MkdSDK({
  baseurl: "http://localhost:5172",
  project_id: "longtermhire",
  secret: "key_1752663783199_yb4x4bg7j", // Using the globalKey from config
});

export default sdk;
