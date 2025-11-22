# Complete CRUD Operations Testing Guide for StockMaster

This guide provides step-by-step test data for demonstrating all CRUD operations in the StockMaster inventory management system.

## Prerequisites
- Backend server running on port 5000
- Frontend running on port 3000
- Logged in as admin user

---

## 1. WAREHOUSES (Settings → Warehouses)

### ✅ CREATE - Add Warehouse
**Navigation:** Settings → Warehouses → Add Warehouse

**Test Data Set 1:**
```
Warehouse Name: Main Distribution Center
Short Code: MDC
Supplier Address: 123 Industrial Ave, New York, NY 10001
Active Warehouse: ✓ (checked)
```

**Test Data Set 2:**
```
Warehouse Name: Regional Warehouse North
Short Code: RWN
Supplier Address: 456 Storage Blvd, Boston, MA 02101
Active Warehouse: ✓ (checked)
```

**Test Data Set 3:**
```
Warehouse Name: Regional Warehouse South
Short Code: RWS
Supplier Address: 789 Logistics St, Atlanta, GA 30301
Active Warehouse: ✓ (checked)
```

**Expected Result:** 
- Success toast: "Warehouse created successfully"
- Redirect to Dashboard
- Warehouse appears in Settings → Warehouses list

### ✅ READ - View Warehouses
**Navigation:** Settings → Warehouses

**Expected Display:**
- List showing all 3 warehouses with names and codes
- Search functionality working
- 0/3 warehouses count displayed

### ✅ UPDATE - Edit Warehouse
**Navigation:** Settings → Warehouses → Click on "Main Distribution Center" → Edit

**Modified Data:**
```
Warehouse Name: Main Distribution Center (Updated)
Short Code: MDC
Supplier Address: 123 Industrial Ave, Suite 500, New York, NY 10001
Active Warehouse: ✓ (checked)
```

**Expected Result:** 
- Success toast: "Warehouse updated successfully"
- Changes reflected in warehouse list

### ✅ DELETE - Archive/Deactivate Warehouse
**Navigation:** Settings → Warehouses → Uncheck "Active Warehouse"

**Expected Result:** Warehouse marked as inactive

---

## 2. PRODUCTS (Products)

### ✅ CREATE - Add Products
**Navigation:** Products → Add Product

**Test Data Set 1: Electronics**
```
Product Name: iPhone 15 Pro Max
SKU: IPH15PM256
Description: Latest iPhone model with 256GB storage, Titanium finish
Category: Electronics
Unit of Measure: pieces
Cost Price: 899.00
Selling Price: 1199.00
Min Stock Level: 10
Max Stock Level: 100
Reorder Point: 20
```

**Test Data Set 2: Food & Beverage**
```
Product Name: Premium Coffee Beans
SKU: COFBEAN001
Description: Arabica coffee beans from Colombia, 1kg pack
Category: Food & Beverage
Unit of Measure: kg
Cost Price: 12.50
Selling Price: 18.99
Min Stock Level: 50
Max Stock Level: 500
Reorder Point: 100
```

**Test Data Set 3: Office Supplies**
```
Product Name: A4 Paper Ream
SKU: A4PAPER500
Description: White A4 paper, 500 sheets per ream
Category: Office Supplies
Unit of Measure: boxes
Cost Price: 3.50
Selling Price: 5.99
Min Stock Level: 100
Max Stock Level: 1000
Reorder Point: 200
```

**Test Data Set 4: Clothing**
```
Product Name: Cotton T-Shirt Blue Large
SKU: TSHIRTBL
Description: 100% cotton t-shirt, blue color, size L
Category: Clothing
Unit of Measure: pieces
Cost Price: 8.00
Selling Price: 19.99
Min Stock Level: 25
Max Stock Level: 200
Reorder Point: 50
```

**Test Data Set 5: Hardware**
```
Product Name: Steel Bolts M10x50mm
SKU: BOLTM1050
Description: Galvanized steel bolts, M10 x 50mm, pack of 100
Category: Hardware
Unit of Measure: boxes
Cost Price: 15.00
Selling Price: 24.99
Min Stock Level: 30
Max Stock Level: 300
Reorder Point: 60
```

