# Quick Guide: Reorder Parts on Admin Dashboard

## 🎯 Where to Find It
**Admin Dashboard → Repairs Tab → Inventory Status Card** (Right sidebar)

## 🚀 How to Reorder (3 Easy Ways)

### Method 1: Move Up ⬆️
```
Click the up arrow to move a part higher in the list
```
**Use Case:** Quickly promote a part one position

### Method 2: Move Down ⬇️
```
Click the down arrow to move a part lower in the list
```
**Use Case:** Quickly demote a part one position

### Method 3: Direct Edit 🔢
```
1. Click on the order number (e.g., #5)
2. Type new number (e.g., 1)
3. Press Enter ✓ or click checkmark
```
**Use Case:** Jump to specific position

## 💡 Tips

### Visual Indicators
- **Blue number on hover** = Click to edit
- **Grayed arrow** = Can't move (at top/bottom)
- **Loading spinner** = Update in progress

### Keyboard Shortcuts
- `Enter` = Save changes
- `Escape` = Cancel editing

### Order Logic
- **Lower numbers** = Show first on website
- **Higher numbers** = Show later
- Parts automatically re-sort after changes

## 📋 Example Workflow

**Goal:** Make "iPhone 14 Screen" the first part shown

**Current State:**
```
#3  iPhone 14 Screen   [Stock: 15]
#1  Samsung S23 Screen [Stock: 8]
#2  iPad Air Screen    [Stock: 12]
```

**Option A - Quick Arrows:**
1. Click ⬆️ on iPhone 14 Screen (moves to #2)
2. Click ⬆️ again (moves to #1)
3. Done! ✅

**Option B - Direct Edit:**
1. Click on `#3` next to iPhone 14 Screen
2. Type `1`
3. Press Enter
4. Done! ✅

**Result:**
```
#1  iPhone 14 Screen   [Stock: 15]  ← Now first!
#2  Samsung S23 Screen [Stock: 8]
#3  iPad Air Screen    [Stock: 12]
```

## 🎨 What You'll See

### Normal View
```
[⬆️]
#2  iPhone 14 Screen Replacement
[⬇️]  SKU: IP14-SCR-001            [Stock: 15]
```

### Editing Mode
```
[⬆️]
[1 ] ← Type here
[✓][✕] iPhone 14 Screen Replacement
[⬇️]    SKU: IP14-SCR-001            [Stock: 15]
```

## ⚡ Pro Tips

1. **Test Your Changes:** Order affects how parts appear on the website's parts catalog
2. **Top 5 Only:** Dashboard shows top 5 parts - use Inventory Modal for all parts
3. **Instant Updates:** Changes save immediately, no "Save" button needed
4. **Mobile Friendly:** Works on tablets and phones too

## 🔗 Need More Control?

For managing ALL parts with filters and search:
1. Click "Manage Inventory" button
2. Go to "Parts" tab
3. Same controls, but with full parts list

## ❓ FAQ

**Q: What if I make a mistake?**
A: Just edit the order number again or use arrows to fix it

**Q: Can I have duplicate order numbers?**
A: Yes, but they'll sort unpredictably. Best to use unique numbers.

**Q: Does this affect the website immediately?**
A: Yes! Parts catalog will re-sort based on new order.

**Q: What's the best numbering strategy?**
A: Use multiples of 10 (10, 20, 30...) to leave room for inserting new parts later

---

**Quick Reference Card:**
```
⬆️ = Move Up     | #N = Edit Order | ✓ = Save
⬇️ = Move Down   | ✕ = Cancel     | Enter = Save
                                  | Esc = Cancel
```

Happy organizing! 🎉
