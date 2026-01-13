# Tap to See Vertically ↕

Create viral 4-panel reveal posts for X/Twitter. Upload a tall image, slice it into 4 parts, and watch the magic happen when followers tap to expand!

![Made for X](https://img.shields.io/badge/Made%20for-X%2FTwitter-black)
![Powered by](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)

## 🚀 Quick Start

### Option 1: Open Directly

Just open `index.html` in your browser - no server needed for basic functionality!

### Option 2: Local Server (Recommended)

```bash
# Navigate to the project folder
cd tap-to-see-vertically

# Start a local server (Python 3)
python3 -m http.server 5555

# Or with Node.js
npx serve -p 5555
```

Then open: **http://localhost:5555**

## 📖 How It Works

When you post 4 images on X/Twitter:

1. **Feed View:** Images appear in a 2×2 grid
2. **Tap to Expand:** Images stack vertically, revealing the full picture!

This tool slices your tall image into 4 optimized parts that create a seamless reveal effect.

## 🎯 Usage

### Step 1: Create or Upload an Image

- **AI Generation:** Enter your Gemini API key and describe your image
- **Upload:** Drop any tall vertical image (9:16 or taller works best)

### Step 2: Choose Output Format

| Format          | Dimensions | Best For                           |
| --------------- | ---------- | ---------------------------------- |
| **Wide (16:9)** | 1920×1080  | X stacks these vertically on tap ✓ |
| **Tall (9:16)** | 1080×1920  | Hidden zones trick                 |

**Recommended:** Start with **Wide (16:9)** - it's more reliable.

### Step 3: Download & Post

1. Download all 4 PNG images
2. Create new post on X
3. Attach images **in order: 1, 2, 3, 4**
4. Add a caption like _"tap to see ↕"_
5. Post!

## 📐 X/Twitter Grid Layout

When you upload 4 images, they appear like this:

```
┌─────┬─────┐
│  1  │  2  │
├─────┼─────┤
│  3  │  4  │
└─────┴─────┘
```

When tapped, they expand vertically: **1 → 2 → 3 → 4**

## 🔑 Getting a Gemini API Key (Free!)

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)
5. Paste into the app

Your key is stored locally in your browser and never sent anywhere except Google's servers.

## 🛠 Technical Details

### Output Specifications

**Wide Format (16:9):**

- Dimensions: 1920 × 1080 pixels
- X displays these stacked vertically when expanded

**Tall Format (9:16):**

- Dimensions: 1080 × 1920 pixels
- Visible zone: Y=690 to Y=1230 (center 540px)
- Hidden zones: Top 690px, bottom 690px

### Files

```
tap-to-see-vertically/
├── index.html      # Main UI
├── styles.css      # Styling
├── app.js          # Application logic
└── README.md       # This file
```

## 💡 Tips for Best Results

1. **Use tall source images** - 9:16 ratio or taller
2. **Keep subjects centered** - Important content should be in the middle
3. **Avoid text on edges** - It might get cropped
4. **Use PNG format** - Prevents compression artifacts at boundaries
5. **Test on mobile** - The effect works best on the X mobile app

## 🐛 Troubleshooting

**Images not stacking vertically?**

- Try the "Wide (16:9)" format
- Make sure you uploaded exactly 4 images
- Check that you uploaded in order: 1, 2, 3, 4

**API key not working?**

- Make sure it starts with `AIza`
- Check that you have the Gemini API enabled
- Try generating a new key

**Images look stretched?**

- The app now maintains aspect ratio automatically
- If issues persist, try a source image closer to 9:16 ratio

## 📝 License

MIT License - Feel free to use, modify, and share!

---
