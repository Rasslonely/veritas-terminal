# 🏛️ VERITAS TERMINAL: The Autonomous RWA Adjudicator
> **"Trust Physics, Not People."**

---

## 1. Project Manifesto & Vision

**The Problem:**
Di tahun 2026, ekonomi **Real World Assets (RWA)** terhambat oleh verifikasi manusia yang lambat. Klaim asuransi butuh 2 minggu. Sengketa rantai pasokan butuh arbitrase manual. Di era AI, *menunggu* adalah bug.

**The Solution:**
**VERITAS TERMINAL** adalah "Hakim AI Otonom" terdesentralisasi. Ia menggunakan **Computer Vision (Gemini 3)** untuk "melihat" kebenaran fisik, **Multi-Agent Debate** untuk memastikan keadilan, dan **Blockchain (Hedera/Base)** untuk eksekusi pembayaran instan.

**The "God Tier" Hook:**
Kami tidak hanya membangun aplikasi klaim. Kami membangun **Infrastruktur Kebenaran Fisik (Physical Truth Infrastructure)** untuk Web3.

---

## 2. Hackathon Strategy: The "Double-Dip"
Satu Codebase, Dua Narasi Pemenang.

### 🎯 Target A: Hedera Hello Future Apex 2026
* **Track:** AI & Agents (Primary) + DeFi & Tokenization.
* **Winning Narrative:** "Kami menggunakan **Hedera Consensus Service (HCS)** untuk menciptakan *Immutable Thought Log*. Setiap keputusan AI dicatat di Hedera, menjadikannya satu-satunya AI yang 100% audit-proof dan transparan."
* **Tech Highlight:** HCS untuk logging debat agen, HTS untuk tokenisasi asuransi/payout.

### 🎯 Target B: ETHDenver 2026
* **Track:** Futurllama (Wild Ideas) / New France Village (RWA).
* **Winning Narrative:** "Jembatan antara Realitas Fisik dan Settlement On-Chain. Veritas adalah Oracle visual yang memicu Smart Contract di **Base** berdasarkan bukti dunia nyata."
* **Tech Highlight:** Integrasi Base (L2) untuk settlement USDC instan.

---

## 3. The "God Tier" Features

### A. The Adversarial "A.I. Jury" (Trust Engine)
Alih-alih satu AI yang bisa bias, kami menggunakan sistem **Debat Multi-Agen**:
* **Agent A (The Lawyer):** Membela User. *"Saya melihat retakan valid pada layar, pencahayaan konsisten."*
* **Agent B (The Auditor):** Mencari celah penipuan. *"Tunggu, metadata foto mencurigakan. Cek ulang kedalaman visual."*
* **The Verdict:** Konsensus dicatat di Blockchain. User bisa melihat log debat ini secara real-time (seperti film Sci-Fi).

### B. "Flash" Micro-Insurance (Utility Engine)
Asuransi proaktif on-the-spot.
* **Skenario:** User scan laptop di kafe.
* **Veritas:** "Risiko pencurian sedang. Mau asuransi 2 jam seharga $0.50?"
* **Teknis:** Minting NFT dinamis (HTS) yang valid selama 2 jam. Jika tidak ada klaim, dana masuk Liquidity Pool.

### C. The "Salvage DAO" (Sustainability Engine)
Mengubah klaim menjadi ekonomi sirkular.
* **Skenario:** Klaim HP rusak disetujui ("Total Loss").
* **Action:** Veritas otomatis me-listing bangkai HP ke marketplace daur ulang. User dapat bonus token jika mengirim sampah elektronik tersebut.

---

## 4. Technical Architecture: The "Next.js Monolith"

Kami menggunakan pendekatan **Speed-First**. Tanpa Golang, tanpa Mobile Native yang ribet.

### 🛠️ The Winning Stack
* **Frontend (PWA):** Next.js 14 (App Router) + Tailwind CSS + Shadcn/UI.
* **AI Core:** Vercel AI SDK + Google Gemini Pro Vision (via Google GenAI SDK).
* **Database:** Supabase (PostgreSQL) - untuk menyimpan debat agen sebelum di-hash ke chain.
* **Blockchain Adapter:**
    * **Hedera:** `@hashgraph/sdk` (JS).
    * **EVM (Base):** `viem` & `wagmi`.

### 🏗️ The "Polymorphic Backend" Pattern
Satu server, dua mode operasi yang diatur via `.env`.

