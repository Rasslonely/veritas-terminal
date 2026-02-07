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

**Recommendation:** Start with **Voight-Kampff**. It requires no external contracts or APIs, just clever use of the existing Gemini model. It creates the most dramatic demo moment.
