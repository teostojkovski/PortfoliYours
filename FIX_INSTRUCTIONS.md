# Fix Prisma Client Error - Complete Instructions

## The Error
```
PANIC: called `Option::unwrap()` on a `None` value
```

This happens because the Prisma client is out of sync with the schema.

## Solution 1: Use the PowerShell Script (Easiest)

1. **Stop your dev server** (Ctrl+C)
2. **Run the fix script:**
   ```powershell
   .\fix-prisma-complete.ps1
   ```
   Or:
   ```bash
   npm run fix:prisma
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Solution 2: Manual Steps

### Step 1: Stop Everything
- Press `Ctrl+C` in ALL terminals running `npm run dev`
- Open Task Manager (Ctrl+Shift+Esc)
- End any `node.exe` processes
- Wait 5 seconds

### Step 2: Clear Caches (PowerShell)
Open PowerShell in your project folder and run:

```powershell
# Delete Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Delete Prisma cache
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue

# Verify they're gone
Write-Host "Caches cleared!"
```

### Step 3: Regenerate Prisma
```bash
npx prisma generate
```

### Step 4: Sync Database
```bash
npx prisma db push
```

### Step 5: Restart
```bash
npm run dev
```

## Why This Happens

When we added `selectedExperienceIds` and `selectedCvId` to the schema:
1. The database was updated (via `prisma db push`)
2. But the Prisma client wasn't regenerated properly
3. Next.js cached the old Prisma client in `.next` folder
4. The running dev server locked Prisma files

## Verification

After fixing, the error should be gone. The public profile page should load correctly.

