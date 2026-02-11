# Auto Bookmark Tracker - Chrome Extension

Automatically updates your bookmarks to track your progress on websites like online courses, forums, and documentation.

## Features

- 📚 Track progress on online courses (Udemy, Coursera, etc.)
- 💬 Remember your place in long forum threads
- 📖 Auto-update bookmarks to the last page you visited
- ⚡ Simple path-based tracking
- 🔒 All data stored locally in your browser

## Installation

### Chrome/Edge/Brave

1. Download and extract this folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `bookmark-tracker` folder
6. Done! The extension icon should appear in your toolbar

### Firefox (requires minor modifications)

Firefox uses Manifest V2. You'll need to modify `manifest.json`:
- Change `"manifest_version": 3` to `"manifest_version": 2`
- Change `"service_worker"` to `"scripts": ["background.js"]`

Then:
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select any file in the `bookmark-tracker` folder

## How to Use

### Step 1: Add Paths to Track

1. Click the extension icon in your toolbar
2. Enter paths you want to track (one per line)
    ```
    udemy.com/course/python
    coursera.org/learn/machine-learning
    academy.nebius.com/trainer/ai-assisted-programming
    academy.nebius.com/trainer/net-course
    ```
3. Click "Save Paths"

### Step 2: Create Bookmarks

Create bookmarks for the pages you want to track on those paths. For example:
- Bookmark your current lesson in a Udemy course
- Bookmark a specific learning path in a training portal
- Bookmark documentation you're working through

### Step 3: Browse Normally

That's it! As you navigate through the site:
- Finish lesson 1, move to lesson 2 → bookmark updates to lesson 2
- Read to page 15 of a thread → bookmark updates to page 15
- Close tab and come back later → bookmark opens to your last position

## How It Works

The extension:
1. Monitors when you navigate on tracked paths
2. Finds bookmarks matching that path prefix
3. Silently updates the bookmark URL to your current page

**Important Notes:**
- Only works for paths you've added to the tracking list
- Only updates bookmarks that already exist for those paths
- Updates happen automatically as you browse (no manual saving needed)
- Works with any bookmark folder or location

## Tips

- **Keep bookmarks organized**: Create a "Progress Tracking" folder for these bookmarks
- **One bookmark per path**: The extension updates the most specific matching bookmark path
- **Full path matching**: Adding `example.com/learn` will only update bookmarks under `/learn`
- **Pin tabs alternative**: You can also just keep tabs open, but this uses less memory

## Privacy

- All data stays on your computer
- No external servers or tracking
- Only accesses bookmarks and tabs you explicitly track
- Open source - you can review all the code

## Troubleshooting

**Bookmark not updating?**
- Make sure the path is in your tracked list
- Check that a bookmark exists for that path
- Try reloading the extension

**Want to stop tracking a path?**
- Open the extension popup
- Remove the path from the list
- Click "Save Paths"

## Technical Details

- Uses Chrome Extensions API (Manifest V3)
- Permissions needed:
  - `bookmarks`: To read and update your bookmarks
  - `tabs`: To detect when you navigate to new pages
  - `storage`: To save your tracked paths list

## Support

If something isn't working, check:
1. Extension is enabled in `chrome://extensions/`
2. Path is spelled correctly (no http://, no www needed)
3. You have a bookmark for that path
4. Try refreshing the page after adding a new path

---

Enjoy tracking your progress! 🚀
