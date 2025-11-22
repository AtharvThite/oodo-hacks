# Stock Management System Explained

## 📚 Understanding Key Concepts

### 1. **Out of Stock Handling**

When a product's current inventory reaches **0 units**, it's marked as "Out of Stock". This happens automatically based on:

- **Stock Moves**: Every receipt (incoming) and delivery (outgoing) creates a stock move
- **Real-time Calculation**: Current stock = Total Inbound - Total Outbound
- **Automatic Alerts**: Out of stock items trigger alerts on the dashboard

**How it works:**
```
Product A:
  - Received 100 units (receipt)
  - Delivered 100 units (delivery)
  - Current Stock = 100 - 100 = 0 units
  - Status: ❌ Out of Stock
```

### 2. **Reorder Point Explained**

The **Reorder Point** is the minimum inventory level that triggers an automatic alert to reorder stock.

**Example:**
```
Product B (Apple):
  - Current Stock: 0 units
  - Reorder Point: 20 units (minimum)
  - Max Stock Level: 500 units
  - Min Stock Level: 50 units

Status Timeline:
  • 0-20 units  → ⚠️ LOW STOCK (alert)
  • 0 units     → ❌ OUT OF STOCK (critical alert)
  • 21-49 units → ⚠️ BELOW MINIMUM
  • 50-500      → ✅ NORMAL
  • >500        → ⏰ OVERSTOCKED (optional alert)
```

**Uses:**
- Automatic purchase order generation (if configured)
- Warehouse alerts for staff
- Inventory planning
- Just-in-time procurement

**Setting Reorder Point:**
- Edit product → Set "Reorder at:" field
- Example: Sell 5 units/day, supplier takes 4 days → Reorder Point = 20 units

### 3. **Stock Level Fields (Min & Max)**

| Field | Purpose | Example |
|-------|---------|---------|
| **Minimum Stock Level** | Never go below this (safety stock) | 50 units |
| **Maximum Stock Level** | Target/optimal inventory | 500 units |
| **Reorder Point** | When to trigger purchase | 20 units |

**Visual:**
```
500 │ ✅ MAXIMUM ─────────────┐
    │                         │ Target inventory range
    │ ✅ NORMAL ──────────────┤
    │                         │
 50 │ ⚠️ MINIMUM ─────────────┤ Safety stock
    │                         │
 20 │ ⚠️ REORDER ───────────┐ │ Trigger purchase order
    │                        │ │
  0 │ ❌ OUT OF STOCK ─┐    │ │ Critical
    └────────────────────────────→ Time
```

---

## 📊 New Reports Feature

### What's New?

A complete **Business Intelligence & Reporting System** is now available in the left sidebar under "Reports" (admin & manager only).

### 6 Report Types

#### 1. **Product Inventory Report** 📦
Shows current status of all products with comprehensive metrics:
- SKU, Name, Category
- Current Stock vs Min/Max/Reorder levels
- Stock valuation (Quantity × Cost Price)
- Status badge (In Stock / Low Stock / Out of Stock)
- Cost vs Selling Price comparison

**Use Case:** Identify slow-moving items, valuation, reorder candidates

---

#### 2. **Delivery Report** 🚚
Complete delivery order tracking:
- Delivery Number, Customer, Warehouse
- Status (Draft, Pending, Delivered, Cancelled)
- Item count & total value
- Scheduled vs Actual delivery dates
- Notes & created by

**Use Case:** Customer fulfillment tracking, performance metrics

---

#### 3. **Receipt Report** 📥
Purchase order and receiving history:
- Receipt Number, Supplier, Warehouse
- Status tracking
- Item count & total value
- Expected vs Actual receipt dates
- Notes & created by

**Use Case:** Supplier performance, purchase analysis

---

#### 4. **Transfer Report** 🔄
Internal stock movement tracking:
- Transfer Number, From/To Locations
- Status, Item count
- Reason for transfer
- Created by & timestamp

**Use Case:** Internal logistics, warehouse efficiency

---

#### 5. **Stock Movement Report** 📊
Detailed transaction log of all stock movements:
- Product, SKU, Movement Type (In/Out)
- Quantity, Reference
- From/To locations
- Timestamp & user

**Use Case:** Audit trail, inventory tracing, compliance

---

#### 6. **Warehouse Summary Report** 📈
Overall warehouse health snapshot:
- Total Products
- Total Stock Value (all inventory worth)
- Low Stock Items count
- Out of Stock Items count
- Last Updated

**Use Case:** Executive dashboard, inventory health check

### How to Use Reports

#### Step 1: Access Reports
1. Login as Admin or Manager
2. Click **"Reports"** in left sidebar
3. Choose report type (6 options)

