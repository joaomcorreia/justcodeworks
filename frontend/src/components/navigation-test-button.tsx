"use client";

import { useState } from "react";
import { fetchNavigationItems } from "@/lib/api";

export function NavigationTestButton() {
  const [result, setResult] = useState<string>("");

  const testAPI = async () => {
    console.log("Testing navigation API...");
    setResult("Loading...");
    
    try {
      const headerData = await fetchNavigationItems({
        projectId: "69870a64-4913-4d52-9b35-4d1dfa33632a",
        location: "header",
        locale: "en",
      });
      
      console.log("Header data:", headerData);
      setResult(`Success! Loaded ${headerData.length} header items: ${headerData.map(item => item.label).join(", ")}`);
    } catch (error) {
      console.error("API Error:", error);
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f0f0f0", margin: "20px" }}>
      <button 
        onClick={testAPI}
        style={{ 
          padding: "10px 20px", 
          background: "#007acc", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Test Navigation API
      </button>
      <div style={{ marginTop: "10px", fontSize: "14px" }}>
        {result}
      </div>
    </div>
  );
}