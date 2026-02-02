import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveStorageId = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    // This could also associate with a temp claim or user session
    // For now we just return it, but often we save it to a table
    return args.storageId;
  },
});
