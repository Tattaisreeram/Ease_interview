"use client";

import { useState } from "react";

export default function TestVAPIEndpoint() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const checkVapiEndpoint = async () => {
    try {
      const response = await fetch("/api/vapi/generate", {
        method: "GET",
      });
      const data = await response.json();
      console.log("GET endpoint response:", data);
      setDebugInfo(data);
    } catch (error) {
      console.error("GET endpoint error:", error);
      setDebugInfo({ error: "GET endpoint failed" });
    }
  };

  const testApiRequest = async () => {
    setLoading(true);
    try {
      console.log("Testing API request with exact field names from screenshot");

      const testData = {
        role: "Frontend Developer",
        type: "Technical",
        level: "Mid",
        amount: "5",
        techstack: "React,TypeScript,Next.js",
        userid: "test-user-123",
      };

      console.log("Sending API request data:", testData);

      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("API Request Response status:", response.status);
      const data = await response.json();
      console.log("API Request Response data:", data);

      setResult(data);
    } catch (error) {
      console.error("API Request Test error:", error);
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testEndpoint = async () => {
    setLoading(true);
    try {
      const testData = {
        type: "Technical",
        role: "Frontend Developer",
        level: "Mid",
        techstack: "React,TypeScript,Next.js",
        amount: "5",
        userid: "test-user-123",
      };

      console.log("Sending test data:", testData);

      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setResult(data);
    } catch (error) {
      console.error("Test error:", error);
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const testEmptyRequest = async () => {
    setLoading(true);
    try {
      console.log("Sending empty request to simulate VAPI issue");

      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setResult(data);
    } catch (error) {
      console.error("Test error:", error);
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test VAPI Generate Endpoint</h1>

      <div className="space-y-4">
        <button
          onClick={checkVapiEndpoint}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Check VAPI Endpoint (GET)
        </button>

        <button
          onClick={testApiRequest}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test API Request (Screenshot Format)"}
        </button>

        <button
          onClick={testEndpoint}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test with Valid Data"}
        </button>

        <button
          onClick={testEmptyRequest}
          disabled={loading}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading
            ? "Testing..."
            : "Test with Empty Data (Simulate VAPI Issue)"}
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {debugInfo && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">GET Endpoint Info:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">
          Debug Instructions:
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
          <li>Open browser DevTools (F12)</li>
          <li>Go to Console tab</li>
          <li>Click "Check VAPI Endpoint" to verify the endpoint is working</li>
          <li>
            Click "Test API Request (Screenshot Format)" - this matches your
            screenshot
          </li>
          <li>Click "Test with Valid Data" to see successful API call</li>
          <li>Click "Test with Empty Data" to simulate your VAPI issue</li>
          <li>Check console logs for detailed debugging info</li>
          <li>Check Network tab to see exact request/response</li>
        </ol>

        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800 mb-1">
            Your Current Issue:
          </h4>
          <p className="text-sm text-red-700">
            The conversation messages are empty (Messages for extraction: []).
            This means VAPI is not capturing the conversation properly, so your
            extraction function falls back to default values.
          </p>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">
            What VAPI Should Send:
          </h4>
          <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-auto">
            {`{
  "role": "Frontend Developer",
  "type": "Technical", 
  "level": "Mid",
  "amount": "5",
  "techstack": "React,TypeScript,Next.js",
  "userid": "user-id-here"
}`}
          </pre>
          <p className="text-sm text-blue-700 mt-2">
            VAPI needs to extract these variables from the conversation and send
            them to your endpoint.
          </p>
        </div>
      </div>
    </div>
  );
}
