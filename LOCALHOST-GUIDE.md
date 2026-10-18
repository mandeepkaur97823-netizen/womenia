# WOMANIA Boutique - Localhost User Guide

Welcome to the **WOMANIA** offline-ready localhost installation. This package allows you to run the complete WOMANIA boutique e-commerce application locally on Windows without requiring any cloud hosting.

---

## 🚀 Quick Start (Ways to Launch)

### Option 1: Double-Click Batch File (Instant Launch)
- Double-click **`start-localhost.bat`** in this project folder.
- The script automatically detects **Bun** or **Node.js**, installs dependencies if missing, starts the server, and **opens `http://localhost:8080` in your default browser**.

### Option 2: Windows Desktop Shortcut
- Double-click **`create-desktop-shortcut.bat`** once.
- A **"WOMANIA Localhost"** shortcut will be placed directly onto your Windows Desktop with the boutique icon.
- You can now launch WOMANIA directly from your desktop anytime!

### Option 3: Interactive Control Panel Menu
- Double-click **`launcher-menu.bat`**.
- This provides an interactive menu:
  - `[1]` Start Localhost Server (Hot-Reload Dev Mode)
  - `[2]` Build & Preview Production Server (Optimized)
  - `[3]` Open WOMANIA in Default Browser
  - `[4]` Open Admin Dashboard directly
  - `[5]` Run Automated Tests & Health Check
  - `[6]` Create / Refresh Desktop Shortcut
  - `[7]` View Documentation

### Option 4: PowerShell
```powershell
./start-localhost.ps1
```

### Option 5: Command Prompt / Terminal
```bash
# Using Bun (Recommended, fast):
bun run localhost:bun

# Or using Node / npm:
npm run localhost
```

---

## 🌐 Website Routes & Destinations

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `http://localhost:8080/` | Editorial hero, category showcases, boutique story, featured outfits |
| **Shop** | `http://localhost:8080/shop` | Complete catalogue with filters, price sorting, and quick "Add to Bag" |
| **Collections** | `http://localhost:8080/collections` | Western, Indo-Western, Cocktail Gowns & Suits curation |
| **Gallery** | `http://localhost:8080/gallery` | Visual boutique lookbook with high-res styling photography |
| **About Us** | `http://localhost:8080/about` | Heritage, craftsmanship, and store location in Sri Ganganagar |
| **Customer Reviews** | `http://localhost:8080/reviews` | Verified shopper feedback and boutique testimonials |
| **Store Policies** | `http://localhost:8080/policies` | Exchange policy, alterations, shipping, and fabric care guidelines |
| **FAQ** | `http://localhost:8080/faq` | Frequently asked questions regarding sizing, custom tailoring, and orders |
| **Track Order** | `http://localhost:8080/track-order` | Real-time status lookup (Confirmed, Processing, Dispatched, Delivered, Cancelled) |
| **Admin Portal** | `http://localhost:8080/admin` | Store analytics, order management, customer enquiries, and order status updates |

---

## 👑 Super Admin & Site Governance Portal

- **URL:** `http://localhost:8080/admin`
- **👑 Super Admin Passcode:** `123456789` (Full Site Ownership)
- **🛡️ Staff Admin Passcode:** `12345678` (Orders & Analytics only)

### Super Admin Exclusive Capabilities:
1. **Master Site Switch (ON / OFF)**:
   - **🟢 Site ONLINE:** Public visitors can browse all collections, lookbooks, and place orders.
   - **🔴 Site OFFLINE (Maintenance Mode):** Public visitors see a luxury boutique maintenance screen with WhatsApp button. Logged-in Super Admins see a live preview with a top banner to toggle the site back ON anytime.
   - **Custom Maintenance Notices:** Edit headline, customer message, and estimated return time.
2. **Multi-Admin Management (Add & Remove Admins)**:
   - View all registered administrators with names, emails, and passwords.
   - **➕ Add New Admin:** Create additional staff admin accounts with custom names, usernames, and passwords.
   - **🗑️ Remove Admin:** Delete any staff admin account immediately with a single click. (Super Admin master account is permanently protected).
3. **Storewide Broadcast Banner**:
   - Live editable announcement bar across the top of all website pages.
4. **Ordering Kill-Switch**:
   - Enable or freeze online cart checkout while keeping browsing active.
5. **Data Backup**:
   - Export complete boutique database (orders, customer enquiries, analytics, settings) as a timestamped `.json` file.

---

## 🛍️ Offline & Localhost Features

1. **Local Storage Cart**:
   - Items added to the bag persist automatically in your browser's `localStorage`. Refreshing or restarting keeps your bag items intact.
2. **Interactive Localhost Checkout**:
   - Full checkout modal with address details, Indian state selector, and payment choices:
     - **UPI Payment** (QR code + instant VPA copy)
     - **WhatsApp Confirmation** (pre-filled order text generator)
     - **Direct Bank Transfer**
3. **Automated Order ID Generation**:
   - Generates unique order codes (e.g., `WOM-9842`) and saves them in local storage history.
4. **Printable Order Invoices**:
   - Click "Print Receipt" from the order confirmation modal or the admin portal to generate a clean, print-ready boutique bill.
5. **Self-Contained Local Assets**:
   - All high-resolution fashion photography and luxury SVG icons are bundled within the repository.

---

## 🛠️ System Requirements & Troubleshooting

- **Runtime:**
  - **Bun v1.0+** (Installed at `C:\Users\DELL\.bun\bin\bun.exe`) OR
  - **Node.js v18+** (Installed at `C:\Users\DELL\AppData\Local\Programs\nodejs\node.exe`)
- **Port Conflict (Port 8080 occupied):**
  - If another application is using port 8080, Vite will automatically select the next available port (e.g., `8081`).
  - The startup script automatically detects this and opens your browser to the exact active port.
- **Stopping the Server:**
  - Press `Ctrl + C` in the terminal window to cleanly stop the server.
