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
      }
    },
  }, 

  // 🔐 সার্ভার-সাইড হুক (নিখুঁত ও ডাইনামিক চেক)
  hooks: {
    database: {
      user: {
        signIn: {
          before: async (user) => {
            // 💡 Better Auth অনেক সময় ক্যাশ ডেটা ব্যবহার করে। 
            // তাই আমরা সরাসরি মঙ্গোডিবি থেকে ইউজারের একদম লেটেস্ট ডেটা তুলে এনে চেক করব।
            // আপনার কালেকশনের নাম 'user' হলে 'user' দিবেন, 'users' হলে 'users' দিবেন।
            const freshUser = await db.collection("user").findOne({ 
              _id: typeof user.id === "string" ? new ObjectId(user.id) : user._id 
            });

            // 🛑 মঙ্গোডিবি থেকে পাওয়া তাজা ডেটায় যদি 'isBlocked' ট্রু (true) থাকে
            if (freshUser && (freshUser.isBlocked === true || freshUser.isBlocked === "true")) {
              throw new Error("Your account has been blocked by the admin! 🚫");
            }

            return { user };
          },
        },
      },
    },
  },
});