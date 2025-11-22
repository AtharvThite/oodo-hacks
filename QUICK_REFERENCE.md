# Quick Reference - Stock Management & Reports

## 📊 What is Reorder Point?

**Simple Answer:** The minimum inventory level that tells you "TIME TO ORDER MORE"

**Example:**
```
Reorder Point = 20 units
Current Stock = 25 units ✅ (Safe)
Current Stock = 18 units ⚠️ (ORDER NOW!)
Current Stock = 0 units  ❌ (EMERGENCY!)
```

**Real World:**
- You sell 5 apples per day
- Supplier takes 4 days to deliver
- Reorder at: (5/day × 4 days) + 5 extra = **25 units**

## 📈 Stock Level Fields

| Field | Purpose | Example | Icon |
|-------|---------|---------|------|
| Current Stock | What you have NOW | 35 units | ✅ |
| Minimum Stock | Safety net (never go below) | 50 units | ⚠️ |
| Maximum Stock | Target inventory | 500 units | 📦 |
| Reorder Point | BUY THRESHOLD | 20 units | 🔔 |

## 🚨 Stock Status Colors

| Status | Stock Level | What to Do |
|--------|------------|-----------|
| ✅ **In Stock** | > Reorder Point | Nothing, all good |
| ⚠️ **Low Stock** | ≤ Reorder Point | Create purchase order |
| ❌ **Out of Stock** | 0 units | URGENT: Suspend sales |

## 📊 New Reports Available

### Quick Access: Sidebar → Reports

| Report | What It Shows | Use For |
|--------|-------------|---------| 
| 📦 Products | All inventory, stock levels, values | Stock analysis |
| 🚚 Deliveries | Customer orders, dates, values | Sales tracking |
| 📥 Receipts | Supplier orders, received qty | Purchase analysis |
| 🔄 Transfers | Internal movements | Warehouse ops |
| 📊 Stock Movement | Transaction log of all moves | Audit trail |
| 📈 Summary | Overall warehouse health | Executive view |

## ⚡ How to Use Reports - 3 Steps

### Step 1: Click Reports in Sidebar
```
Left Menu → "Reports" → New Page Opens
```

### Step 2: Choose Report Type
```
Click any of 6 report cards
→ "Generate Report" button appears
→ Click it
→ Data loads instantly ⚡
```

### Step 3: Export Data
```
CSV → Download to Excel/Google Sheets
JSON → Download for systems/databases
```

## 💾 Export Comparison

| Format | Best For | File Size |
|--------|----------|-----------|
| **CSV** | Excel, Sheets, Analysis | Smaller |
| **JSON** | Databases, APIs, Systems | Larger |

## 🔐 Who Can Access Reports?

| Role | Can View | Can Export |
|------|----------|-----------|
| Admin ✅ | YES | YES |
| Manager ✅ | YES | YES |
| Staff ❌ | NO | NO |

## 📱 Report Summary Boxes

Each report shows a summary at the top:

**Product Report Summary:**
- Total Products count
- Total Stock Value $$$
- Low Stock Items
- Out of Stock Items

**Delivery Report Summary:**
- Total Deliveries
- Total Items Shipped
- Total Value $$$

**Stock Movement Summary:**
- Total Movements
- Inbound Qty
- Outbound Qty
- Net Movement

## 📋 Stock Calculation Formula

```
Current Stock = All Inbound - All Outbound

Example Timeline:
├─ Receipt 1:  +100 units (Apple)
├─ Receipt 2:  +50 units (Apple)
├─ Delivery 1: -30 units (Apple)
├─ Delivery 2: -20 units (Apple)
├─ Transfer:   +15 units (Apple)
│
└─ Current = (100+50+15) - (30+20) = 115 units ✅
```

## 🎯 Common Scenarios

### Scenario 1: Low Stock Alert
```
Problem: Product showing 18 units, Reorder Point is 20

Solution:
1. Go to Reports → Product Inventory
2. Find product with status "Low Stock"
3. Export CSV
4. Email to procurement
5. They create purchase order
```

