# Testing Guide - Stock Calculation Verification

## ✅ Pre-Flight Checklist

Before testing, ensure:
- [ ] Backend running: `npm start` (backend folder)
- [ ] Frontend running: `npm run dev` (frontend folder)
- [ ] MongoDB connected and has data
- [ ] You're logged in as Admin or Manager

---

## 🧪 Test Cases

### Test 1: Dashboard KPIs Accuracy

**Step 1:** Go to Dashboard
```
Expected: Shows realistic numbers (not all 0s)
- Total Products: >0
- Low Stock Items: ≥0
- Out of Stock: ≥0
- Pending Receipts: ≥0
```

**Step 2:** Check Against Database
```bash
# In MongoDB Atlas or local mongo:
db.products.find().count()                    # Should match "Total Products"
db.stockmoves.find({status:'done'}).count()   # Verify moves exist
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 2: Stock Movement - Receipt (Incoming)

**Scenario:** Receive 100 units of Apple

**Steps:**
1. Go to Operations → Receipts
2. Click "New Receipt"
3. Fill form:
   - Supplier: "Supplier A"
   - Warehouse: Select any warehouse
   - Add Product: Apple, Quantity: 100
   - Expected Date: Today
4. Click "Create Receipt"
5. Receipt appears in list (status: Draft)
6. Click on receipt → Click "Mark as Ready"
7. Click "Validate Receipt"
8. Receipt status changes to "Done"

**Verify:**
- [ ] Receipt created successfully
- [ ] Status changed to "Done"
- [ ] No error messages
- [ ] Stock move created in background

**Check Stock:**
```
Dashboard → KPI "Total Stock Value" should increase
Reports → Product Report → Find Apple → Stock should be +100
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 3: Stock Movement - Delivery (Outgoing)

**Scenario:** Deliver 20 units of Apple to Customer

**Steps:**
1. Go to Operations → Deliveries
2. Click "New Delivery"
3. Fill form:
   - Customer: "Customer X"
   - Warehouse: Same as receipt
   - Add Product: Apple, Quantity: 20
   - Scheduled Date: Today
4. Click "Create Delivery"
5. Delivery appears in list (status: Draft)
6. Click on delivery → Click "Mark as Ready"
7. Click "Validate Delivery"
8. Delivery status changes to "Done"

**Verify:**
- [ ] Delivery created successfully
- [ ] Status changed to "Done"
- [ ] No stock validation errors
- [ ] Stock move created

