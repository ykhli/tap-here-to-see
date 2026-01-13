// Tap to See Vertically - Main Application
// Powered by Google Gemini's Nano Banana 🍌

class TapToSeeVertically {
  constructor() {
    this.apiKey = localStorage.getItem("gemini_api_key") || "";
    this.originalImage = null;
    this.slicedCanvases = [];

    this.initElements();
    this.initEventListeners();
    this.restoreApiKey();
  }

  initElements() {
    this.apiKeyInput = document.getElementById("apiKey");
    this.promptInput = document.getElementById("prompt");
    this.generateBtn = document.getElementById("generateBtn");
    this.uploadZone = document.getElementById("uploadZone");
    this.fileInput = document.getElementById("fileInput");
    this.previewSection = document.getElementById("previewSection");
    this.originalPreview = document.getElementById("originalPreview");
    this.loadingOverlay = document.getElementById("loadingOverlay");
    this.loadingText = document.getElementById("loadingText");
    this.downloadAllBtn = document.getElementById("downloadAllBtn");

    // Padding controls
    this.paddingControls = document.getElementById("paddingControls");
    this.paddingSlider = document.getElementById("paddingSlider");
    this.paddingValue = document.getElementById("paddingValue");
    this.reprocessBtn = document.getElementById("reprocessBtn");
    this.positionButtons = document.querySelectorAll(".position-btn");
    this.formatButtons = document.querySelectorAll(".format-btn");
    this.formatHint = document.getElementById("formatHint");

    // Padding settings (50 = centered, 0 = shift up, 100 = shift down)
    this.paddingPercent = 50;
    this.contentPosition = "center"; // 'center', 'top', 'bottom'
    this.outputFormat = "landscape"; // 'landscape' (16:9) or 'portrait' (9:16)

    this.sliceCanvases = [
      document.getElementById("slice1"),
      document.getElementById("slice2"),
      document.getElementById("slice3"),
      document.getElementById("slice4"),
    ];
  }

  initEventListeners() {
    // API Key persistence
    this.apiKeyInput.addEventListener("input", (e) => {
      this.apiKey = e.target.value;
      localStorage.setItem("gemini_api_key", this.apiKey);
    });

    // Generate button
    this.generateBtn.addEventListener("click", () => this.generateImage());

    // Upload zone
    this.uploadZone.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileUpload(e));

