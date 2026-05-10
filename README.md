# 🏗️ Rekha AI CCTV Lead Generation PDR

## Project Overview

- **Project Name:** Rekha AI Security Lead Funnel
- **Platform:** Next.js (SSG/ISR), Tailwind CSS, Framer Motion, Supabase (Database + Edge Functions)
- **Design Focus:** High Trust, Data-Driven, Conversion-Optimized, Mobile-First
- **Color Palette:** Clean White (`#FFFFFF`) background, Slate Gray (`#333333`) text, Safety Orange (`#FF4500`) accents

---

## 🚀 1. The Customer Funnel (Landing Page)

The entire funnel is built as a single-page state-managed wizard, minimizing friction and creating a smooth "configuration" experience.

### 1.1. Common Header and UI Elements

- **Mobile-First Portrait View:** All steps occupy the full vertical space of a standard smartphone.
- **Header Card:** A consistent floating context card at the very top of each screen, featuring an icon and light-orange gradient background, presenting a data-driven security fact or value proposition. *(e.g., "NCRB 2024 Fact: 1 property theft every 3 minutes...")*
- **Progress Indicator:** A simple "X of 6" text and a thin orange progress line at the very top of the screen *(e.g., 1 of 6, 2 of 6)*.
- **Navigation:** A "Back" button to return to the previous step. The next step is triggered optimistically by selecting an option.
- **Optimistic UI:** State transitions between steps use smooth slide-in animations (via Framer Motion) to create an app-like feel. No loading spinners until the final form submission.

### 1.2. The 6-Step Funnel Flow

| Step | Intent | Data/Value Card Content (Top Card) | Options / Input Fields |
| :--- | :--- | :--- | :--- |
| **1** | **Location Selection**<br/>(Where do you need this?) | *"DID YOU KNOW? India reports 1 property theft every 3 minutes. NCRB 2024 — Most happen while CCTVs are recording—but nobody is watching."* | Five selectable, rounded-corner cards:<br/>1. My shop / store (Grocery, medical, mobile, jewellery)<br/>2. My home (Flat, bungalow, villa, farmhouse)<br/>3. My society / apartment (Gated community, RWA, building)<br/>4. Warehouse / storage (Storage, cold storage, logistics hub)<br/>5. Office / business (Office, co-working, showroom) |
| **2** | **Technical Compatibility**<br/>(Which camera do you have?) | *"SOCIETIES LIKE YOURS: Gated societies report 3-5 theft incidents per year—averaging ₹48K loss per incident. Guards cost ₹15,000/mo and still miss incidents."* | Five selectable, rounded-corner cards:<br/>1. CP Plus<br/>2. Hikvision<br/>3. Dahua / Imou<br/>4. Some other brand (Godrej, HiFocus, TVT, etc.)<br/>5. WiFi camera (no DVR) (TP-Link, Qubo, Mi, Realme) |
| **3** | **Scale & Tiering**<br/>(How many cameras?) | *"FULL COVERAGE FOR YOU: Rekha AI covers gate, parking, common areas, and lift lobbies—all at once. Cheaper than guards, smarter than humans."* | Four defined tier options with pricing:<br/>1. 1 to 4 (Rekha Pro) - ₹14,999<br/>2. 5 to 8 (Rekha Ultra) - ₹19,999<br/>3. 9 to 16 (Enterprise) - ₹37,999<br/>4. More than 16 (Custom setup) - ₹54,999+ |
| **4** | **AI Feature Selection**<br/>(What should it catch?) | *"3-YEAR PROTECTION — Build your coverage below."*<br/>Fact Card: *"VALUE PROP: Free 3-Year AI Protection included with standard features."* | Four interactive feature cards (checkboxes, all FREE):<br/>1. Intruder alert (Instant photo alert)<br/>2. Fire & smoke (Alert within seconds)<br/>3. Theft detection (Instant photo alert)<br/>4. Violence / fight alert (Fights detected)<br/><br/>*Persistent footer bar showing "Your price: [Amount]" and "See my price" button.* |
| **5** | **The "Anchor" & Summary**<br/>(Your Rekha AI is ready) | *"YOUR PROTECTION IS READY: Monitoring 8 cameras properly needs 2 guards = ₹40,000/month. Rekha AI is ₹22,498 one-time—pays for itself in under a month."* | A summary card displaying the configuration:<br/>- For: [Location Type]<br/>- Camera: [Count/Brand]<br/>- AI Processing: On-device—no cloud<br/>- Features: [List of selected features]<br/><br/>Itemized billing breakdown matching total dynamic quote. |
| **6** | **Lead Capture Form**<br/>(Last step) | *"PROGRESS: We'll WhatsApp you when your Rekha AI is ready to ship. 100% complete."* | A clean lead form with rounded, 10px-padded inputs:<br/>1. Your Name<br/>2. WhatsApp / Phone Number<br/>3. State, City, Pincode<br/><br/>**CTA:** "✓ Book my spot — Free"<br/>*Trust Footer: "No payment now. No spam. Just one message when ready."* |

### 1.3. Micro-interactions and Polish

