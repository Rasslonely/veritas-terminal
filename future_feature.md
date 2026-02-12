# 🚀 VERITAS TERMINAL: Future "God-Tier" Features
> **"Reality is that which, when you stop believing in it, doesn't go away."** - Philip K. Dick

---

## 1. 🕵️ The Voight-Kampff Protocol (Voice Interrogation)
**Mission:** Turn passive image analysis into active interrogation. Detect deception through voice stress and narrative inconsistency.

### 🧠 The Methodology
1.  **Visual Contradiction:** User claims "Accidental drop", but AI sees "Hammer impact pattern".
2.  **The Challenge:** Instead of rejecting immediately, AI asks: *"Please explain in 10 seconds exactly how this happened."*
3.  **Voice Analysis:**
    *   **Transcript:** Converted to text via Gemini/Whisper.
    *   **Semantic Check:** Does the story match the visual evidence?
    *   **Prosody Analysis (Advanced):** Detect hesitation, stuttering, or cognitive load (optional).

### 🛠️ Technical Stack
*   **Frontend:** `MediaRecorder API` (Browser native) for audio capture.
*   **Visualization:** `<canvas>` frequency analyzer (Siri-style waveform).
*   **Backend:** Convex Action `analyzeVoiceEvidence`.
*   **AI Model:** `Gemini 1.5 Flash` (Multimodal: Audio + Image).

### 💻 Implementation Plan

**Step 1: Capture Audio (Frontend Hook)**
```typescript
// src/hooks/useVoiceRecorder.ts
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    // ... standard recorder logic ...
  };
  
  return { startRecording, stopRecording, audioBlob };
}
```

**Step 2: Convex Action (The Brain)**
```typescript
// convex/ai.ts
export const verifyTestimony = action({
  args: { 
    claimId: v.id("claims"),
    audioBase64: v.string(), // User's voice explanation
    evidenceImageId: v.id("_storage"), // Original image
  },
  handler: async (ctx, args) => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a forensic investigator.
    1. Listen to this user's explanation of the accident.
    2. Look at the damage in the image.
    
    Determine:
    - Does the story match the physics of the damage?
    - Are there signs of hesitation or fabrication?
    
    Return:
    - consistencyScore (0-100)
    - analysis: "User claims drop, but impact is from sharp object."`;
    
    // ... generateContent([audio, image, prompt]) ...
  }
});
```

**Step 3: UI Integration (The Drama)**
*   Add a new "Interrogation Mode" to the `ScanPage`.
*   When `confidenceScore` is borderline (40-60%), trigger the **"Speak to Veritas"** modal.

---

## 2. 🌩️ The Oracle of Elements (Parametric Truth)
**Mission:** Prove reality using indisputable external data sources (Weather, Satellite, Seismographs).

### 🧠 The Methodology
1.  **Claim Context:** "Roof damaged by storm" at [GPS: 40.7, -74.0] on [Date: 2026-02-10].
2.  **Oracle Check:** Query OpenWeatherMap / NASA Power API.
3.  **Verification:**
    *   *Oracle:* "Wind speed was 2mph. Sunny."
    *   *Verdict:* **IMPOSSIBLE.** Reject claim automatically.

### 🛠️ Technical Stack
*   **API:** OpenWeatherMap (Free Tier: 1,000 calls/day).
*   **Backend:** Convex Action `fetchWeatherOracle`.

### 💻 Implementation Plan

**Step 1: The Oracle Function**
```typescript
// convex/oracles/weather.ts
export const verifyWeather = action({
  args: { lat: v.number(), lng: v.number(), timestamp: v.number() },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = \`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=\${args.lat}&lon=\${args.lng}&dt=\${args.timestamp}&appid=\${apiKey}\`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      windSpeed: data.data[0].wind_speed,
      weather: data.data[0].weather[0].main, // "Rain", "Clear"
      isSevere: data.data[0].wind_speed > 20 || data.data[0].weather[0].main === "Storm"
    };
  }
});
```

**Step 2: Integration**
*   In `runAgentDebate`, Agent B (The Auditor) calls `verifyWeather`.
*   *Agent B:* "I have queried the Oracle. Wind speeds were negligible. The user's 'Storm Damage' claim is physically impossible."

---

## 3. 💸 Truth Markets (Gamified Prediction)
**Mission:** Convert "Claims Processing" into a "Speculative Market". Crowdsource fraud detection by letting users bet on the outcome.

### 🧠 The Methodology
1.  **The Market:** Every new claim opens a "Prediction Market".
2.  **The Bet:** Users stake USDC on **[APPROVE]** or **[REJECT]**.
3.  **The Payout:**
    *   If Verdict = APPROVED, the [APPROVE] stakers win the [REJECT] pool.
    *   Veritas Protocol takes a 5% fee.
4.  **Incentive:** Users are financially incentivized to find fraud (shorting the claim).

### 🛠️ Technical Stack
*   **Blockchain:** Base Sepolia (Smart Contract).
*   **Contract:** `PredictionMarket.sol`.
*   **UI:** "Betting Bar" under the Debate Stream.

### 💻 Implementation Plan

**Step 1: Smart Contract (Solidity)**
```solidity
// contracts/PredictionMarket.sol
contract ClaimMarket {
    struct Market {
        uint256 totalApprove;
        uint256 totalReject;
        bool resolved;
        bool outcome; // true = approved, false = rejected
    }
    mapping(uint256 => Market) public markets;

    function bet(uint256 claimId, bool support) external payable {
        if (support) markets[claimId].totalApprove += msg.value;
        else markets[claimId].totalReject += msg.value;
    }

    function resolve(uint256 claimId, bool approved) external onlyJudge {
        markets[claimId].resolved = true;
        markets[claimId].outcome = approved;
        // ... payout logic ...
    }
}
```

**Step 2: Frontend "Wager" Component**
*   Add a "Place Your Bet" card in the `DebateThread`.
*   Show live odds: *"70% believe this is Fraud. Pot size: $500 USDC."*

---

## 🏆 Summary: The "Winning" Combination

| Feature | Complexity | Cost | "Wow" Factor |
| :--- | :---: | :---: | :---: |
| **Voight-Kampff** | Medium | **$0** | ⭐⭐⭐⭐⭐ (Blade Runner Vibes) |
| **Oracle of Elements** | Low | **$0** | ⭐⭐⭐⭐ (Undeniable Truth) |
| **Truth Markets** | High | **$0** | ⭐⭐⭐⭐⭐ (Degens Love It) |


---

# ✅ 4. IMPLEMENTED: The "God-Tier" Upgrades (Ready for Demo)
These features have been successfully integrated into the Veritas Core (`convex/actions/gemini.ts`) and are live.

## 4.1. 🛡️ Flash Policy NFTs (RWA Tokenization)
**Mission:** Transform insurance policies from database rows into tradeable, burnable Real World Assets (RWAs) on Hedera.
*   **Mechanism:**
    1.  **Mint:** When a policy is purchased (or simulated), a **unique HTS Token (NFT)** is minted to the user's wallet.
    2.  **Metadata:** Contains asset details (e.g., "MacBook Pro M3", Coverage: $2000).
    3.  **Burn:** Upon successful claim payout, the NFT is **burned** on-chain to prevent double-dipping.
*   **Status:** **LIVE** (Mints on Scan, Burns on Payout).

## 4.2. ⚖️ The Truth Bond (DeFi Staking)
**Mission:** "Skin in the Game." Eliminate spam by requiring financial commitment.
*   **Mechanism:**
    1.  **Stake:** To file a claim, a user must stake **5 USDC/HBAR**.
    2.  **Lock:** Funds are held in escrow (simulated via `adapter.stake`).
    3.  **Slash:** If AI detects fraud (e.g., "Recycled Photo"), the stake is **slashed** (sent to Treasury).
    4.  **Return:** If approved, stake is returned + payout.
*   **Status:** **LIVE** (Integrated into `ScanPage` claim flow).

## 4.3. 📦 HCS Black Box (Immutable Audit)
**Mission:** "Trust Physics, Not Servers."
*   **Mechanism:**
    1.  **Log:** Every AI Analysis, Voice Testimony, and Verdict is logged to **Hedera Consensus Service (HCS)**.
    2.  **Hash:** The data is hashed, ensuring the historical record cannot be altered by Veritas admins.
    3.  **Verify:** Users can verify the "Proof of Logic" on any Hedera explorer.
*   **Status:** **LIVE** (Logs every `analyzeEvidence` call).

## 4.4. 🕵️ Voight-Kampff Protocol (Liveness & Voice)
**Mission:** Anti-spoofing and intent verification.
*   **Mechanism:**
    1.  **Liveness Challenge:** "Place coin next to item" (Randomized instructions).
    2.  **Voice Analysis:** Analyzing discrepancies between "What happened" and "What is shown."
*   **Status:** **LIVE** (Integrated into `ScanPage`).

## 4.5. 🕸️ The Evidence Graph (Fractal Logic)
**Mission:** Non-linear investigation via autonomous sub-agents.
*   **Mechanism:**
    1.  **Branching:** Master Orchestrator spawns specialized agents (Physical, Metadata, Legal) for focused "deep-dive" investigative rounds.
    2.  **Consensus:** Gemini 3 synthesizes conflicting arguments from the graph into a supreme verdict.
*   **Status:** **LIVE** (Integrated into `Command Deck` and `orchestrator.ts`).

## 4.6. 🛠️ The Policy Forge (Neuroblox Logic)
**Mission:** No-code visual architecture for generative AI insurance policies.
*   **Mechanism:**
    1.  **Logic Bricks:** Underwriters use a visual editor to drag-and-drop agent behaviors and payout rules.
    2.  **Compiler:** Translates visual logic into high-fidelity AI system prompts and Solidity-ready configurations.
*   **Status:** **LIVE** (Integrated into `/admin/forge`).

## 4.7. 🎭 Adaptive UI Architecture (Dual-Persona)
**Mission:** Optimized operational experiences for different clearance levels.
*   **Mechanism:**
    1.  **Commander Persona (Desktop):** High-fidelity Command Deck with fixed Sidebar navigation, broad analytical views, and deep investigative graphs.
    2.  **Field Agent Persona (Mobile):** Tactile, one-handed BottomNav navigation, linear status feeds, and focused "Street-Level" interfaces.
*   **Status:** **LIVE** (Implemented via `DashboardLayout` and `Sidebar.tsx`).

## 4.8. 📊 Personnel Dashboard (Neural Analytics)
**Mission:** Data-driven identity and reputation management.
*   **Mechanism:**
    1.  **Identity Dossier:** Persistent desktop sidebar showing clearance, node ID, and agent license.
    2.  **Trust Visualization:** High-fidelity cards for Investigation Speed, Consensus Accuracy, and Truth Bond Integrity.
*   **Status:** **LIVE** (Integrated into `/profile`).

## 4.9. 🌊 Neural Streaming (Performance UX)
**Mission:** Handling massive archival data with cinematic efficiency.
*   **Mechanism:**
    1.  **Holographic Skeletons:** Glass-shimmer ghost UI to maintain layout integrity during data retrieval.
    2.  **Staggered Entry:** Staggered `framer-motion` animations for sequential data "Nexus Syncing."
*   **Status:** **LIVE** (Implemented in `ClaimsList.tsx`, `ClaimsSkeleton.tsx`, and `HallOfJustice.tsx`).

## 4.10. 🏛️ Hall of Justice: Tactical Overhaul (World Class UI)
**Mission:** Elevate the public verification feed to an authoritative, "Blade Runner" style investigative magazine.
*   **Mechanism:**
    1.  **Tactical Ornaments:** SVG corner brackets and unique `NXS` Nexus IDs for every archive node.
    2.  **Cinematic Overlays:** Animated horizontal scanlines and glass-frosted "Tactical" card intensity.
    3.  **Neural Consensus Meters:** High-fidelity animated meters showing "Neural Confidence" and "Peer Consensus" levels.
*   **Status:** **LIVE** (Implemented in `HallOfJustice.tsx`).

## 4.11. 🌌 Global Aura Consistency (Atmospheric UX)
**Mission:** Unified visual signature across all operational theaters.
*   **Mechanism:**
    1.  **Neon Signature:** Intensified "Neon Emerald" radial gradients in the global layout for a state-of-the-art cinematic feel.
    2.  **Neural Blobs:** Slow-moving, amorphous colorful blobs that provide depth and parallax to the background.
    3.  **Theme Tints:** Dynamic auras that adapt to page context (Emerald/Blue for the Nexus).
*   **Status:** **LIVE** (Implemented in `DashboardLayout.tsx` and `HallOfJustice.tsx`).

## 4.12. 🏛️ The Great De-Coupling (Nexus vs Ledger vs Dossier)
**Mission:** Resolve UI redundancy by assigning unique semantic identities and layouts to data views.
*   **Mechanism:**
    1.  **Archives as Ledger**: High-density table view with monospaced data, Nexus IDs, and HCS hashes for forensic audit.
    2.  **Profile as Dossier**: Personal operational record filtered to user-specific data with tactile performance cards.
    3.  **Variant-based Rendering**: Single component (`ClaimsList`) supporting multiple structural modes.
*   **Status:** **LIVE** (Implemented in `ClaimsList.tsx`, `claims/page.tsx`, and `profile/page.tsx`).

---

# 🦾 5. AI AGENT KNOWLEDGE BASE: Google AI Studio

To ensure maximum logical consistency and prevent agent hallucinations, use the following model parameters for Veritas Terminal operations based on latest available API tiers:

### 🧠 Primary Processing Units (The Nexus Core)
- **Gemini 3 Flash**: The "New Standard Master Orchestrator". Supreme speed with high-context reasoning. Best for real-time claim adjudication and complex evidence graph synthesis.
- **Gemini 2.5 Flash / Flash Lite**: Optimized for high-frequency low-latency investigative tasks. Ideal for liveness checks and rapid visual forensics.
- **Gemini 2.5 Flash TTS / Native Audio**: Dedicated units for the **Voight-Kampff Protocol** (Voice Interrogation & Audio Dialogue).

### ⚡ Technical Reasoning & Specialized Units
- **Gemma 3 (27B, 12B, 4B, 1B)**: Open-weights models for specialized sub-agent tasks, such as legal cross-referencing or isolated metadata parsing.
- **Gemini Embedding 1**: Used for high-dimensional evidence matching (Similarity checks across historical fraud databases).
- **Gemini Robotics ER 1.5 Preview**: Experimental support for physical damage analysis and spatial reasoning.

### 🛰️ Operational Parameters
- **Context Window**: Leverage up to 1M tokens for deep-dive historical audits and massive claim archives.
- **Temperature**: 
    - **0.0 - 0.2**: For Adjudication, Policy Compilation, and Consensus.
    - **0.7 - 1.0**: For Interrogation and Creative Probing during fraud detection.
- **Safety Filters**: Set to `BLOCK_NONE` to allow unrestricted forensic analysis of "Raw Reality" (Visual and verbal evidence).