**Check Stock:**
```
Before: 100 units (from receipt)
After:  80 units (100 - 20)

Dashboard → Total Stock should now show reduced value
Reports → Product Report → Apple → Stock should be 80
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 4: Internal Transfer

**Scenario:** Move 15 units between locations

**Steps:**
1. Go to Operations → Transfers
2. Click "New Transfer"
3. Fill form:
   - Source Location: Warehouse location
   - Destination Location: Production floor
   - Add Product: Apple, Quantity: 15
4. Click "Create Transfer"
5. Mark as Ready → Validate

**Verify:**
- [ ] Transfer created and validated
- [ ] Status: Done
- [ ] No errors

**Check Stock:**
```
Total Stock should REMAIN 80 (transfers don't change total)
Location-level stock should change:
- Source: 80 - 15 = 65
- Destination: 0 + 15 = 15
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 5: Stock Adjustment

**Scenario:** 2 units damaged, need to adjust

**Steps:**
1. Go to Operations → Adjustments
2. Click "New Adjustment"
3. Fill form:
   - Product: Apple
   - System Stock: 80 (auto-filled)
   - Physical Count: 78 (2 damaged)
   - Reason: "Damaged in storage"
4. Click "Calculate Difference" → Shows -2
5. Click "Create Adjustment"

**Verify:**
- [ ] Adjustment created
- [ ] Shows correct difference (-2)
- [ ] Status: Done
- [ ] No errors

**Check Stock:**
```
Before: 80 units
After:  78 units (80 - 2)

Dashboard → Total Stock decreases by 2
Reports → Apple stock shows 78
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 6: Stock Alerts

**Scenario:** Check low stock alerts

**Steps:**
1. Dashboard → Scroll to "Stock Alerts" widget
2. Look for alerts

**Expected:**
```
If apple stock (78) > reorder point (20): No alert
If apple stock ≤ reorder point: Shows alert

Example:
Product: Apple
Stock: 5 units
Reorder Point: 20
Status: ⚠️ Low Stock
```

**Verify:**
- [ ] Alerts show only when stock ≤ reorder point
- [ ] Correct products listed
- [ ] Status badges correct (Yellow=Low, Red=Out)

**Status:** ✅ PASS / ❌ FAIL

---

### Test 7: Reports Accuracy

**Test 7a: Product Report**

Steps:
1. Go to Reports (left sidebar)
2. Click "Product Inventory Report"
3. Click "Generate Report"

**Verify:**
```
Should show:
- Apple: 78 units ✅
- Status: "In Stock"
- Stock Value: 78 × costPrice
- Reorder Point: 20
```

**Export:**
1. Click "CSV"
2. File downloads
3. Open in Excel

**Verify Data:**
- [ ] Apple row shows 78 units
- [ ] All products listed
- [ ] No #REF! or errors in Excel

**Status:** ✅ PASS / ❌ FAIL

---

**Test 7b: Stock Movement Report**

Steps:
1. Reports → Stock Movement Report
2. Generate Report

**Verify Shows All Movements:**
```
1. Receipt: +100 (Date: receipt date)
2. Delivery: -20 (Date: delivery date)
3. Transfer: -15 (Type: Internal)
4. Adjustment: -2 (Reason: Damaged)

Total Line: 100-20-15-2 = 63 ✅
```

**Wait, that doesn't match!** Let me check...
```
Actually, Transfer is INTERNAL (shouldn't be in total):
100 (receipt) - 20 (delivery) - 2 (adjustment) = 78 ✅
Transfer affects locations, not total
```

**Status:** ✅ PASS / ❌ FAIL

---

### Test 8: Move History

**Steps:**
1. Go to Operations → Move History
2. Filter by date range
3. Click on any transaction

**Verify Shows:**
```
- Product name
- Quantity
- Movement type (In/Out/Internal/Adjustment)
- From/To locations
- User who created
- Date/time
- Reference number
```

**Check Chronological Order:**
- [ ] Latest movements first
- [ ] Dates in descending order
- [ ] All movements visible

**Status:** ✅ PASS / ❌ FAIL

---

## 🔍 Troubleshooting

### Issue: Stock showing 0 despite having data

**Debug Steps:**
```bash
# Check if stock moves exist
db.stockmoves.find({product: ObjectId("...")}).count()

# Check move status
db.stockmoves.find({product: ObjectId("...")}).pretty()
# Look for: status should be "done"

# Check move types
# Should have "in" and/or "out" moves
```

**Fix:**
1. Ensure operation is marked as "Done"
2. Create new receipt/delivery and validate
3. Refresh dashboard

---

### Issue: Reports show 404 error

**Debug Steps:**
```bash
# Check backend logs
# Should show: "Connected to MongoDB"

# Verify route exists
curl http://localhost:5000/api/reports/products \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return JSON with product data
```

**Fix:**
1. Restart backend: `npm start`
2. Verify reports.js file exists
3. Check server.js has reports route

---

### Issue: Stock moves not being created

**Debug Steps:**
1. Create receipt → Mark Ready → Validate
2. Check browser console (F12) for errors
3. Check backend logs for error messages

**Fix:**
1. Ensure all fields are filled
2. User has admin/manager role
3. Warehouse and location exist

---

## 📋 Final Checklist

- [ ] Dashboard shows correct stock numbers
- [ ] Low stock alerts appear correctly
- [ ] Out of stock shows when stock=0
- [ ] Receipts increase stock
- [ ] Deliveries decrease stock
- [ ] Transfers update locations only
- [ ] Adjustments fix discrepancies
- [ ] Reports show accurate data
- [ ] Move history has complete audit trail
- [ ] All operations validate correctly

---

## 🎉 Success Criteria

All tests PASS when:
1. ✅ Stock calculations are accurate
2. ✅ All operation types work (Receipt, Delivery, Transfer, Adjustment)
3. ✅ Dashboard KPIs match database
4. ✅ Reports show real data
5. ✅ Alerts trigger correctly
6. ✅ No console errors
7. ✅ No database errors
8. ✅ Complete audit trail maintained

**Status: PRODUCTION READY** 🚀

