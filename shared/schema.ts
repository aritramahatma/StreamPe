import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't need extensive database schema for this application
// as most data comes from the TMDb API, but we will create 
// a minimal schema for analytics and recently viewed

export const watchHistory = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  mediaType: text("media_type").notNull(), // 'movie' or 'tv'
  mediaId: integer("media_id").notNull(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  watchedAt: timestamp("watched_at").defaultNow().notNull(),
  progress: integer("progress").default(0), // progress in seconds
  clientIp: text("client_ip"),
  userAgent: text("user_agent"),
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({
  id: true,
  watchedAt: true,
});

export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;

// Schema for analytics
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  event: text("event").notNull(), // 'search', 'view', 'play', etc.
  mediaType: text("media_type"), // 'movie' or 'tv'
  mediaId: integer("media_id"),
  query: text("query"), // for search events
  clientIp: text("client_ip"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  referrer: text("referrer"),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  timestamp: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
