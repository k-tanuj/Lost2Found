# 🛡️ Zero-Cost Safety Guide: How to Pay $0.00

You asked for **NO HIDDEN CHARGES**. Here is exactly how to ensure that.

---

## 1. Google Cloud (The Scariest Part)
**The Truth**: To use Google Vision API, you **MUST** link a Credit/Debit Card to enable the account. Google does this to prevent bots.
**The Safety Net**: You get **$300 free credits** for 90 days, AND the first **1,000 units/month** are always free.

### 🛑 How to GUARANTEE you pay $0:
1.  **Set a Budget Alert**:
    - Go to **Billing** > **Budgets & alerts**.
    - Create a budget for **$1.00**.
    - Set alert at 50% ($0.50).
    - If you ever get an email, STOP the project.
2.  **Set Quotas (Hard Limit)**:
    - Go to **IAM & Admin** > **Quotas**.
    - Filter for "Cloud Vision API".
    - Find "Requests per minute" or "Requests per day".
    - **EDIT QUOTAS**: Set it to something low, like **100 requests per day**.
    - *Result*: If your code goes crazy, Google just blocks it. **You cannot be charged if the API stops working.**

---

## 2. Render.com (Hosting)
**The Truth**: Render has paid plans, but we will use the **Free Instance**.
**The Safety Net**: Render's free tier spins down after 15 mins of inactivity. It is free forever, but slightly slower to wake up (takes 30s).

### 🛑 How to select it:
- When deploying, choose "Instance Type": **Free**.
- It shows "$0.00 / month".
- **Do not** add a credit card if they don't ask for it (usually they don't for hobby/free tier).

---

## 3. Firebase (Database & Auth)
**The Truth**: Firebase "Spark Plan" is Generous.
**The Safety Net**:
- Authentication: 50,000 active users/month (Free).
- Firestore: 50,000 reads/day (Free).
- **Stick to the SPARK Plan**. Do not upgrade to "Blaze".
- If you hit the limit, your app just stops working for the day. No charge.

---

## 🚀 Summary Checklist for You
- [ ] Google Cloud: I have set a Quota of 100 requests/day.
- [ ] Render: I will select the "Free" instance type.
- [ ] Firebase: I am on the "Spark" plan.

**Result**: It is physically impossible to be charged hidden fees if you follow these hard limits.
