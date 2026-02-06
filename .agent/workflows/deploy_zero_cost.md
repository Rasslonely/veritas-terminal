---
description: Deploy Veritas Terminal to Vercel & Convex (Zero Cost)
---
# 🚀 Zero-Cost Deployment Guide

Follow these steps to deploy **Veritas Terminal** to the cloud for free.

## 1. Backend Deployment (Convex)
Deploy your backend functions and database.

1. Run the deploy command:
   ```bash
   npx convex deploy
   ```
   *This pushes your schema and functions to the production Convex environment.*

2. **Vital Step**: Set your Environment Variables in Dashboard.
   *   Go to your Convex Dashboard URL (printed in terminal).
   *   Navigate to **Settings** -> **Environment Variables**.
   *   Add `GEMINI_API_KEY` (Copy from your local `.env.local`).

3. Seed the Production RAG (The "Brain"):
   ```bash
   npx convex run seed_rag:seed --prod
   ```
   *Note: Using `--prod` runs the function on the live database.*

## 2. Frontend Deployment (Vercel)
Deploy your Next.js application.

1. **Push to GitHub**:
   Ensure your code is pushed to a GitHub repository.

2. **Import to Vercel**:
   *   Go to [Vercel Dashboard](https://vercel.com/new).
   *   Import your `veritas-terminal` repository.

3. **Configure Environment Variables (Vercel)**:
   Add the following variables in the "Environment Variables" section during import:
   
   | Variable | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_CONVEX_URL` | Check your `.env.local` or run `npx convex dashboard` to find the **Production** URL. |
   | `NEXT_PUBLIC_GEMINI_API_KEY` | (Optional) If you use Client-side AI (we use Server Actions, so likely not needed on client, but safe to add). |

4. **Deploy**:
   *   Click **Deploy**.
   *   Wait for the build to finish.

## 3. Verify
*   Open the Vercel Deployment URL on your phone.
*   **Add to Home Screen** (PWA).
*   Test a Scan!