**Expected Result:** 
- Success toast for each: "Product created successfully"
- Redirect to Dashboard
- Products appear in Products list

### ✅ READ - View Products
**Navigation:** Products

**Expected Display:**
- List of all 5 products
- Stock status badges (Out of Stock initially)
- Search and filter functionality
- Product details visible

### ✅ UPDATE - Edit Product
**Navigation:** Products → Click on "iPhone 15 Pro Max" → Edit

**Modified Data:**
```
Product Name: iPhone 15 Pro Max 256GB
SKU: IPH15PM256
Description: Latest iPhone model with 256GB storage, Titanium finish, US Version
Category: Electronics
Unit of Measure: pieces
Cost Price: 899.00
Selling Price: 1299.00 (CHANGED)
Min Stock Level: 15 (CHANGED)
Max Stock Level: 100
Reorder Point: 25 (CHANGED)
```

**Expected Result:** 
- Success toast: "Product updated successfully"
- Updated prices visible in product list

### ✅ DELETE - View Only
**Note:** Products cannot be deleted if they have stock moves, only marked inactive.

---

## 3. RECEIPTS (Operations → Receipts)

### ✅ CREATE - Add Receipt
**Navigation:** Operations → Receipts → New Receipt

**Test Data Set 1: Electronics Supplier**
```
Reference: RCP-2025-001
Supplier Name: TechWorld Distributors
Supplier Email: orders@techworld.com
Supplier Phone: +1-555-0101
Warehouse: Main Distribution Center (MDC)
Location: Storage (select from dropdown)
Scheduled Date: 2025-11-25
Supplier Address: 100 Tech Park, San Jose, CA 95101

Products:
  Product 1:
    Product Name: IPH15PM256
    Expected Quantity: 50
    Unit Price: 899.00
    (Total: $44,950.00)
  
  Product 2:
    Product Name: TSHIRTBL
    Expected Quantity: 100
    Unit Price: 8.00
    (Total: $800.00)

Notes: First shipment for Q4 2025, priority delivery
Grand Total: $45,750.00
```

**Test Data Set 2: Food Supplier**
```
Reference: RCP-2025-002
Supplier Name: Coffee Imports Inc
Supplier Email: sales@coffeeimports.com
Supplier Phone: +1-555-0202
Warehouse: Regional Warehouse North (RWN)
Location: Receiving
Scheduled Date: 2025-11-26
Supplier Address: 250 Import Lane, Miami, FL 33101

Products:
  Product 1:
    Product Name: COFBEAN001
    Expected Quantity: 200
    Unit Price: 12.50
    (Total: $2,500.00)

Notes: Temperature-controlled shipment required
Grand Total: $2,500.00
```

**Test Data Set 3: Office Supplies**
```
Reference: RCP-2025-003
Supplier Name: Office Plus Wholesale
Supplier Email: wholesale@officeplus.com
Supplier Phone: +1-555-0303
Warehouse: Main Distribution Center (MDC)
Location: Storage
Scheduled Date: 2025-11-27
Supplier Address: 500 Paper Mill Rd, Portland, OR 97201

Products:
  Product 1:
    Product Name: A4PAPER500
    Expected Quantity: 500
    Unit Price: 3.50
    (Total: $1,750.00)
  
  Product 2:
    Product Name: BOLTM1050
    Expected Quantity: 100
    Unit Price: 15.00
    (Total: $1,500.00)

Notes: Bulk order with 30-day payment terms
Grand Total: $3,250.00
```

**Expected Result:** 
- Success toast: "Receipt created successfully"
- Redirect to Dashboard
- Receipt appears in Operations → Receipts list with "Draft" status

### ✅ READ - View Receipts
**Navigation:** Operations → Receipts

**Expected Display:**
- List of all 3 receipts
- Reference numbers, suppliers, warehouses, scheduled dates
- Status badges showing "Draft"
- Total value displayed
- Filter by status working

### ✅ UPDATE - Edit Receipt
**Navigation:** Operations → Receipts → Click on "RCP-2025-001" → View/Edit

