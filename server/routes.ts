import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// API Keys
const TMDB_API_KEY = process.env.TMDB_API_KEY || "7f325eb836c6c510bab73c65fa33d484";
const STREAMPE_API_KEY = process.env.STREAMPE_API_KEY || "4789fec446eaf7997af0";

// Base URLs
const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export async function registerRoutes(app: Express): Promise<Server> {
  // TMDb API proxy endpoints
  app.use('/api/tmdb/*', async (req, res) => {
    try {
      const path = req.path.replace('/api/tmdb/', '');
      const queryParams = new URLSearchParams(req.query as Record<string, string>);
      
      // Add API key to query parameters
      queryParams.append('api_key', TMDB_API_KEY);
      
      const url = `${TMDB_API_BASE_URL}/${path}?${queryParams.toString()}`;
      console.log("TMDb API request:", url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        console.error("TMDb API error:", data);
        return res.status(response.status).json(data);
      }
      
      return res.json(data);
    } catch (error) {
      console.error("Error proxying TMDb API request:", error);
      return res.status(500).json({ message: "Failed to fetch data from TMDb API" });
    }
  });
  
  // StreamPe API endpoints
  app.post('/api/streampe/analytics', async (req, res) => {
    try {
      const analyticsData = req.body;
      
      // Add client information
      analyticsData.clientIp = req.ip;
      analyticsData.userAgent = req.headers['user-agent'];
      analyticsData.referrer = req.headers.referer;
      
      // Store analytics data
      // Use in-memory storage for this demo
      // In a real app, we would use a database
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing analytics:", error);
      return res.status(500).json({ message: "Failed to process analytics data" });
    }
  });
  
  // Recommendations endpoint
  app.get('/api/streampe/recommendations', async (req, res) => {
    try {
      const { mediaType, id } = req.query;
      
      if (!mediaType || !id) {
        return res.status(400).json({ message: "mediaType and id are required" });
      }
      
      // For this implementation, we'll just proxy to TMDb recommendations
      const url = `${TMDB_API_BASE_URL}/${mediaType}/${id}/recommendations?api_key=${TMDB_API_KEY}`;
      console.log("Recommendations API request:", url);
      
      const response = await fetch(url);
      const data = await response.json() as { results: any[] };
      
      if (!response.ok) {
        return res.status(response.status).json(data);
      }
      
      return res.json(data.results.slice(0, 10)); // Return top 10 recommendations
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });
  
  // Watch history endpoints
  app.post('/api/watch-history', async (req, res) => {
    try {
      const watchData = req.body;
      
      // Add client information
      watchData.clientIp = req.ip;
      watchData.userAgent = req.headers['user-agent'];
      
      // Store watch history
      // In a real app with a database, we would use storage.insertWatchHistory
      
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error saving watch history:", error);
      return res.status(500).json({ message: "Failed to save watch history" });
    }
  });
  
  app.get('/api/watch-history', async (req, res) => {
    try {
      // In a real app, we would fetch from database
      // For now, return empty array
      return res.json([]);
    } catch (error) {
      console.error("Error fetching watch history:", error);
      return res.status(500).json({ message: "Failed to fetch watch history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
