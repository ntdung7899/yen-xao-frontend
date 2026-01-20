# 📋 INSTALLATION GUIDE

## System Requirements

- Node.js >= 16.0.0
- npm >= 7.0.0 or yarn >= 1.22.0

## Installation Steps

### Step 1: Navigate to project directory

```bash
cd /Users/a410/Desktop/Project/yen-xao-frontend
```

### Step 2: Install dependencies

```bash
npm install
```

This will install all required packages from `package.json`:

**Core dependencies:**
- react (^18.2.0)
- react-dom (^18.2.0)
- react-router-dom (^6.21.1)
- antd (^5.12.8) - UI Component Library
- @ant-design/icons (^5.2.6)
- react-hook-form (^7.49.3) - Form management
- yup (^1.3.3) - Validation
- @hookform/resolvers (^3.3.4)
- dayjs (^1.11.10) - Date utility

**Dev dependencies:**
- vite (^5.0.11) - Build tool
- typescript (^5.3.3)
- @vitejs/plugin-react (^4.2.1)
- eslint + typescript-eslint

### Step 3: Start development server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 4: Open in browser

Visit: http://localhost:3000

You should see the Employee List page with sidebar navigation.

## Verify Installation

### Check if all pages work:

1. **Employees** - http://localhost:3000/hr/employees
   - Should show table with 16 employees
   - Try search, filters, view details

2. **Departments** - http://localhost:3000/hr/departments
   - Should show 5 department cards
   - Try add/edit/delete

3. **Positions** - http://localhost:3000/hr/positions
   - Should show table with 8 positions
   - Try CRUD operations

### Expected console output:

```
VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Build for Production

```bash
# Create production build
npm run build

# Output will be in dist/ folder
```

Preview production build:

```bash
npm run preview
```

## Troubleshooting

### Issue: Port 3000 already in use

**Solution:** Edit `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 3001, // Change port
  },
})
```

### Issue: Module not found errors

**Solution:** Delete node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution:** Check TypeScript configuration:

```bash
npx tsc --noEmit
```

### Issue: Vite not found

**Solution:** Install Vite globally or use npx:

```bash
npm install -g vite
# or
npx vite
```

## Project Structure Overview

```
yen-xao-frontend/
├── public/                 # Static files
│   └── vite.svg
├── src/
│   ├── components/         # React components
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── pages/              # Page components
│   │   └── hr/
│   │       ├── EmployeeList.tsx
│   │       ├── EmployeeDetail.tsx
│   │       ├── DepartmentList.tsx
│   │       └── PositionList.tsx
│   ├── types/              # TypeScript types
│   │   └── hr.types.ts
│   ├── data/               # Mock data
│   │   └── mockData.ts
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── constants/          # Constants
│   │   └── hr.constants.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite types
├── index.html              # HTML entry
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── .eslintrc.cjs           # ESLint config
├── .gitignore              # Git ignore
└── README.md               # Documentation
```

## Development Workflow

### 1. Make changes to source files
Edit files in `src/` folder

### 2. Hot reload automatically updates
Vite will automatically reload the page

### 3. Check for errors
Look at browser console and terminal

### 4. Build before deployment
```bash
npm run build
```

## Available Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## Next Steps

After successful installation:

1. ✅ Explore the Employee Management page
2. ✅ Try adding/editing departments and positions
3. ✅ Test responsive design (resize browser)
4. ✅ Check form validation
5. ✅ Read the code and understand structure
6. ✅ Customize theme colors in App.tsx
7. ✅ Add your own features

## Getting Help

If you encounter issues:

1. Check console for errors (F12 in browser)
2. Read error messages carefully
3. Google the error message
4. Check [Vite documentation](https://vitejs.dev/)
5. Check [React documentation](https://react.dev/)
6. Check [Ant Design documentation](https://ant.design/)

## Success Indicators

✅ No errors in terminal
✅ No errors in browser console
✅ Sidebar navigation visible
✅ Employee table shows data
✅ Can navigate between pages
✅ Modals open/close correctly
✅ Form validation works

---

**Installation complete! Happy coding! 🎉**
