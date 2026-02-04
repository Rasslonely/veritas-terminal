/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_debate from "../actions/debate.js";
import type * as actions_debateInternal from "../actions/debateInternal.js";
import type * as actions_gemini from "../actions/gemini.js";
import type * as blockchain_BaseAdapter from "../blockchain/BaseAdapter.js";
import type * as blockchain_HederaAdapter from "../blockchain/HederaAdapter.js";
import type * as blockchain_adapter from "../blockchain/adapter.js";
import type * as claims from "../claims.js";
import type * as debateInternal from "../debateInternal.js";
import type * as feed from "../feed.js";
import type * as files from "../files.js";
import type * as underwriters from "../underwriters.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/debate": typeof actions_debate;
  "actions/debateInternal": typeof actions_debateInternal;
  "actions/gemini": typeof actions_gemini;
  "blockchain/BaseAdapter": typeof blockchain_BaseAdapter;
  "blockchain/HederaAdapter": typeof blockchain_HederaAdapter;
  "blockchain/adapter": typeof blockchain_adapter;
  claims: typeof claims;
  debateInternal: typeof debateInternal;
  feed: typeof feed;
  files: typeof files;
  underwriters: typeof underwriters;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
