# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Running on Localhost

WOMANIA is fully equipped to run on your local machine with automatic browser launching, responsive design, offline shopping cart, and order persistence.

### Option 1: 1-Click Windows Batch File (Recommended)
Double-click [`start-localhost.bat`](file:///c:/Users/DELL/Desktop/womenia%20site/start-localhost.bat) in the project folder.
- Automatically checks for **Bun** or **Node.js**
- Installs dependencies automatically if missing
- Starts the server and opens **`http://localhost:8080`** in your default browser

### Option 2: Interactive Boutique Control Panel Menu
Double-click [`launcher-menu.bat`](file:///c:/Users/DELL/Desktop/womenia%20site/launcher-menu.bat) for an interactive menu:
- Start hot-reloading dev server or production preview server
- Open the storefront or Admin Portal (`PIN: 12345678`) directly
- Run automated diagnostics & tests
- Create / refresh Desktop shortcut

### Option 3: 1-Click Desktop Shortcut
Double-click [`create-desktop-shortcut.bat`](file:///c:/Users/DELL/Desktop/womenia%20site/create-desktop-shortcut.bat) once.
- Places a **"WOMANIA Localhost"** shortcut on your Windows Desktop
- Double-click the desktop icon anytime to start the boutique server immediately

### Option 4: PowerShell
Run the PowerShell script:
```powershell
./start-localhost.ps1
```

### Option 5: Command Line
```sh
# Using Bun (fastest)
bun install
bun run localhost:bun

# Or using Node / npm
npm install
npm run localhost
# or
npm run dev
```

For complete step-by-step guidance, see [`LOCALHOST-GUIDE.md`](file:///c:/Users/DELL/Desktop/womenia%20site/LOCALHOST-GUIDE.md).

The site will be live at: **http://localhost:8080**

## Localhost Features
- **All Pages & Destinations**: Home, Shop, Collections, About, Gallery, Reviews, Policies, FAQ, and Contact.
- **Offline Shopping Cart**: Products added to cart are persisted locally in `localStorage`.
- **Direct & Cart Checkout**: Includes interactive checkout modal with UPI details, order summary, order ID generation, printable receipts, and direct WhatsApp order dispatch.
- **Local Images & Assets**: All high-resolution boutique imagery and custom SVG icons are bundled locally.

## Built with

- TanStack Start
- TypeScript
- React 19
- Tailwind CSS v4
