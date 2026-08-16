# Recipe Search App — AI-Assisted Development Log (FE-04)

Built independently as a React application using AI (GitHub Copilot, VS Code Agent mode) as a development assistant, following the same structure as the mentor's movie search app session — same architecture pattern, different domain (recipes instead of movies) and different API (TheMealDB instead of OMDb), to keep this build distinct from a direct copy.

**AI tool used:** GitHub Copilot in VS Code Agent mode (not Cursor/Claude Code — no paid plan available; mentor-approved with disclosure).

**Stack:** React + Vite, JavaScript, Tailwind CSS, TheMealDB API, Firebase Authentication + Firestore, react-hook-form + zod for form validation.

---

## How AI assisted throughout

AI (Copilot) wrote the majority of the implementation code, working prompt-by-prompt through a structured build order: project scaffold → Header → API service layer → Home page with search and random recipes → reusable RecipeCard → Firebase setup → favourites logic → authentication (service, form, context) → protected routing → logout. Each prompt was scoped narrowly (e.g. "only create X, do not add Y yet") to keep AI from making unrequested assumptions or scope creep — a lesson carried over directly from the FE-03 vague-vs-precise prompting drill.

I also used Claude (chat) as a planning/troubleshooting layer alongside Copilot — to design the overall prompt sequence up front, adapt the mentor's original prompts to a new domain/stack, and diagnose bugs and environment issues that came up during the build (see Manual Corrections below).

## Prompts used, in order

### 1. Project setup
```
Initialize a new React application using Vite and JavaScript.
Use functional components only.
Set up Tailwind CSS.
Do not install any other UI library.
Do not add any recipe functionality yet.
```

### 2. Header
```
Create a reusable Header component in src/components/Header.jsx.
The Header should contain:
- a Home navigation link
- a Favourites navigation link
- a search input
- a Search button
Use React Router links for navigation.
Style it with Tailwind CSS.
Only create and display the Header. Do not create the Home or Favourites screens yet.
Do not connect the search input to any functionality.
```

### 3. MealDB service (empty + implementation)
```
Create a services folder and a file src/services/mealdbService.js.
Add a short comment explaining this file will handle communication with TheMealDB API.
Do not implement the API request yet.
```
```
Implement the recipe search request inside src/services/mealdbService.js.
Create an exported async function:
searchMeals(query)
Requirements:
- use TheMealDB API endpoint https://www.themealdb.com/api/json/v1/1/search.php?s=
- encode the search query
- return the meals array, or an empty array if no results
- throw a readable error if the HTTP request fails
Do not use React hooks. Do not manage loading, error, or component state here.
```

### 4. Home page hook
```
Create src/pages/Home.jsx and a custom hook src/hooks/useHomeRecipes.js.
useHomeRecipes should manage query, meals, loading, and error using useState,
and expose a handleSearch function that calls searchMeals from mealdbService.
Do not render JSX inside the hook. Do not call fetch directly.
```

### 5. Random meals on load
```
Add a function fetchRandomMeals() inside mealdbService.js.
Requirements:
- fetch at least 12 meals using TheMealDB's random.php endpoint, called multiple times
- run requests in parallel using Promise.all
- remove duplicates using idMeal
- return the final unique list
Use this to automatically load meals into Home when the app opens, before any search happens.
```

### 6. Home view
```
Implement Home.jsx using useHomeRecipes.
- do not add a search input here, the Header already has one
- show a loading message while loading is true
- show the error message when error exists
- render the meal list using .map()
- display meal name, category/area, and thumbnail image
Do not create a reusable RecipeCard component yet.
```

### 7. RecipeCard component
```
Create src/components/RecipeCard.jsx.
Requirements:
- receive one meal object through props
- display thumbnail, name, and category
- add a Favourite button, but do not connect it yet
- style with Tailwind
- keep this component presentational only, no API calls
Update Home.jsx to render RecipeCard using .map().
```

### 8. Firebase setup
```
Create src/services/firebaseService.js.
Initialize Firebase using environment variables (Vite env, VITE_ prefix).
Export the database instance and auth instance using getFirestore and getAuth.
Do not add favourites logic or auth UI yet.
Also create a .env.example file with placeholder Firebase config keys.
```

### 9. Favourites functions in Firebase service
```
Add favourite management functions to firebaseService.js:
- addFavourite(userId, meal)
- removeFavourite(userId, mealId)
- getFavourites(userId)
Use this Firestore structure: users/{userId}/favourites/{mealId}
Throw a readable error when userId is missing.
Do not use React hooks here.
```

### 10. Auth service
```
Create src/services/authService.js.
Implement and export:
- registerUser(email, password)
- loginUser(email, password)
- logoutUser()
- subscribeToAuthChanges(callback)
Use Firebase Authentication (createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged).
Convert Firebase errors into readable messages.
Do not use React hooks or render JSX.
```

### 11. Auth page with react-hook-form + zod
```
Create src/pages/Auth.jsx using react-hook-form and zod for validation.
Requirements:
- email field (required, valid email)
- password field (required, min 6 characters)
- toggle between Login and Register mode
- call loginUser or registerUser from authService on submit
- show loading state and readable errors
Do not use plain useState for form fields.
```

### 12. Auth context
```
Create src/context/AuthContext.jsx.
- subscribe to auth changes via authService
- expose user, authLoading, and logout
- wrap the app with AuthProvider
- unsubscribe on unmount
```

### 13. Routing + protected favourites
```
Set up routing:
- "/" renders Home (public)
- "/auth" renders Auth
- "/favourites" renders Favourites, but redirect unauthenticated users to /auth
- redirect authenticated users away from /auth to /
Keep the Header visible on every page.
Use user and authLoading from AuthContext.
```

