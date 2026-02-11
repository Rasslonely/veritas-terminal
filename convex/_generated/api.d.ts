/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_analyzeVoice from "../actions/analyzeVoice.js";
import type * as actions_debate from "../actions/debate.js";
import type * as actions_debateInternal from "../actions/debateInternal.js";
import type * as actions_gemini from "../actions/gemini.js";
import type * as actions_rag from "../actions/rag.js";
import type * as agent_identity from "../agent/identity.js";
import type * as agent_orchestrator from "../agent/orchestrator.js";
import type * as agent_policy_compiler from "../agent/policy_compiler.js";
import type * as blockchain_BaseAdapter from "../blockchain/BaseAdapter.js";
import type * as blockchain_HederaAdapter from "../blockchain/HederaAdapter.js";
import type * as blockchain_adapter from "../blockchain/adapter.js";
import type * as claims from "../claims.js";
import type * as debateInternal from "../debateInternal.js";
import type * as debug_gemini from "../debug_gemini.js";
import type * as feed from "../feed.js";
import type * as files from "../files.js";
import type * as policies from "../policies.js";
import type * as policyInternal from "../policyInternal.js";
import type * as rag from "../rag.js";
import type * as seed from "../seed.js";
import type * as seed_rag from "../seed_rag.js";
import type * as underwriters from "../underwriters.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/analyzeVoice": typeof actions_analyzeVoice;
  "actions/debate": typeof actions_debate;
  "actions/debateInternal": typeof actions_debateInternal;
  "actions/gemini": typeof actions_gemini;
  "actions/rag": typeof actions_rag;
  "agent/identity": typeof agent_identity;
  "agent/orchestrator": typeof agent_orchestrator;
  "agent/policy_compiler": typeof agent_policy_compiler;
  "blockchain/BaseAdapter": typeof blockchain_BaseAdapter;
  "blockchain/HederaAdapter": typeof blockchain_HederaAdapter;
  "blockchain/adapter": typeof blockchain_adapter;
  claims: typeof claims;
  debateInternal: typeof debateInternal;
  debug_gemini: typeof debug_gemini;
  feed: typeof feed;
  files: typeof files;
  policies: typeof policies;
  policyInternal: typeof policyInternal;
  rag: typeof rag;
  seed: typeof seed;
  seed_rag: typeof seed_rag;
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