#### Step 2: Generate Report
- Click **"Generate Report"** on any report card
- Instantly fetches latest data from database
- Shows comprehensive statistics

#### Step 3: View Data
- Sortable table with all details
- Summary statistics at top
- Color-coded status badges (Green/Yellow/Red)

#### Step 4: Export
- **CSV**: Download as Excel/Sheets compatible file
- **JSON**: Download as raw data file
- Automatic filename with timestamp

### Example Workflow

```
Manager goes to Reports → Product Inventory Report
→ Sees 3 products out of stock
→ Clicks "Generate Report" 
→ Latest data loads instantly
→ Reviews stock levels and valuation
→ Exports as CSV
→ Sends to procurement team
→ Team creates purchase orders for reorder candidates
```

### Features

✅ **Real-time Data** - Always fetches latest from database  
✅ **Multiple Formats** - CSV, JSON exports  
✅ **Auto-stamped** - Generated date/time included  
✅ **Instant Processing** - No delays, live calculations  
✅ **Comprehensive Stats** - Summary + detailed rows  
✅ **Color Coding** - Visual status indicators  
✅ **Easy Download** - One-click export to file  
✅ **Role-Based** - Admin & Manager only  

---

## 🔄 Stock Movement Logic

### How Stock is Calculated

```javascript
Current Stock = Inbound Quantity - Outbound Quantity

Example:
├─ Receipt 1: +50 units (Apple)
├─ Receipt 2: +30 units (Apple)
├─ Delivery 1: -20 units (Apple)
├─ Transfer: +10 units (Apple)
└─ Current Stock = (50 + 30 + 10) - 20 = 70 units ✅
```

### Stock Move Types

| Type | Source | Creates Stock Move |
|------|--------|-------------------|
| **Receipt** | Supplier | ✅ In-bound move (+qty) |
| **Delivery** | Customer | ✅ Out-bound move (-qty) |
| **Transfer** | Warehouse | ✅ Both (out + in) |
| **Adjustment** | System | ✅ In/Out (corrects discrepancy) |

---

## 💡 Pro Tips

### For Low Stock
1. Set **Reorder Point** to: `(Daily Usage × Lead Time Days) + Safety Stock`
2. Example: Sell 5/day, supplier takes 4 days → Reorder at 20-30 units
3. Monitor via Dashboard alerts or Stock Alerts widget

### For Inventory Optimization
1. Run **Product Inventory Report** weekly
2. Check stock valuation to identify tied-up capital
3. Reduce max levels for slow-moving items
4. Increase reorder frequency for fast movers

### For Audit & Compliance
1. Export **Stock Movement Report** with date range
2. Use for reconciliation with physical counts
3. Identify missing items or discrepancies
4. Track who made each transaction (created by)

### For Performance Tracking
1. Monitor **Delivery & Receipt Reports**
2. Compare scheduled vs actual dates
3. Identify bottlenecks or delays
4. Measure supplier/warehouse efficiency

---

## 🔐 Role Access

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| View Reports | ✅ | ✅ | ❌ |
| Export Reports | ✅ | ✅ | ❌ |
| Create Operations | ✅ | ✅ | ✅ |
| View Dashboard | ✅ | ✅ | ✅ |
| Edit Products | ✅ | ✅ | ❌ |

---

## 📱 Mobile Support

- Reports work on tablets and phones
- Swipe to scroll through large tables
- Export works on mobile browsers
- Full responsive design

---

## 🚀 Next Steps

1. **Generate your first report** - Try Product Inventory Report
2. **Export data** - Try CSV export to your spreadsheet app
3. **Set up reorder points** - Edit products and set proper minimums
4. **Monitor alerts** - Check dashboard daily for stock alerts
5. **Schedule reports** - Run weekly/monthly for trend analysis

---

## ❓ FAQs

**Q: How often do reports update?**
A: Reports fetch data instantly from database when generated. No caching.

**Q: Can I schedule automatic reports?**
A: Not yet, but you can manually generate anytime.

**Q: Which export format should I use?**
A: CSV for Excel/Google Sheets, JSON for systems/databases.

**Q: Do reports include deleted items?**
A: Only active products/operations are included.

**Q: Can I filter reports by date range?**
A: Yes, filters are available (date range, status, etc).

**Q: What if I have 10,000 products?**
A: Reports still work instantly - optimized for scale.

**Q: Can staff view reports?**
A: Not yet - Admin/Manager only. Can be enabled per role.

**Q: Do I get email reports?**
A: No, but you can export and email manually.

---

## 📞 Support

For issues:
1. Check if backend is running (`npm start`)
2. Verify you have correct role (Admin/Manager)
3. Try refreshing page
4. Check browser console (F12) for errors
5. Ensure no date filters are too restrictive

