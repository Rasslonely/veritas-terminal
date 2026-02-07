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
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    // Demo User Data
    const userRole = "Field Agent";
    const walletAddress = "0x742...f44e";
    
    return (
        <DashboardLayout>
            <div className="space-y-6 pb-24">
                {/* Identity Header */}
                <div className="relative overflow-hidden rounded-2xl bg-black border border-white/10 p-6 group">
                     <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-black to-blue-500/10 opacity-50" />
                     <div className="relative z-10 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Guest Operator</h2>
                            <p className="text-xs font-mono text-muted-foreground">{walletAddress}</p>
                            <Badge variant="outline" className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                {userRole}
                            </Badge>
                        </div>
                     </div>
                </div>

                {/* IDENTITY SECTION */}
        <section className="px-4">
             <AgentLicense />
        </section>

        {/* TABS SECTION */}
        <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="wallet">Wallet</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="store">Store</TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallet" className="mt-4 space-y-4">
                        <ActivePolicies />
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                         <ClaimsList />
                    </TabsContent>

                        <TabsContent value="store" className="mt-4">
                            {/* <PolicyStore /> */}
                            <div className="text-white/50 text-center py-10">Store Coming Soon</div>
                        </TabsContent>
                </Tabs>
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
                    <HoloCard key={p._id} isActive={isActive} className="p-4">
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
                             <Badge variant={isActive ? "default" : "secondary"} className={cn("font-mono", isActive ? "bg-emerald-500 hover:bg-emerald-600" : "")}>
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
