import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const seed = action({
  args: {},
  handler: async (ctx) => {
    const POLICY_TEXT = `
VERITAS GADGET PROTECTION POLICY v1.0

1. COVERAGE SCOPE
This policy covers Accidental Damage Handling (ADH) for registered electronic devices.
Covered incidents include:
- Cracked Screens resulting from drops up to 1.5 meters.
- Liquid Damage (if device rating is IP68).
- Mechanical Failure after manufacturer warranty expires.

2. EXCLUSIONS
Clause 2.1: Intentional Damage. Any damage caused deliberately by the insured is NOT covered.
Clause 2.2: Cosmetic Damage. Scratches, dents, or discoloration that do not affect functionality are excluded.
Clause 2.3: Unverified Liveness. Claims submitted without biometric liveness verification are automatically rejected to prevent fraud.
Clause 2.4: Unauthorized Modification. Devices with 'Jailbreak' or 'Root' status or non-OEM parts are excluded.

3. DEDUCTIBLES
- Tier 1 (Screen Only): $29
- Tier 2 (Liquid/Other): $99
- Tier 3 (Total Loss): $149

4. FRAUD DETECTION
Veritas reserves the right to use AI analysis to detect pattern inconsistencies. 
Submission of edited metadata results in immediate policy termination (Ban Hammer Protocol).
    `;

    await ctx.runAction(api.actions.rag.ingestPolicy, {
        title: "Veritas Standard Protection",
        text: POLICY_TEXT
    });
    
    console.log("Policy Seeded Successfully!");
  }
});