```typescript
// src/lib/blockchain/adapter.ts (Pseudo-code)

interface IBlockchainAdapter {
  logEvidence(evidence: string): Promise<string>; // Returns Transaction Hash
  payoutClaim(amount: number, recipient: string): Promise<boolean>;
}

export function getAdapter(): IBlockchainAdapter {
  if (process.env.NEXT_PUBLIC_CHAIN_MODE === "HEDERA") {
    return new HederaAdapter(); // Uses HCS & HTS
  } else {
    return new BaseAdapter();   // Uses Smart Contracts on Base
  }
}
📱 PWA Strategy (The Native Illusion)
Agar terasa seperti Native App di mata Juri:

Viewport Lock: Mencegah zoom/geser di browser mobile.

Bottom Navigation: UI navigasi di bawah layar.

Camera Overlay: Menggunakan react-webcam full-screen saat mode scan.

5. Implementation Roadmap (2 Weeks Sprint)
Phase 1: The Core (Days 1-5)
[ ] Init Next.js + Shadcn UI.

[ ] Setup Supabase & Vercel AI SDK.

[ ] Implementasi Gemini Vision: Fitur scan foto & analisis kerusakan sederhana.

[ ] Implementasi The Debate: Logic Agent A vs Agent B (Teks only di console/UI).

Phase 2: The Denver Branch (Days 6-10)
[ ] Setup wagmi & RainbowKit.

[ ] Deploy Smart Contract simpel di Base Sepolia (VeritasVault.sol).

[ ] Sambungkan tombol "Payout" ke Contract Base.

[ ] SUBMIT ke ETHDenver.

Phase 3: The Hedera Branch (Days 11-14)
[ ] Setup @hashgraph/sdk.

[ ] Buat Topic di Hedera Consensus Service (HCS).

[ ] Ubah fungsi log AI agar kirim pesan ke HCS.

[ ] (Opsional) Implementasi HTS untuk "Flash Insurance".

[ ] SUBMIT ke Hedera Apex.

6. The "Gold Medal" Demo Script (3 Menit)
0:00 - The Hook (Pegang HP, tunjukkan layar ke kamera/projektor) "Asuransi itu lambat karena mereka tidak percaya pada Anda. Veritas percaya pada Fisika. Ini adalah Hakim AI Otonom pertama di dunia."

0:30 - The Interaction (Live Demo) (Buka Veritas PWA, arahkan ke objek rusak - misal: kacamata patah) "Saya baru saja mematahkan kacamata ini. Saya tidak mengisi formulir. Saya hanya membiarkan Veritas melihatnya." (Veritas Voice: "Object identified. Lens cracked. Analyzing fraud risk...")

1:15 - The Debate (The "Wow" Factor) (Tunjukkan layar HP, teks bergulir cepat) "Lihat ini. Ini bukan sekadar chatbot. Ada dua agen AI yang berdebat. Satu membela saya, satu mencari metadata palsu. Transparansi total."

2:00 - The Trust (Blockchain Layer) "Dan inilah bagian terpenting. Setiap argumen mereka sedang di-hashing dan dikirim ke Hedera Consensus Service (atau Base) saat ini juga. Tidak ada 'Black Box'. Semuanya audit-proof."

2:45 - The Money Shot (Notifikasi muncul di layar: CLAIM APPROVED. $50 SENT) "Dalam 30 detik, kasus selesai. Uang masuk wallet. Veritas mengubah birokrasi menjadi kode."

7. Directory Structure (Blueprint)
Plaintext
/veritas-terminal
├── /src
│   ├── /app
│   │   ├── /api
│   │   │   ├── /analyze      # Gemini Vision Logic
│   │   │   └── /payout       # Blockchain Trigger
│   │   ├── /dashboard        # Main User Interface
│   │   └── layout.tsx        # Viewport locking here
│   ├── /components
│   │   ├── /ui               # Shadcn components
│   │   ├── /native           # CameraOverlay, BottomNav
│   │   └── /visuals          # MatrixLog, AgentAvatar
│   ├── /lib
│   │   ├── /adapters         # HederaAdapter.ts, BaseAdapter.ts
│   │   ├── /ai               # Prompts & Model configs
│   │   └── utils.ts
│   └── /actions              # Server Actions (Backend Logic)
├── .env                      # CHAIN_MODE="HEDERA" or "BASE"
├── next.config.mjs           # PWA config
└── package.json