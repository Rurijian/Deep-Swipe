# Deep Swipe Extension - Agent Workflow Notes

## Important: Git Repository Location

**DO NOT USE GIT IN THIS FOLDER**

This folder (`h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe`) is for **testing only**.

The actual Git repository is located at:
```
h:\Silly\Deep-Swipe
```

## Workflow

1. **Edit files in THIS folder** (SillyTavern extension folder) for testing
2. **Test your changes** in SillyTavern
3. **When ready to commit**, copy files to the Git repository:
   ```cmd
   copy "h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe\index.js" "h:\Silly\Deep-Swipe\index.js"
   copy "h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe\manifest.json" "h:\Silly\Deep-Swipe\manifest.json"
   copy "h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe\settings.html" "h:\Silly\Deep-Swipe\settings.html"
   copy "h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe\style.css" "h:\Silly\Deep-Swipe\style.css"
   copy "h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe\README.md" "h:\Silly\Deep-Swipe\README.md"
   ```
4. **Commit and push** from `h:\Silly\Deep-Swipe`:
   ```cmd
   cd h:\Silly\Deep-Swipe
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```

## Repository Information

- **GitHub URL:** https://github.com/Rurijian/Deep-Swipe
- **Local Git Repo:** `h:\Silly\Deep-Swipe`
- **Testing Folder:** `h:\Silly\SillyTavern\public\scripts\extensions\third-party\deep-swipe` (this folder)

## Branches

- `master` - Main/stable branch (default)
- `dev` - Development branch (for experimental features)

## Important Notes

- The `.git` folder in this directory belongs to SillyTavern's main repository, NOT the Deep-Swipe extension
- Never run `git init`, `git add`, `git commit`, or `git push` from this folder
- Always use `h:\Silly\Deep-Swipe` for git operations