**Note:** Typically receipts in "Done" status cannot be edited, only drafts can be modified.

### ✅ DELETE/CANCEL - Cancel Receipt
**Navigation:** Operations → Receipts → Select receipt → Change status to "Cancelled"

---

## 4. DELIVERIES (Operations → Deliveries)

### ✅ CREATE - Add Delivery
**Navigation:** Operations → Deliveries → New Delivery

**Test Data Set 1: Electronics Customer**
```
Reference: DEL-2025-001
Customer Name: Best Buy Retail
Customer Email: procurement@bestbuy.com
Customer Phone: +1-555-1001
Warehouse: Main Distribution Center (MDC)
Source Location: Storage
Scheduled Date: 2025-11-28
Customer Address: 1000 Retail Plaza, Minneapolis, MN 55401

Products:
  Product 1:
    Product Name: IPH15PM256
    Quantity: 20
    Unit Price: 1299.00
    (Total: $25,980.00)

Notes: Rush delivery for Black Friday sale
Grand Total: $25,980.00
```

**Test Data Set 2: Apparel Customer**
```
Reference: DEL-2025-002
Customer Name: Fashion Forward Boutique
Customer Email: orders@fashionforward.com
Customer Phone: +1-555-1002
Warehouse: Regional Warehouse South (RWS)
Source Location: Picking
Scheduled Date: 2025-11-29
Customer Address: 200 Style Ave, Los Angeles, CA 90001

Products:
  Product 1:
    Product Name: TSHIRTBL
    Quantity: 50
    Unit Price: 19.99
    (Total: $999.50)

Notes: Standard shipping, fragile packaging required
Grand Total: $999.50
```

**Test Data Set 3: Office Customer**
```
Reference: DEL-2025-003
Customer Name: Corporate Solutions LLC
Customer Email: purchasing@corpsolutions.com
Customer Phone: +1-555-1003
Warehouse: Main Distribution Center (MDC)
Source Location: Storage
Scheduled Date: 2025-11-30
Customer Address: 300 Business Park, Chicago, IL 60601

Products:
  Product 1:
    Product Name: A4PAPER500
    Quantity: 200
    Unit Price: 5.99
    (Total: $1,198.00)
  
  Product 2:
    Product Name: BOLTM1050
    Quantity: 50
    Unit Price: 24.99
    (Total: $1,249.50)

Notes: Regular business customer, net 30 payment terms
Grand Total: $2,447.50
```

**Expected Result:** 
- Success toast: "Delivery created successfully"
- Redirect to Dashboard
- Delivery appears in Operations → Deliveries list

### ✅ READ - View Deliveries
**Navigation:** Operations → Deliveries

**Expected Display:**
- List of all 3 deliveries
- Reference, customer, warehouse, scheduled date, status
- Total value for each delivery
- Search and filter functionality

### ✅ UPDATE - Edit Delivery
**Navigation:** Operations → Deliveries → Click delivery → Edit

**Expected:** Can modify draft deliveries before confirmation

### ✅ DELETE/CANCEL - Cancel Delivery
**Navigation:** Operations → Deliveries → Update status to "Cancelled"

---

## 5. INTERNAL TRANSFERS (Operations → Internal Transfers)

### ✅ CREATE - Add Transfer
**Navigation:** Operations → Internal Transfers → New Transfer

**Test Data Set 1: Between Locations**
```
Reference: TRN-2025-001
Source Location: Storage (MDC)
Destination Location: Picking (MDC)
Scheduled Date: 2025-12-01
Transfer Type: internal

Products:
  Product 1:
    Product Name: IPH15PM256
    Quantity: 10
  
  Product 2:
    Product Name: COFBEAN001
    Quantity: 50

Notes: Moving items to picking area for order fulfillment
```

**Test Data Set 2: Between Warehouses**
```
Reference: TRN-2025-002
Source Location: Storage (MDC)
Destination Location: Storage (RWN)
Scheduled Date: 2025-12-02
Transfer Type: inter-warehouse

Products:
  Product 1:
    Product Name: A4PAPER500
    Quantity: 100
  
  Product 2:
    Product Name: TSHIRTBL
    Quantity: 25

Notes: Rebalancing stock across warehouses
```

