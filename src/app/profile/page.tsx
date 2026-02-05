"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Smartphone, Laptop, Camera, Car, Zap, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

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

                <Tabs defaultValue="wallet" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/5">
                        <TabsTrigger value="wallet">Policy Wallet</TabsTrigger>
                        <TabsTrigger value="store">Flash Store</TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallet" className="mt-4 space-y-4">
                        <ActivePolicies />
                    </TabsContent>

                    <TabsContent value="store" className="mt-4">
                         <PolicyStore />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}

function ActivePolicies() {
    const policies = useQuery(api.policies.getMyPolicies, {});

    if (!policies || policies.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <p className="text-muted-foreground">No active coverage.</p>
                <div className="mt-4">
                     {/* Hint to switch tab */}
                     <p className="text-xs text-emerald-500">Go to Flash Store to buy protection.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {policies.map((p) => {
                const isActive = p.status === "ACTIVE" && p.endTime > Date.now();
                return (
                    <Card key={p._id} className={`p-4 border ${isActive ? 'border-emerald-500/50 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' : 'border-white/10 opacity-60'}`}>
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5">
                                    {getIcon(p.assetType)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{p.assetType}</h3>
                                    <p className="text-xs text-muted-foreground">{p.assetDescription}</p>
                                </div>
                             </div>
                             <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-emerald-500" : ""}>
                                {isActive ? "ACTIVE" : "EXPIRED"}
                             </Badge>
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-xs font-mono">
                            <span className="text-muted-foreground">Coverage: ${p.coverageAmount}</span>
                            <span className={isActive ? "text-emerald-400 animate-pulse" : "text-muted-foreground"}>
                                {isActive ? `Ends in ${formatDistanceToNow(p.endTime)}` : "Expired"}
                            </span>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}

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
            alert("Policy Minted Successfully! 🛡️");
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
        <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((prod) => (
                <Card key={prod.type} className="p-4 bg-white/5 border-white/10 hover:border-emerald-500/40 transition-all group cursor-pointer" onClick={() => handleBuy(prod.type, 24)}>
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="p-3 rounded-full bg-black border border-white/10 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-colors">
                            <prod.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{prod.type}</h3>
                            <p className="text-xs text-muted-foreground">24h / ${prod.cover}</p>
                        </div>
                        <Button size="sm" className="w-full bg-white/10 hover:bg-emerald-600 font-mono text-xs" disabled={loading}>
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
