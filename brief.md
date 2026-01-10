
## **Project Overview**

**Project Name:** Propflow
**Mission:** Help real estate professionals (agents, mortgage brokers, developers) acquire and retain clients through professional, data-driven email marketing.

**MVP Scope:** Launch an MVP dashboard + simple website that enables clients to:

* Send bi-weekly or monthly newsletters to their contact list
* Track performance metrics
* Manage campaigns

> Later tiers may include fully custom newsletter templates, automated flows, and additional services.

**Positioning:** Painkiller, not a vitamin. Propflow is essential for client engagement, not optional.

**Inspiration:** harvey.ai (professional, premium, trustworthy feel).

---

## **Type of Project**

* SaaS
* B2B
* Dashboard / Admin Panel
* Email Marketing Platform (retention-focused)

---

## **Skills Required**

* React / Next.js
* TypeScript
* TailwindCSS / ShadCN UI
* Supabase (DB + Auth)
* Clerk (Authentication)
* Mailgun / Resend (Email sending + deliverability)
* Stripe (optional payments/subscriptions)

---

## **Target Users**

* Real estate agents
* Mortgage brokers (**first MVP target**)
* Developers
* Focus: professionals managing a client base (50–5000 contacts per user)

---

## **MVP Features**

### **1️⃣ Dashboard / Frontend**

#### **Dashboard Tab (Home)**

* Overview of email campaigns
* Metrics displayed:

  * Open rate (month-over-month)
  * Click rate (month-over-month)
  * Engagement score (optional combination metric)
* Graph visualizing performance trends
* Latest campaign summary
* Next scheduled campaign summary
* Quick actions: request changes, approve campaign, view details

#### **Campaigns Tab**

* Table/list of previous campaigns:

  * Subject line, send date, open/click stats
* Upcoming campaigns:

  * Request changes
  * Approve newsletter
  * **Newsletter Design Options:**

    * Option 1: Drag-and-drop editor (open source React library or other) for admins to use
    * Option 2: Paste HTML if drag-and-drop isn’t feasible
* **Batch Template Management:**

  * Add multiple templates to each client account
  * Admin manages which templates are available
* Optional: filters, search

#### **Analytics Tab**

* Summary dashboard of metrics: open rate, click rate, engagement, unsubscribes
* Month-over-month growth / trend
* Optional: export reports

#### **Contacts Tab**

* Display contact count and growth
* Upload / modify contacts via CSV
* View contact-level info (first name, last name, email)

#### **Settings Tab**

* Brand colors and logo upload
* Company info (name, address, email)
* Type of content preferences (newsletters, tips, promotions)
* Notification preferences
* Subscription management (if paying clients)

#### **Other Potential Tabs / Sections**

* Help / FAQ / support chat
* Announcements / system updates

---

### **2️⃣ Backend**

#### **Multi-client / Multi-user Management**

* Admin account:

  * View all clients
  * Create / delete / modify client accounts
  * Access client dashboards
  * Manage subscriptions / billing
* Client sub-accounts (optional later)

#### **Email Management**

* Connect each client to Mailgun API
* Ensure each client is separated by sending domain
* Track deliverability per client
* Notifications for failed sends or errors

#### **Metrics / Analytics**

* Store and calculate open/click/engagement
* Aggregate monthly trends
* Accessible to both client and admin

#### **Auth**

* Two roles: Admin (you), Client (real estate professional)
* Secure authentication via Clerk

#### **Database Schema (Proposed MVP)**

**Tables:** (open to change)

* `users`: id, email, password hash (via Clerk), role (admin/client)
* `clients`: id, name, email, brand colors, domain, preferences
* `newsletters`: id, client_id, title, content_html, send_date, status
* `contacts`: id, client_id, first_name, last_name, email
* `send_logs`: id, newsletter_id, contact_id, sent_at, opened, clicked

---

## **Other Notes**

### **Frontend / Dashboard**

* Include mobile responsiveness (even if desktop-first for MVP)
* Optional: Time zone for sending emails

### **Backend / Admin**

* Deliverability tracking: consider including bounced / spam reports
* Notifications: Could be email or in-app (for MVP just admin dashboard)
* Multi-tenancy: explicitly note one Supabase schema per client or shared schema with client_id filter

---

## **5️⃣ Optional UX / UI Recommendations**

* Colors: dark blue / black / white / subtle gold accent
* Typography: Serif or neutral professional sans (like Inter, GT America, or similar)
* Layout: clean, minimal, focus on data clarity
* Should **not look AI-generated**, must feel premium and human-designed

---

**Note:** I used ChatGPT to create this. Feel free to use your judgement to change tech, features, and design. Ask me any questions you need to develop too. Use the front end plugin i installed.
