# ESLint Errors Fix TODO

## Tasks to Complete

- [ ] Edit src/app/seller/page.tsx:
  - [ ] Remove unused Fragment import
  - [ ] Define BusyTime interface
  - [ ] Replace any types with proper types for busyTimes and map
  - [ ] Move conditional useEffect to top level
  - [ ] Replace <img> with <Image>
  - [ ] Escape apostrophe in "you're"

- [ ] Edit src/app/buyer/page.tsx:
  - [ ] Add eslint disable for slotTime modification

- [ ] Edit src/app/api/auth/[...nextauth]/route.ts:
  - [ ] Import JWT and Session types from next-auth
  - [ ] Use proper types for callback parameters

- [ ] Edit src/app/page.tsx:
  - [ ] Escape apostrophe in "I'm"

- [ ] Run npm run build to verify fixes
