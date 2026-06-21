import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
  "pro-chef-monthly": process.env.STRIPE_PRO_MONTHLY,
  "pro-chef-yearly": process.env.STRIPE_PRO_YEARLY,
  "restaurant-pro-monthly": process.env.STRIPE_REST_MONTHLY,
  "restaurant-pro-yearly": process.env.STRIPE_REST_YEARLY,
};