    // Drag and drop
    this.uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.uploadZone.classList.add("drag-over");
    });

    this.uploadZone.addEventListener("dragleave", () => {
      this.uploadZone.classList.remove("drag-over");
    });

    this.uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this.processImageFile(file);
      }
    });

    // Download buttons
    document.querySelectorAll("[data-slice]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const sliceNum = parseInt(e.currentTarget.dataset.slice);
        this.downloadSlice(sliceNum);
      });
    });

    this.downloadAllBtn.addEventListener("click", () =>
      this.downloadAllAsZip()
    );

    // Padding controls
    this.paddingSlider.addEventListener("input", (e) => {
      this.paddingPercent = parseInt(e.target.value);
      this.paddingValue.textContent = this.paddingPercent;
    });

    this.positionButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.positionButtons.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.contentPosition = e.currentTarget.dataset.position;
      });
    });

    // Format buttons (landscape vs portrait)
    this.formatButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.formatButtons.forEach((b) => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.outputFormat = e.currentTarget.dataset.format;

        // Update hint text
        if (this.formatHint) {
          if (this.outputFormat === "landscape") {
            this.formatHint.textContent =
              "Wide 1920×1080 - X stacks these vertically when expanded";
          } else {
            this.formatHint.textContent =
              "Tall 1080×1920 - Content hidden in top/bottom zones";
          }
        }
      });
    });

    this.reprocessBtn.addEventListener("click", () => {
      console.log("Reprocess clicked", {
        hasImage: !!this.originalImage,
        padding: this.paddingPercent,
        position: this.contentPosition,
      });
      if (this.originalImage) {
        this.sliceImage(this.originalImage);
        this.showToast(
          `Reprocessed! Padding: ${this.paddingPercent}%, Position: ${this.contentPosition}`
        );
      } else {
        this.showToast("No image loaded yet", "error");
      }
    });
  }

  restoreApiKey() {
    if (this.apiKey) {
      this.apiKeyInput.value = this.apiKey;
    }
  }

  showLoading(text = "Processing...") {
    this.loadingText.textContent = text;
    this.loadingOverlay.style.display = "flex";
  }

  hideLoading() {
    this.loadingOverlay.style.display = "none";
  }

  showToast(message, type = "success") {
    const container =
      document.getElementById("toastContainer") || document.body;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === "success" ? "✓" : "✕"}</span>
      <span class="toast-message">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
  }

  async generateImage() {
    const prompt = this.promptInput.value.trim();

    if (!this.apiKey) {
      this.showToast("Please enter your Gemini API key", "error");
      return;
    }

    if (!prompt) {
      this.showToast("Please enter an image description", "error");
      return;
    }

    this.showLoading("Generating with Nano Banana 🍌...");
    this.generateBtn.disabled = true;

    try {
      // Enhance prompt for vertical composition
      const enhancedPrompt = `${prompt}. Vertical portrait composition, continuous flowing design from top to bottom, suitable for being split into 4 vertical sections that will be viewed in sequence. Tall 9:16 aspect ratio. Do NOT include any borders, panel lines, separators, or dividers; make the artwork continuous with no horizontal or vertical lines.`;

      // Use Gemini's Nano Banana (gemini-2.5-flash-image) for image generation
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              imageConfig: {
                aspectRatio: "9:16", // Tall vertical format: 768x1344
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate image");
      }

      const data = await response.json();

      // Find the image part in the response
      const candidates = data.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error("No image was generated. Try a different prompt.");
      }

      const parts = candidates[0].content?.parts;
      if (!parts) {
        throw new Error("Invalid response from Gemini API");
      }

      // Find the inline image data
      let imageBase64 = null;
      let mimeType = "image/png";

      for (const part of parts) {
        if (part.inlineData) {
          imageBase64 = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          break;
        }
      }

      if (!imageBase64) {
        // Check if there's text feedback instead (content policy, etc.)
        const textPart = parts.find((p) => p.text);
        if (textPart) {
          throw new Error(textPart.text || "Image generation failed");
        }
        throw new Error("No image data in response. Try a different prompt.");
      }

      const imageUrl = `data:${mimeType};base64,${imageBase64}`;

      await this.loadAndProcessImage(imageUrl);
      this.showToast("Image generated successfully! 🍌");
    } catch (error) {
      console.error("Generation error:", error);
      this.showToast(error.message || "Failed to generate image", "error");
    } finally {
      this.generateBtn.disabled = false;
      this.hideLoading();
    }
  }

  handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      this.processImageFile(file);
    }
  }

  processImageFile(file) {
    this.showLoading("Processing your image...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      await this.loadAndProcessImage(e.target.result);
      this.hideLoading();
      this.showToast("Image processed successfully!");
    };
    reader.onerror = () => {
      this.hideLoading();
      this.showToast("Failed to read image file", "error");
    };
    reader.readAsDataURL(file);
  }

  async loadAndProcessImage(imageUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        this.originalImage = img;
        this.originalPreview.src = imageUrl;
        this.sliceImage(img);
        this.paddingControls.style.display = "block";
        this.previewSection.style.display = "block";
        this.previewSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        resolve();
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = imageUrl;
    });
  }

  sliceImage(img) {
    /*
     * X/Twitter "Tap to See Vertically" Effect
     *
     * TWO APPROACHES:
     *
     * 1. LANDSCAPE (16:9) - 1920×1080
     *    - Wide images that X stacks VERTICALLY when expanded
     *    - This is what @poorlycatdraw used successfully
     *    - Simple: just slice and scale to 16:9
     *
     * 2. PORTRAIT (9:16) - 1080×1920
     *    - Uses hidden zones trick
     *    - Safe zone: Y=690-1230 (middle 540px visible in 2x2 grid)
     *    - Hidden: top 690px, bottom 690px
     */

    const sourceWidth = img.width;
    const sourceHeight = img.height;

    // Choose dimensions based on format
    let outputWidth, outputHeight;

    if (this.outputFormat === "landscape") {
      // WIDE 16:9 - X stacks these vertically on expand
      outputWidth = 1920;
      outputHeight = 1080;
    } else {
      // TALL 9:16 - Uses hidden zones trick
      outputWidth = 1080;
      outputHeight = 1920;
    }

    // Divide source into 4 strips
    const stripHeight = sourceHeight / 4;

    // Show padding controls
    this.paddingControls.style.display = "block";

    for (let i = 0; i < 4; i++) {
      const canvas = this.sliceCanvases[i];
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Clear and fill background
      ctx.clearRect(0, 0, outputWidth, outputHeight);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Calculate source strip
      const srcY = i * stripHeight;
      const srcH = stripHeight;

      if (this.outputFormat === "landscape") {
        // LANDSCAPE MODE: Scale strip to fill 16:9 canvas
        // Maintain aspect ratio - use "cover" approach (no stretching)

        const srcAspect = sourceWidth / srcH;
        const destAspect = outputWidth / outputHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (srcAspect > destAspect) {
          // Source is wider - fit height, crop sides
          drawHeight = outputHeight;
          drawWidth = Math.floor(sourceWidth * (outputHeight / srcH));
          drawX = Math.floor((outputWidth - drawWidth) / 2);
          drawY = 0;
        } else {
          // Source is taller - fit width, crop top/bottom
          drawWidth = outputWidth;
          drawHeight = Math.floor(srcH * (outputWidth / sourceWidth));
          drawX = 0;
          drawY = Math.floor((outputHeight - drawHeight) / 2);
        }

        ctx.drawImage(
          img,
          0,
          srcY,
          sourceWidth,
          srcH, // Source strip
          drawX,
          drawY,
          drawWidth,
          drawHeight // Scaled maintaining aspect ratio
        );
      } else {
        // PORTRAIT MODE: Position in safe zone
        const safeZoneTop = 690;
        const safeZoneHeight = 540;

        // Scale to fit width
        const scale = outputWidth / sourceWidth;
        const scaledHeight = Math.floor(srcH * scale);

        // Center in safe zone
        let destY =
          safeZoneTop + Math.floor((safeZoneHeight - scaledHeight) / 2);

        // Apply offset from slider
        const maxOffset = 400;
        const offsetPixels = Math.floor(
          ((this.paddingPercent - 50) / 50) * maxOffset
        );
        destY += offsetPixels;

        // Apply position preset
        const presetOffset = 150;
        if (this.contentPosition === "top") destY -= presetOffset;
        if (this.contentPosition === "bottom") destY += presetOffset;

        // Clamp
        destY = Math.max(0, Math.min(destY, outputHeight - scaledHeight));

        ctx.drawImage(
          img,
          0,
          srcY,
          sourceWidth,
          srcH,
          0,
          destY,
          outputWidth,
          scaledHeight
        );
      }

      this.slicedCanvases[i] = canvas;
    }

    console.log("Sliced with:", {
      format: this.outputFormat,
      outputSize: `${outputWidth}×${outputHeight}`,
      position: this.contentPosition,
      padding: this.paddingPercent,
    });
  }

  downloadSlice(sliceNum) {
    const canvas = this.sliceCanvases[sliceNum - 1];
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `tap-to-see-${sliceNum}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    this.showToast(`Downloaded image ${sliceNum}`);
  }

  async downloadAllAsZip() {
    this.showLoading("Creating ZIP file...");

    try {
      const zip = new JSZip();

      for (let i = 0; i < 4; i++) {
        const canvas = this.sliceCanvases[i];
        if (!canvas) continue;

        // Convert canvas to blob
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png");
        });

        // Use PNG for best quality (avoids compression artifacts at crop boundaries)
        zip.file(`${i + 1}-tap-to-see.png`, blob);
      }

      // Add a readme
      const readme = `Tap to See Vertically - Twitter Image Pack
==========================================

How to use:
1. Go to Twitter/X and create a new tweet
2. Click the image icon to attach images
3. Add the images IN ORDER: 1, 2, 3, 4
4. Post your tweet!

When followers tap your post, they'll see the images 
expand vertically to reveal the full picture.

Tip: Write something intriguing like "tap to see" or 
"I haven't - tap to see" to encourage interaction!

Generated with Tap to See Vertically Generator
`;
      zip.file("README.txt", readme);

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const link = document.createElement("a");
      link.download = "tap-to-see-vertically.zip";
      link.href = URL.createObjectURL(zipBlob);
      link.click();

      URL.revokeObjectURL(link.href);
      this.showToast("ZIP downloaded! Ready to post on Twitter");
    } catch (error) {
      console.error("ZIP error:", error);
      this.showToast("Failed to create ZIP file", "error");
    } finally {
      this.hideLoading();
    }
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  new TapToSeeVertically();
});