- **Glassmorphism Fact Cards:** The floating contextual cards at the top should feature subtle translucent effects with background blur.
- **Scale Animation on Selection:** When a user selects a location, camera brand, or tier card, the card should scale up slightly (1.05x).
- **Checkmark on Confirmation:** When the final form is submitted, the "✓ Book my spot — Free" button should transform into a large, prominent animated checkmark while the data sends optimistically.

---

## 🖥️ 2. The Private Admin Panel

To maintain the high-end feel and make analysis seamless, a custom admin dashboard will be built.

### 2.1. Access and Security

- **Protected View:** Built as a private route (e.g., `rekha-ai.vercel.app/admin` or `admin.rekha-ai.vercel.app`).
- **Access Control:** Access is protected, with authentication handled via Supabase Auth (or a secure password). Only authorized users can access the data.

### 2.2. Dashboard Specifications (Next.js + Shadcn UI)

- **Lead Velocity Chart (Daily Leads):** A dynamic line chart powered by Recharts showing the number of leads received each day.
- **Segment Breakdown (Location Type):** A pie chart analyzing which of the 5 location types is generating the most interest. This helps fine-tune marketing.
- **High-Value Leads View:** A filtered list view showing only leads where `camera_count` > 8.
- **The "Called/Status" Table:** A comprehensive lead list table (TanStack Table) with sorting and filtering options for status (New, Called, Closed, Lost), city, and pincode.
- **Analytics:** A real-time calculated total potential pipeline value based on the aggregated `total_quote` of "New" leads.

### 2.3. Dashboard Interactions

- **Quick Actions (WhatsApp Chat Icon):** Next to every phone number, include a generic WhatsApp icon that, when clicked, opens a direct chat window with the pre-filled message:<br/>
  *"Hi [Name], I'm looking at your configuration for Rekha AI in [City]. Can we talk?"*

---

## ⚡ 3. Backend and Data Integrity

The backend logic is **100% serverless**, eliminating Render dependency and ensuring high performance.

### 3.1. Supabase Database Schema (`rekha_leads`)

| Column Name | Data Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Auto-generated | A unique identifier for every lead. |
| `created_at` | `Timestamptz` | Auto-generated | The exact timestamp the lead was created. |
| `full_name` | `Text` | Not Null | User's full name. |
| `phone` | `Text` | Not Null | WhatsApp / Phone number. |
| `location_type` | `Text` | | Shop, Home, Society, etc. |
| `camera_brand` | `Text` | | CP Plus, Hikvision, etc. |
| `camera_count` | `Int4` | | Total number of cameras selected. |
| `features` | `Text[]` | | Array of selected FREE AI features. |
| `total_quote` | `Numeric` | | The price presented to the user. |
| `state` | `Text` | | Captured from form. |
| `city` | `Text` | | Captured from form for regional analysis. |
| `pincode` | `Text` | | Captured from form. |
| `status` | `Text` | Default: 'New' | Lead status (New, Called, Closed, Lost). |

### 3.2. Supabase Edge Function (`notify_lead`)

- **Functionality:** This Typescript function executes on the millisecond a lead is successfully inserted into the database.
- **Trigger:** Supabase Database Webhook on row insert in the `rekha_leads` table.
- **Action:** Fire an instant HTTP POST request to the Telegram Bot API.
- **Message Format:** A professionally formatted Telegram message sent to the team:
  ```text
  🚨 NEW REKHA AI LEAD!
  Name: [Full Name]
  Phone: [Phone Number] (With direct chat link)
  Location: [Location Type] ([City], [State])
  Cameras: [Count] ([Brand])
  Quote: ₹[Total Quote]
  Status: New
  Details: Intruder, Fire Detection
  ```

---

## 🚀 4. Deployment and Pre-Flight Plan

### 4.1. Deployment Strategy (100% Free initially)

- **Platform:** Frontend Hosted on Vercel (`rekha-ai.vercel.app` subdomain), Database & Edge Functions on Supabase, and Notifications via Telegram.
- **Cost Management:** All components will initially operate within free tiers.
- **Scaling:** Move to a custom domain and consider paid Vercel/Supabase tiers when ad spend or lead volume increases.

### 4.2. Pre-Flight Checklist

- **[ ] Lighthouse Performance:** Ensure the mobile Lighthouse speed score is 95+ (loads in under 2 seconds).
- **[ ] End-to-End Testing:** Verify that filling out the Lead Form triggers an immediate Telegram notification and the lead appears correctly in the Admin Panel with 'New' status.
- **[ ] OG Image:** Confirm a high-quality OG image is set up for social media and WhatsApp link shares (Configure in Next.js `layout.js`).

---

## 📊 Summary of Tech Stack Overview

| Service | Technology | Role |
| :--- | :--- | :--- |
| **Frontend & Admin** | Vercel, Next.js | **The "Face":** This is where the actual code for your landing page and your private dashboard lives. It handles the UI and user interaction. |
| **Backend & Database** | Supabase | **The "Brain":** It stores every lead (Database) and runs the notification script (Edge Functions) to message you. It is your backend. |