### 14. Favourites page + connect Favourite button
```
Create src/hooks/useFavourites.js and src/pages/Favourites.jsx.
useFavourites should load the current user's favourites on mount using getFavourites,
and expose a removeFavourite(mealId) function.
Favourites.jsx should show loading, error, an empty-state message, and render RecipeCard for each favourite.
```
```
Connect the Favourite button on RecipeCard to addFavourite/removeFavourite.
If the user is not logged in and clicks Favourite, redirect them to /auth.
```

### 15. Logout button
```
Add a Logout button to the Header, visible only when the user is authenticated.
Connect it to the logout function from AuthContext.
```

### 16. Bug fix — search not connected
```
Currently, the search input and Search button inside Header.jsx are not connected to any functionality.

Update the app so that:
- Header receives a query value and onQueryChange and onSearch functions as props
- typing in the search input updates the query
- clicking Search (or pressing Enter) triggers the search
- Home.jsx passes its query, setQuery, and handleSearch from useHomeRecipes into Header
- searching should replace the "Popular recipes" list with the search results
- if the search box is cleared, show the random popular recipes again

Do not duplicate state — Header should stay a controlled/presentational component driven by props from Home.
```

### 17. Bug fix — duplicate Header
```
There are currently two Header components rendering on the page — one empty/non-functional search bar and one working one below it.

Find where Header is being rendered more than once (likely in both App.jsx and inside a page component like Home.jsx or a layout/route wrapper) and remove the duplicate.

Header should render exactly once, at the top level (in App.jsx or a shared Layout component), and every page (Home, Favourites, Auth) should reuse that single instance — not render its own Header.
```

### 18. Performance fix — slow random recipe loading
```
The initial recipe loading on Home is slow.

Update fetchRandomMeals() in mealdbService.js so it:
- fires all random.php requests simultaneously using Promise.all (not sequentially)
- only calls it as many times as necessary to reliably get 12-20 unique meals
- add console.time/console.timeEnd around the fetch so we can confirm timing

Do not change any other behavior.
```

---

## Manual corrections, debugging, and lessons learned

AI-generated code got most of the app working correctly on the first pass, but several issues required manual diagnosis and correction — some in the code itself, some in the surrounding dev environment:

1. **Search input not wired to functionality.** Prompt 2 deliberately told Copilot not to connect the search input yet (to build incrementally), but the follow-up prompt to wire it in (#16) wasn't sent until testing revealed the search box did nothing. Root cause: Header was built as a fully standalone component and never received the props needed to control search state from Home.

2. **Duplicate Header bug introduced by the AI's own fix.** While fixing the search-wiring issue above, Copilot's edit left a second, non-functional Header rendering above the working one (likely from editing both a page-level and app-level render location without removing the redundant one). Caught by visual inspection in the browser, not by Copilot itself — required an explicit follow-up prompt to locate and remove the duplicate render.

3. **Slow initial recipe load.** `fetchRandomMeals()` was technically using `Promise.all`, but the number of round trips to TheMealDB's single-result `random.php` endpoint made the first load noticeably slow. Diagnosed by observation (not console errors) and fixed with a targeted prompt asking for parallel execution and a capped number of calls, plus timing instrumentation to verify.

4. **`.env` PowerShell encoding bug (BOM).** After entering real Firebase config values into `.env`, the app still threw `auth/invalid-api-key`. Root cause: writing the file via PowerShell's `Out-File -Encoding utf8` prepends a UTF-8 byte-order-mark (BOM), which corrupted the first environment variable name so Firebase read it as undefined. Fixed by rewriting the file with `Set-Content -Encoding ascii` instead. This was diagnosed manually by comparing file content vs. expected values, not something the AI assistant caught on its own.

5. **Git worktree / branch mismanagement (biggest manual intervention).** GitHub Copilot's Agent mode silently created its own git worktree (`agents/react-vite-tailwind-setup`) and made all of its file edits there, while the terminal and file explorer appeared to be working in the intended `feature/recipe-search-app` branch. This caused:
   - A prolonged white-screen/empty-app debugging session, since the dev server was serving an empty scaffold while all real work sat in a different, undiscovered worktree.
   - The need to manually run `git worktree list` to discover the mismatch, locate the actual working code, and confirm it was intact.
   - A manual `git add` + `git commit` inside the agent's worktree (nothing had been committed there), followed by switching to the real branch, deleting a stray empty scaffold folder that blocked the merge, and running `git merge agents/react-vite-tailwind-setup` as a fast-forward merge to bring the real code into the tracked branch.
   - Cleanup of unrelated noise: a stray one-line whitespace edit to `CLAUDE.md`, and an accidental empty `package-lock.json` created at the repo root.
   
   This was entirely a manual diagnosis-and-fix process; the AI assistant had no visibility into or awareness of its own worktree behavior.

6. **OneDrive file-lock interference with git.** Several git operations (branch rename, branch delete, commit) triggered repeated "Deletion of directory failed, should I try again? (y/n)" prompts, caused by OneDrive's background sync locking `.git` internals mid-operation. Required repeatedly declining retries and, in one case, using a create-new-branch-then-delete-old-branch approach instead of an in-place rename to avoid the lock entirely.

**Overall takeaway:** AI-generated application code (components, hooks, services, Firebase/auth logic) was largely correct and required only small, targeted fixes. The most significant manual effort in this assignment was environment and git tooling — specifically Copilot Agent mode's tendency to work in an isolated worktree without clearly surfacing that to the user, combined with OneDrive-induced git friction. Documenting and diagnosing *where the code actually was* took longer than most of the actual coding fixes.
