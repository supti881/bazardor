# 🛒 বাজার দর (BazarDor)

**বাজার দর (BazarDor)** হলো নিত্যপ্রয়োজনীয় পণ্যের বাজারমূল্য পর্যবেক্ষণ, তুলনা এবং ট্র্যাকিং করার একটি আধুনিক ওয়েব অ্যাপ্লিকেশন। ক্রেতারা যাতে প্রতিদিনের বাজারে পণ্যের সঠিক দাম, দামের ওঠানামা এবং বিভিন্ন ক্যাটাগরির বিস্তারিত জানতে পারেন, সেই লক্ষ্যেই অ্যাপটি তৈরি করা হয়েছে।

---

## 🚀 Live Demo & Repository

- **Live Site:** [https://bazardor-ebon.vercel.app](https://bazardor-ebon.vercel.app)
- **GitHub Repository:** [https://github.com/supti881/bazardor](https://github.com/supti881) *(আপনার প্রজেক্টের সঠিক রিপোজিটরি লিংক দিন)*

---

## ✨ Key Features (মূল বৈশিষ্ট্যসমূহ)

1. **লাইভ প্রাইস ট্র্যাকার (Price Ticker):**
   - ওয়েবসাইটের ঠিক ওপরে একটি রিয়েল-টাইম স্ক্রলিং স্ট্রিপে প্রতিদিনের প্রধান প্রধান পণ্যের দাম এবং শতকরা হার ওঠানামার (▲/▼ %) লাইভ আপডেট।

2. **ডাইনামিক ক্যাটাগরি ও ফিল্টারিং:**
   - চাল, ডাল, তেল, সবজি, মাছ, মাংস ইত্যাদি ক্যাটাগরি অনুযায়ী পণ্য ব্রাউজ করার সুবিধা।
   - খালি বা ভুল ক্যাটাগরির ক্ষেত্রে ইউজার-ফ্রেন্ডলি স্টেট এবং হোম পেজে ফেরার ব্যবস্থা।

3. **বাংলা সংখ্যা সমর্থিত স্মার্ট সর্টিং (Smart Sorting):**
   - দাম কম থেকে বেশি এবং বেশি থেকে কম অনুযায়ী পণ্য সাজানোর সুবিধা, যা বাংলা সংখ্যা এবং নিউমেরিক ভ্যালু সঠিক নিয়মে প্রসেস করে।

4. **ইউজার অথেনটিকেশন (Authentication):**
   - Firebase Auth ব্যবহার করে ইমেইল/পাসওয়ার্ডের মাধ্যমে রেজিস্ট্রেশন ও লগইন।
   - Google এবং GitHub সামাজিক মাধ্যমের মাধ্যমে দ্রুত সাইন ইন করার সুবিধা।
   - প্রটেক্টেড রুট কন্ট্রোল এবং সেশন ম্যানেজমেন্ট।

5. **প্রোফাইল তথ্য আপডেট (Update Profile):**
   - ইউজার ড্যাশবোর্ডে নিজস্ব প্রোফাইল দেখা এবং আলাদা ডাইনামিক রুটে স্থানান্তরিত হয়ে নিজের নাম ও তথ্য পরিবর্তনের সুবিধা।

6. **সম্পূর্ণ রেসপন্সিভ ডিজাইন (Responsive Layout):**
   - মোবাইল, ট্যাবলেট এবং ডেস্কটপ—যেকোনো স্ক্রিন সাইজে ব্যবহারবান্ধব ইন্টারফেস ও কার্ড গ্রিড লেআউট।

---

## 🛠️ Technologies Used

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, DaisyUI
- **Authentication:** Firebase Auth
- **Toast Notifications:** react-hot-toast
- **Deployment:** Vercel

---

## 💻 Local Setup & Installation

প্রজেক্টটি আপনার কম্পিউটারে লোকালি রান করতে নিচের ধাপগুলো অনুসরণ করুন:

```bash
# ১. প্রজেক্টটি ক্লোন করুন
git clone [https://github.com/supti881/bazardor.git](https://github.com/supti881/bazardor.git)

# ২. প্রজেক্ট ফোল্ডারে প্রবেশ করুন
cd bazardor

# ৩. প্রয়োজনীয় প্যাকেজ ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ৪. .env.local ফাইল তৈরি করুন এবং ফায়ারবেস কি (Key) গুলো যোগ করুন
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ৫. ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev