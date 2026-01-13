// Test Zoom Credentials
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const testZoomCredentials = async () => {
  console.log("🔍 Testing Zoom Credentials...\n");
  
  // Show current credentials (masked for security)
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  
  console.log("Current credentials in .env:");
  console.log(`ZOOM_CLIENT_ID: ${clientId ? clientId.substring(0, 6) + "..." : "❌ MISSING"}`);
  console.log(`ZOOM_CLIENT_SECRET: ${clientSecret ? clientSecret.substring(0, 6) + "..." : "❌ MISSING"}\n`);
  
  if (!clientId || !clientSecret) {
    console.log("❌ Missing credentials in .env file!");
    return;
  }
  
  try {
    console.log("📡 Making request to Zoom OAuth endpoint...");
    
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      },
    });
    
    console.log("✅ SUCCESS! Credentials are valid!");
    console.log(`✅ Access token received: ${response.data.access_token.substring(0, 10)}...`);
    console.log(`✅ Token expires in: ${response.data.expires_in} seconds`);
    
  } catch (error) {
    console.log("❌ FAILED! Credentials are invalid!");
    console.log(`❌ Error: ${error.response?.data?.error || error.message}`);
    console.log(`❌ Reason: ${error.response?.data?.reason || "Unknown"}`);
    
    if (error.response?.data?.error === 'invalid_client') {
      console.log("\n🔧 SOLUTION:");
      console.log("1. Go to: https://marketplace.zoom.us/develop/apps");
      console.log("2. Find your 'Server-to-Server OAuth' app");
      console.log("3. Click 'App Credentials' tab");
      console.log("4. Copy the CORRECT Client ID and Client Secret");
      console.log("5. Update your .env file");
      console.log("6. Restart the backend");
    }
  }
};

testZoomCredentials();