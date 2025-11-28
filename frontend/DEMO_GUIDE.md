# Quick Navigation Guide

## 🚀 Getting Started

The app is now running at: **http://localhost:5173**

## 📍 All Routes

### Main Flow
1. **/** - Landing Page
   - Hero section with animated background
   - Feature showcase
   - CTAs: "Start Tracking" and "Connect Cardano Wallet"

2. **/onboard** - Onboarding Wizard
   - 4-step setup process
   - Guest or wallet mode selection
   - User profile configuration

3. **/dashboard** - Main Dashboard
   - Monthly financial overview
   - Quick actions
   - Charts and statistics

### Feature Pages
4. **/transactions** - Transaction Management
   - Search and filter transactions
   - Add/edit/delete operations
   - Auto-categorization display

5. **/budget** - Budget Planning
   - Interactive budget sliders
   - AI recommendations
   - On-chain storage option

6. **/agents** - Agent Marketplace
   - Browse AI agents
   - Enable/disable agents
   - Payment flow for premium agents

7. **/insights** - AI Insights Timeline
   - Review recommendations
   - Accept/dismiss actions
   - Full explanations

### Configuration
8. **/settings** - Settings & Preferences
   - Profile management
   - Wallet connection
   - Privacy controls
   - Hydra L2 toggle

9. **/admin** - Admin Panel (Demo/QA)
   - Agent execution logs
   - Blockchain transaction logs
   - Search and filter

## 🎯 Recommended Demo Flow

### For Hackathon Demo:

1. **Start at Landing (/)** 
   - Show the beautiful hero section
   - Point out animated background orbs
   - Highlight feature cards

2. **Click "Start Tracking" → Onboarding (/onboard)**
   - Demo the wizard flow
   - Show step transitions
   - Complete all 4 steps

3. **Dashboard (/dashboard)**
   - Show monthly overview
   - Click through month selector
   - Open "Ask AI to Optimize Budget" modal
   - Open "Quick Add Expense" modal

4. **Navigate to Transactions (/transactions)**
   - Show search functionality
   - Filter by category
   - Point out auto-categorization badges
   - Click floating "+" button

5. **Budget (/budget)**
   - Adjust sliders
   - Click "Get AI Suggestion"
   - Show before/after comparison
   - Mention "Store Proof on Cardano"

6. **Agents (/agents)**
   - Show marketplace grid
   - Point out verified badges
   - Toggle an agent on
   - Open payment modal for premium agent
   - Show Hydra L2 option

7. **Insights (/insights)**
   - Show timeline view
   - Demonstrate Accept/Dismiss
   - Open full explanation
   - Show "Ask for Clarification" modal

8. **Settings (/settings)**
   - Show wallet connection UI
   - Toggle Hydra L2
   - Demonstrate privacy controls
   - Show data export option

9. **Admin (/admin)**
   - Switch between tabs
   - Show agent logs
   - Show blockchain logs
   - Point out explorer links

## 🎨 Animation Highlights to Showcase

### Landing Page
- **Background orbs** - Continuous pulse animation
- **Feature cards** - Staggered entrance
- **Demo preview** - Floating scan lines

### Onboarding
- **Progress bar** - Smooth width animation
- **Step transitions** - Slide left/right
- **Selection cards** - Scale on click with checkmark

### Dashboard
- **Stats cards** - Sequential fade-in
- **Progress bars** - Animate from 0 to value
- **Month selector** - Smooth navigation
- **Trend chart** - Bar growth animation

### Transactions
- **Table rows** - Sequential reveal
- **Floating button** - Subtle pulse
- **Modals** - Scale and fade

### Budget
- **Sliders** - Smooth drag
- **Progress bars** - Color-coded animation
- **AI suggestions** - Slide-in reveal

### Agents
- **Grid entrance** - Staggered cards
- **Toggle switches** - Smooth slide
- **Payment modal** - Scale-in effect

### Insights
- **Timeline** - Vertical reveal
- **Timeline dots** - Pulse on hover
- **Confidence bars** - Fill animation

### Settings
- **Toggle switches** - Smooth position change with icons
- **Hydra info** - Expand/collapse
- **Delete modal** - Attention-grabbing entrance

## ⌨️ Keyboard Navigation

- **Tab** - Move between interactive elements
- **Enter/Space** - Activate buttons
- **Escape** - Close modals
- **Arrow Keys** - Navigate through sliders

## 📱 Mobile Testing

To test on mobile:
```bash
npm run dev -- --host
```

Then access from your phone using your computer's IP address.

## 🎬 Pro Tips for Demo

1. **Use a fresh browser window** - Clear cache for best performance
2. **Go fullscreen** - Press F11 for immersive demo
3. **Speak to animations** - Point out smooth transitions
4. **Hover effects** - Show interactive elements
5. **Click through modals** - Demonstrate all interactions
6. **Mobile responsive** - Resize browser to show adaptability
7. **Dark theme** - Highlight professional color scheme
8. **No loading** - Everything is instant (add backend later)

## 🐛 Known Limitations

- **No real wallet integration** - Shows alert, ready for API
- **Mock data** - All data is placeholder
- **No backend** - Pure frontend implementation
- **Charts** - Placeholder visualizations (integrate library later)
- **No persistence** - State resets on refresh

## ⚡ Quick Fixes

If something looks off:
1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear cache**: DevTools → Application → Clear Storage
3. **Restart dev server**: Ctrl+C then `npm run dev`

## 🎯 Best Demo Order for Judges

**5-Minute Demo:**
1. Landing (30s) - First impression
2. Onboarding (1m) - User flow
3. Dashboard (1m) - Main features
4. Agents (1m) - AI marketplace
5. Settings (30s) - Blockchain integration
6. Admin (1m) - Technical proof

**Quick 2-Minute Demo:**
1. Landing → Show hero
2. Dashboard → Show stats and animations
3. Agents → Show marketplace
4. Admin → Show logs for technical judges

## 📸 Screenshot Opportunities

Best screens for documentation:
- Landing hero with orbs
- Dashboard with stats cards
- Agents marketplace grid
- Insights timeline
- Settings with Hydra toggle
- Admin blockchain logs

---

**Enjoy your demo! The UI is smooth, professional, and ready to impress.** ✨
