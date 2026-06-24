import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("recipehubDb");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    onSignUp: async ({ user }) => {
      user.role = "user";
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [admin()],

  user: {
    additionalFields: {
      plan: {
        type: "string",
        defaultValue: "free",
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },

  // 🔐 Better Auth গ্লোবাল লাইফসাইকেল হুকস
  hooks: {
    beforeSignIn: async (ctx) => {
      const { user } = ctx;
      
      if (!user || !user.id) return;

      try {
        // 💡 Better Auth-এর ক্যাশ এড়াতে সরাসরি MongoDB থেকে লেটেস্ট ডেটা চেক
        let userQuery = { _id: user.id };
        
        // আইডি যদি ObjectId ফরম্যাটে থাকে
        if (ObjectId.isValid(user.id)) {
          userQuery = { _id: new ObjectId(user.id) };
        }

        const freshUser = await db.collection("user").findOne(userQuery);

        // 🛑 ইউজার যদি ব্লকড থাকে, তবে লগইন রিজেক্ট করে এরর থ্রো করবে
        if (freshUser && (freshUser.isBlocked === true || freshUser.isBlocked === "true")) {
          throw new Error("Your account has been blocked by the admin! 🚫");
        }
      } catch (error) {
        console.error("Auth Block Hook Error:", error);
        // Better Auth-এ কাস্টম মেসেজ পাস করার জন্য অবজেক্ট রিটার্ন করা যায় অথবা ডিরেক্ট থ্রো
        throw error;
      }
    },
  },
});