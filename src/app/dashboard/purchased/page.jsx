import React from 'react';

import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import MyPurchases from './MyPurchases';

const DashboardMypurchases = async () => {
    // সার্ভার-সাইড থেকে সেশন তুলে আনা
    const user = await getUserSession().catch(() => null);

    // ইউজার যদি লগইন করা না থাকে, তবে তাকে জোরপূর্বক লগইন পেজে রিডাইরেক্ট করা (গার্ড লজিক)
    if (!user) {
        redirect("/login"); // আপনার প্রজেক্টের লগইন ইউআরএল দিন
    }

    return (
        <div className="w-full">
            {/* ক্লায়েন্ট কম্পোনেন্টে ইউজার অবজেক্ট পাস করা হলো */}
            <MyPurchases user={user} />
        </div>
    );
};

export default DashboardMypurchases;