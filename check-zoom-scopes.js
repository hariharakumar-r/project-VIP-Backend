// Check Zoom App Scopes
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const checkZoomScopes = async () => {
  console.log("🔍 Checking Zoom App Scopes...\n");
  
  try {
    // Get access token
    console.log("📡 Getting access token...");
    const tokenResponse = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "client_credentials",
        client_id: process.env.ZOOM_CLIENT_ID,
        client_secret: process.env.ZOOM_CLIENT_SECRET,
      },
    });
    
    const accessToken = tokenResponse.data.access_token;
    console.log("✅ Access token obtained successfully");
    console.log(`🔑 Token: ${accessToken.substring(0, 20)}...\n`);
    
    // Test different API endpoints to see which scopes are available
    const tests = [
      {
        name: "Get User Info",
        endpoint: "https://api.zoom.us/v2/users/me",
        method: "GET",
        requiredScope: "user:read:admin"
      },
      {
        name: "List Meetings", 
        endpoint: "https://api.zoom.us/v2/users/me/meetings",
        method: "GET",
        requiredScope: "meeting:read:admin"
      },
      {
        name: "Create Meeting",
        endpoint: "https://api.zoom.us/v2/users/me/meetings",
        method: "POST",
        requiredScope: "meeting:write:admin",
        data: {
          topic: "Test Meeting",
          type: 2,
          start_time: "2026-01-13T10:00:00Z",
          duration: 30
        }
      }
    ];
    
    console.log("🧪 Testing API endpoints to check scopes:\n");
    
    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name} (${test.requiredScope})`);
        
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        };
        
        let response;
        if (test.method === "GET") {
          response = await axios.get(test.endpoint, config);
        } else if (test.method === "POST") {
          response = await axios.post(test.endpoint, test.data, config);
        }
        
        console.log(`✅ ${test.name}: SUCCESS (scope: ${test.requiredScope})`);
        
        // If it's a create meeting test, delete it immediately
        if (test.name === "Create Meeting" && response.data.id) {
          try {
            await axios.delete(`https://api.zoom.us/v2/meetings/${response.data.id}`, config);
            console.log(`🗑️  Test meeting deleted`);
          } catch (deleteErr) {
            console.log(`⚠️  Could not delete test meeting: ${deleteErr.response?.data?.message || deleteErr.message}`);
          }
        }
        
      } catch (error) {
        const errorCode = error.response?.data?.code;
        const errorMessage = error.response?.data?.message;
        
        if (errorCode === 124) {
          console.log(`❌ ${test.name}: FAILED - Invalid access token (missing scope: ${test.requiredScope})`);
        } else if (errorCode === 200) {
          console.log(`❌ ${test.name}: FAILED - Insufficient permissions (missing scope: ${test.requiredScope})`);
        } else {
          console.log(`❌ ${test.name}: FAILED - ${errorMessage || error.message} (scope: ${test.requiredScope})`);
        }
      }
      
      console.log(""); // Empty line for readability
    }
    
    console.log("📋 REQUIRED SCOPES FOR YOUR APP:");
    console.log("1. user:read:admin - Read user information");
    console.log("2. meeting:read:admin - Read meeting information");  
    console.log("3. meeting:write:admin - Create and update meetings");
    console.log("4. meeting:delete:admin - Delete meetings");
    
    console.log("\n🔧 TO ADD SCOPES:");
    console.log("1. Go to: https://marketplace.zoom.us/develop/apps");
    console.log("2. Find your Server-to-Server OAuth app");
    console.log("3. Click 'Scopes' tab");
    console.log("4. Click 'Add Scopes'");
    console.log("5. Add the 4 scopes listed above");
    console.log("6. Click 'Save'");
    console.log("7. Restart your backend");
    
  } catch (error) {
    console.log("❌ Failed to get access token:");
    console.log(`Error: ${error.response?.data?.error || error.message}`);
    console.log(`Reason: ${error.response?.data?.reason || "Unknown"}`);
  }
};

checkZoomScopes();