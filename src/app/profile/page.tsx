"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { PolicyStore } from "@/components/policy/PolicyStore";
import { AgentLicense } from "@/components/agent/AgentLicense";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Smartphone, Laptop, Camera, Car, Zap, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ClaimsList } from "@/components/claim/ClaimsList";
import { HoloCard } from "@/components/ui/HoloCard";
import { TrustStats } from "@/components/profile/TrustStats";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const walletAddress = "0x742...f44e";
    const user = useQuery(api.users.getUser, { walletAddress });
    const userRole = "Field Agent";
    
    return (
        <DashboardLayout>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 content-start">
                    
                    {/* LEFT COLUMN: Identity Dossier */}
                    <div className="md:col-span-4 space-y-6">
                        {/* Identity Header */}
                        <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 p-4 md:p-6 group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-black to-blue-500/10 opacity-50" />
                            <div className="relative z-10 flex items-center gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[1px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                        <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-white leading-tight">
                                        {user?.displayName || "Guest Operator"}
                                    </h2>
                                    <p className="text-[10px] md:text-xs font-mono text-muted-foreground">{walletAddress}</p>
                                    <Badge variant="outline" className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] md:text-[10px] px-2 py-0">
                                        {userRole}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Tactical ID Card */}
                        <AgentLicense />

                        {/* Desktop Only Extra Info */}
                        <div className="hidden md:block p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                           <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Operator Context</h3>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-[10px]">
                                 <span className="text-white/30">Node_ID</span>
                                 <span className="text-emerald-500 font-mono">VTS-ALPHA-882</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                 <span className="text-white/30">Session_Liveness</span>
                                 <span className="text-white font-mono">STABLE</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                 <span className="text-white/30">Clearance_Level</span>
                                 <span className="text-white font-mono">LEVEL_3</span>
                              </div>
                           </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Operational Analytics */}
                    <div className="md:col-span-8 space-y-8">
                        {/* Stats Visualization - DESKTOP ONLY */}
                        <div className="hidden md:block space-y-4">
                            <h3 className="text-xs font-bold text-white/50 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-500" /> Personnel_Analytics
                            </h3>
                            <TrustStats />
                        </div>

                        {/* Operations Tabs */}
                        <Tabs defaultValue="wallet" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5 h-12 rounded-xl mb-6">
                                <TabsTrigger value="wallet" className="rounded-lg data-[state=active]:bg-white/10">Wallet</TabsTrigger>
                                <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white/10">History</TabsTrigger>
                                <TabsTrigger value="store" className="rounded-lg data-[state=active]:bg-white/10">Market</TabsTrigger>
                            </TabsList>

                            <TabsContent value="wallet" className="mt-0 space-y-4">
                                <ActivePolicies />
                            </TabsContent>

                            <TabsContent value="history" className="mt-0">
                                <ClaimsList variant="dossier" userId={user?._id} />
                            </TabsContent>

                            <TabsContent value="store" className="mt-0">
                                <div className="text-white/50 text-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                                    <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                                        <Zap className="w-8 h-8 text-zinc-500" />
                                    </div>
                                    <p className="text-sm font-medium">Neural Market Syncing...</p>
                                    <p className="text-[10px] text-zinc-600 mt-1 uppercase tracking-widest">Protocol Version v3.4 Pending</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}



// ... (other imports)

// ... (ProfilePage component)

function ActivePolicies() {
    const policies = useQuery(api.policies.getMyPolicies, {});

    if (!policies || policies.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-muted-foreground">No active coverage defined.</p>
                <div className="mt-4">
                     {/* Hint to switch tab */}
                     <p className="text-xs text-emerald-500">Go to Flash Store to buy protection.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {policies.map((p) => {
                const isActive = p.status === "ACTIVE" && p.endTime > Date.now();
                return (
                    <HoloCard key={p._id} isActive={isActive} className={cn("p-4 transition-all duration-500", !isActive && "opacity-40 grayscale hover:opacity-100 hover:grayscale-0")}>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-xl transition-colors", isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-muted-foreground")}>
                                    {getIcon(p.assetType)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-white">{p.assetType}</h3>
                                    <p className="text-xs text-white/50">{p.assetDescription}</p>
                                </div>
                             </div>
                             <Badge variant={isActive ? "default" : "secondary"} className={cn("font-mono", isActive ? "bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-transparent border border-white/10 text-white/30")}>
                                {isActive ? "ACTIVE" : "EXPIRED"}
                             </Badge>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-xs font-mono">
                            <span className="text-white/40">Coverage: <span className="text-white">${p.coverageAmount}</span></span>
                            <span className={isActive ? "text-emerald-400 animate-pulse" : "text-white/30"}>
                                {isActive ? `Ends in ${formatDistanceToNow(p.endTime)}` : "Expired"}
                            </span>
                        </div>
                    </HoloCard>
                );
            })}
        </div>
    );
}

// ... (PolicyStore)
function PolicyStore() {
    const createPolicy = useMutation(api.policies.createPolicy);
    const [loading, setLoading] = useState(false);

    const handleBuy = async (type: string, duration: number) => {
        setLoading(true);
        try {
            await createPolicy({
                assetType: type,
                durationHours: duration,
                assetDescription: `Protected ${type} (Flash)`
            });
            // Ideally switch tab or show toast, simple alert for now
            // alert("Policy Minted Successfully! 🛡️"); 
        } catch (e) {
            console.error(e);
            alert("Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    const PRODUCTS = [
        { type: "SMARTPHONE", icon: Smartphone, price: 5, cover: 1000 },
        { type: "LAPTOP", icon: Laptop, price: 12, cover: 2500 },
        { type: "CAMERA", icon: Camera, price: 8, cover: 1500 },
        { type: "VEHICLE", icon: Car, price: 25, cover: 10000 },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 pb-20">
            {PRODUCTS.map((prod) => (
                <Card key={prod.type} className="p-4 bg-white/5 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group cursor-pointer relative overflow-hidden" onClick={() => handleBuy(prod.type, 24)}>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-black border border-white/10 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                            <prod.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white">{prod.type}</h3>
                            <p className="text-[10px] uppercase tracking-widest text-emerald-500/80 font-bold">Cover ${prod.cover}</p>
                        </div>
                        <Button size="sm" className="w-full bg-white/10 hover:bg-emerald-600 font-mono text-xs border border-white/5" disabled={loading}>
                            {loading ? "..." : `BUY $${prod.price}`}
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function getIcon(type: string) {
    switch (type) {
        case "SMARTPHONE": return <Smartphone className="w-5 h-5" />;
        case "LAPTOP": return <Laptop className="w-5 h-5" />;
        case "CAMERA": return <Camera className="w-5 h-5" />;
        case "VEHICLE": return <Car className="w-5 h-5" />;
        default: return <Shield className="w-5 h-5" />;
    }
}