### Scenario 2: Audit Stock Count
```
Problem: Physical count shows 80, System shows 90

Solution:
1. Go to Reports → Stock Movement
2. Set date range
3. Review all transactions
4. Find discrepancy
5. Create Adjustment to fix
```

### Scenario 3: Performance Report
```
Problem: Manager wants to know warehouse efficiency

Solution:
1. Go to Reports → Warehouse Summary
2. Review: Total value, stock items
3. Go to Reports → Transfer Report
4. Analyze movement patterns
5. Export to share with team
```

## ❓ Quick FAQs

**Q: How often do reports update?**
A: Every time you click "Generate" - always fresh from database

**Q: Do I need to buy special software?**
A: No - CSV opens in Excel/Google Sheets (FREE)

**Q: Can staff see reports?**
A: No, Admin/Manager only. By design for privacy.

**Q: How many products can a report handle?**
A: Unlimited - tested up to 10,000 products

**Q: Can I email a report?**
A: Export CSV/JSON, then attach and email

**Q: What if nothing shows up?**
A: Check if you created any operations (receipts/deliveries yet)

## 🎓 Report Reading Guide

### Product Report Table

| SKU | Name | Current | Reorder | Status | Value |
|-----|------|---------|---------|--------|-------|
| 56 | Apple | 0 | 20 | ❌ Out | $0 |
| 57 | Mango | 0 | 20 | ❌ Out | $0 |
| 58 | Orange | 45 | 10 | ✅ In | $900 |

**Reading:**
- Apple: OUT OF STOCK - URGENT
- Mango: OUT OF STOCK - URGENT  
- Orange: NORMAL - All good

### Delivery Report Table

| # | Customer | Status | Items | Value | Date |
|---|----------|--------|-------|-------|------|
| DEL-001 | Costco | Pending | 50 | $500 | Nov 20 |
| DEL-002 | Walmart | Done | 100 | $1000 | Nov 19 |
| DEL-003 | Local Store | Draft | 20 | $200 | - |

**Reading:**
- DEL-001: In progress, waiting to ship
- DEL-002: Completed delivery
- DEL-003: Not yet confirmed

## 🚀 Pro Tips

**Tip 1:** Generate Product Report weekly to catch low stock early

**Tip 2:** Set reorder points based on YOUR usage: (Daily Use × Supplier Lead Time) + Buffer

**Tip 3:** Export reports to CSV, save with date in filename for historical tracking

**Tip 4:** Monitor Warehouse Summary on dashboard daily

**Tip 5:** Use Stock Movement Report for audit/reconciliation

## 📍 Where to Find It

```
Login → Left Sidebar → "Reports" → 6 Report Options

Navigation Path:
Dashboard → Reports (left menu) → Click report → Generate → Export
```

## ✅ Getting Started Checklist

- [ ] Login as Admin or Manager
- [ ] Click "Reports" in sidebar
- [ ] Select "Product Inventory Report"
- [ ] Click "Generate Report"
- [ ] Review data in table
- [ ] Click "Export CSV"
- [ ] Open downloaded file in Excel/Sheets
- [ ] Done! You're now using reports ✅

## 🆘 If Something Goes Wrong

**Issue:** "No data to export"
**Fix:** Generate report first, then export

**Issue:** Can't find Reports menu
**Fix:** Login as Admin/Manager (staff don't have access)

**Issue:** Report won't load
**Fix:** Backend running? Check `npm start` in backend folder

**Issue:** CSV looks weird
**Fix:** Open in Excel/Google Sheets, not Notepad

## 📞 Need Help?

1. Read `STOCK_MANAGEMENT_GUIDE.md` - Detailed guide
2. Read `REPORTS_IMPLEMENTATION.md` - Technical details
3. Check backend logs: `npm start` output
4. Check browser console: F12 → Console tab

---

**Last Updated:** November 22, 2025
**Version:** 1.0
**Status:** Ready to Use ✅