**Test Data Set 3: Quality Check Transfer**
```
Reference: TRN-2025-003
Source Location: Receiving (RWN)
Destination Location: Quality Check (RWN)
Scheduled Date: 2025-12-03
Transfer Type: internal

Products:
  Product 1:
    Product Name: BOLTM1050
    Quantity: 20

Notes: Random quality inspection batch
```

**Expected Result:** 
- Success toast: "Transfer created successfully"
- Redirect to Dashboard
- Transfer appears in Internal Transfers list

### ✅ READ - View Transfers
**Navigation:** Operations → Internal Transfers

**Expected Display:**
- List of all transfers
- From/To locations, dates, status
- Items count for each transfer

### ✅ UPDATE - Edit Transfer
**Navigation:** Internal Transfers → Click transfer → Edit

**Expected:** Can modify draft transfers

### ✅ DELETE/CANCEL - Cancel Transfer
**Navigation:** Change status to "Cancelled"

---

## 6. ADJUSTMENTS (Operations → Adjustments)

### ✅ CREATE - Add Adjustment
**Navigation:** Operations → Adjustments → New Adjustment

**Test Data Set 1: Physical Count Correction**
```
Reference: ADJ-2025-001
Location: Storage (MDC)
Adjustment Date: 2025-11-23
Adjustment Type: physical_count

Products:
  Product 1:
    Product: IPH15PM256
    Theoretical Quantity: 50
    Actual Quantity: 48
    Difference: -2
    Reason: 2 units found damaged during inspection

Notes: Annual inventory count adjustment
```

**Test Data Set 2: Damage Adjustment**
```
Reference: ADJ-2025-002
Location: Receiving (RWN)
Adjustment Date: 2025-11-23
Adjustment Type: damage

Products:
  Product 1:
    Product: COFBEAN001
    Theoretical Quantity: 200
    Actual Quantity: 195
    Difference: -5
    Reason: Water damage to 5kg during receiving

Notes: Supplier will be notified for insurance claim
```

**Test Data Set 3: Found Items**
```
Reference: ADJ-2025-003
Location: Storage (RWS)
Adjustment Date: 2025-11-23
Adjustment Type: found

Products:
  Product 1:
    Product: TSHIRTBL
    Theoretical Quantity: 100
    Actual Quantity: 105
    Difference: +5
    Reason: Found misplaced items in back corner

Notes: Extra units discovered during reorganization
```

**Test Data Set 4: Loss Adjustment**
```
Reference: ADJ-2025-004
Location: Storage (MDC)
Adjustment Date: 2025-11-23
Adjustment Type: loss

Products:
  Product 1:
    Product: BOLTM1050
    Theoretical Quantity: 100
    Actual Quantity: 97
    Difference: -3
    Reason: Unexplained shortage detected

Notes: Investigating potential theft or miscount
```

**Expected Result:** 
- Success toast: "Adjustment created successfully"
- Redirect to Dashboard
- Stock levels updated immediately
- Adjustment appears in Operations → Adjustments list

### ✅ READ - View Adjustments
**Navigation:** Operations → Adjustments

**Expected Display:**
- List of all adjustments
- Reference, location, date, type, products affected
- Difference quantities shown

### ✅ UPDATE - Edit Adjustment
**Navigation:** Adjustments → Click adjustment → Edit

**Note:** Completed adjustments typically cannot be edited

### ✅ DELETE/CANCEL - Cancel Adjustment
**Navigation:** Change status to "Cancelled" if allowed

---

## 7. MOVE HISTORY (Operations → Move History)

### ✅ READ - View All Stock Movements
**Navigation:** Operations → Move History

**Expected Display:**
- Complete audit trail of all stock movements
- Filters by:
  - Date range
  - Product
  - Movement type (in/out/internal/adjustment)
  - Warehouse/Location
- Each row shows:
  - Date/Time
  - Product
  - Move type
  - Quantity
  - From/To location
  - Reference document
  - User who created the movement

**Expected Movements from Above Operations:**
1. Receipts (IN movements): +50 iPhones, +200 coffee, +500 paper, +100 bolts, +100 t-shirts
2. Deliveries (OUT movements): -20 iPhones, -50 t-shirts, -200 paper, -50 bolts
3. Internal Transfers: 10 iPhones, 50 coffee, 100 paper, 25 t-shirts, 20 bolts
4. Adjustments: -2 iPhones, -5 coffee, +5 t-shirts, -3 bolts

**Verification:**
- Total movements should match all created operations
- Quantities should be correct
- Status should show operation status

---

## 8. REPORTS (Reports)

### ✅ READ - Generate Reports
**Navigation:** Reports

**Test Each Report Type:**

#### 8.1 Product Inventory Report
**Click:** "Product Inventory Report" card
**Expected Display:**
- All 5 products listed
- Current stock quantities calculated from movements
- Stock valuations (qty × cost price)
- Stock status (In Stock/Low Stock/Out of Stock)
- Reorder points
**Actions:** 
- Click "Export to CSV" - downloads Excel-compatible file
- Click "Export to JSON" - downloads JSON file

#### 8.2 Receipt Report
**Click:** "Receipt Report" card
**Expected Display:**
- All 3 receipts
- Supplier names
- Scheduled dates
- Total values
- Status
**Summary Statistics:**
- Total receipts: 3
- Total value: $51,500.00 (45,750 + 2,500 + 3,250)
- Average value: $17,166.67

#### 8.3 Delivery Report
**Click:** "Delivery Report" card
**Expected Display:**
- All 3 deliveries
- Customer names
- Scheduled dates
- Total values
- Status
**Summary Statistics:**
- Total deliveries: 3
- Total value: $29,427.00 (25,980 + 999.50 + 2,447.50)
- Average value: $9,809.00

#### 8.4 Transfer Report
**Click:** "Transfer Report" card
**Expected Display:**
- All 3 transfers
- Source and destination locations
- Scheduled dates
- Item counts
- Transfer types (internal/inter-warehouse)

#### 8.5 Stock Movement Report
**Click:** "Stock Movement Report" card
**Expected Display:**
- Complete list of all stock movements
- Grouped by date
- Filterable by date range and movement type
- Shows running totals

#### 8.6 Warehouse Summary Report
**Click:** "Warehouse Summary Report" card
**Expected Display:**
- Health metrics for each warehouse:
  - Total products stored
  - Total stock value
  - Pending receipts
  - Pending deliveries
  - Low stock alerts
  - Out of stock items

**For All Reports:**
- ✓ Export to CSV works
- ✓ Export to JSON works
- ✓ Date filters work (if applicable)
- ✓ Data refreshes on "View Report" click

---

## 9. DASHBOARD (Main View)

### ✅ READ - View Dashboard KPIs
**Navigation:** Dashboard

**Expected KPI Cards:**

1. **Total Products:** 5
2. **Total Stock Value:** Calculated from all movements
3. **Low Stock Items:** Products below reorder point
4. **Out of Stock:** Products with 0 quantity
5. **Pending Receipts:** 3 (if still in draft/waiting)
6. **Pending Deliveries:** 3 (if still in draft/waiting)
7. **Pending Transfers:** 3 (if still in draft/waiting)

**Expected Widgets:**

1. **Recent Operations**
   - Latest 5 operations across all types
   - Shows type, reference, date, status

2. **Stock Alerts**
   - Low stock products highlighted
   - Out of stock products listed
   - Reorder recommendations

3. **Inventory Overview Chart** (if implemented)
   - Visual representation of stock levels
   - Category-wise breakdown

**Real-Time Updates:**
- Dashboard should update after each operation
- Stock counts should reflect latest movements
- Alerts should appear for low/out-of-stock items

---

## Testing Checklist Summary

### CRUD Operations Coverage:

| Entity | Create | Read | Update | Delete/Cancel |
|--------|--------|------|--------|---------------|
| ✅ Warehouses | 3 items | List view | 1 edit | Archive |
| ✅ Products | 5 items | List + Details | 1 edit | (Soft delete) |
| ✅ Receipts | 3 items | List + Details | Draft edits | Cancel |
| ✅ Deliveries | 3 items | List + Details | Draft edits | Cancel |
| ✅ Transfers | 3 items | List + Details | Draft edits | Cancel |
| ✅ Adjustments | 4 items | List + Details | Draft edits | Cancel |
| ✅ Move History | - | Full audit | - | - |
| ✅ Reports | - | 6 report types | - | - |
| ✅ Dashboard | - | Live KPIs | - | - |

---

## Expected Stock Levels After All Operations

**After completing all above test data:**

| Product | Receipts (IN) | Deliveries (OUT) | Transfers | Adjustments | Final Stock |
|---------|---------------|------------------|-----------|-------------|-------------|
| iPhone 15 Pro Max | +50 | -20 | -10 | -2 | **18 units** |
| Coffee Beans | +200 | 0 | -50 | -5 | **145 kg** |
| A4 Paper | +500 | -200 | -100 | 0 | **200 boxes** |
| T-Shirts | +100 | -50 | -25 | +5 | **30 pieces** |
| Steel Bolts | +100 | -50 | -20 | -3 | **27 boxes** |

**Stock Status Expected:**
- iPhone: Low Stock (below reorder point of 25)
- Coffee: Above min stock
- Paper: At reorder point
- T-Shirts: Low Stock
- Bolts: Low Stock

---

## Troubleshooting Common Issues

1. **Warehouse dropdown empty in forms:**
   - Verify warehouses exist in Settings → Warehouses
   - Check backend logs for API errors
   - Ensure `isActive` filter removed in backend

2. **Location dropdown empty:**
   - Locations are auto-generated (mock data currently)
   - In production, create locations via Warehouse management

3. **Product not found errors:**
   - Use exact product names or implement product dropdown
   - Future: Replace text input with searchable product selector

4. **Reference number conflicts:**
   - Each reference must be unique
   - System may auto-generate if field is optional

5. **Stock calculations incorrect:**
   - Verify all operations have status "done" to be counted
   - Check Move History for all movements
   - Refresh Dashboard after each operation

---

## Demo Script Order

**For smooth demonstration, follow this sequence:**

1. ✅ **Setup Phase** (5 minutes)
   - Create 3 Warehouses
   - Create 5 Products

2. ✅ **Inbound Operations** (5 minutes)
   - Create 3 Receipts (stock comes in)
   - Verify Move History shows IN movements

3. ✅ **Outbound Operations** (5 minutes)
   - Create 3 Deliveries (stock goes out)
   - Verify Move History shows OUT movements

4. ✅ **Internal Operations** (5 minutes)
   - Create 3 Transfers (stock moves between locations)
   - Verify Move History shows INTERNAL movements

5. ✅ **Adjustments** (3 minutes)
   - Create 4 Adjustments (correct stock levels)
   - Verify Move History shows ADJUSTMENT movements

6. ✅ **Reporting & Analysis** (7 minutes)
   - View Dashboard with updated KPIs
   - Generate all 6 reports
   - Export reports to CSV/JSON
   - Show Move History audit trail

**Total Demo Time: ~30 minutes**

---

## Success Criteria

✅ **All operations complete without errors**
✅ **Stock calculations are accurate**
✅ **Dashboard shows real-time updates**
✅ **Reports generate correctly with data**
✅ **Export functionality works**
✅ **Move History shows complete audit trail**
✅ **Toast notifications appear for all operations**
✅ **Forms validate correctly**
✅ **Navigation works between all pages**
✅ **Search and filter functions work**

---

## Notes

- All monetary values are in USD
- Dates use format: YYYY-MM-DD
- Stock quantities support decimals for weight/volume units
- Reference numbers follow pattern: [TYPE]-[YEAR]-[NUMBER]
- Status workflow: draft → waiting → ready → done (or cancelled)
- All operations create corresponding stock movements
- System maintains complete audit trail

**End of Testing Guide**
