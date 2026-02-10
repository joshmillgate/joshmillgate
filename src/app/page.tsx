import fs from "fs";
import path from "path";
import HomeContent from "./HomeContent";

interface ImageData {
  src: string;
  alt: string;
  type: "screen" | "component";
  order: number;
  noPaddingBottom: boolean;
  crop: boolean;
}

// Helper to convert filename to readable alt text
function filenameToAlt(filename: string): string {
  // Remove extension
  let name = filename.replace(/\.[^/.]+$/, "");
  // Remove numeric prefix like "01-" or "1-"
  name = name.replace(/^\d+-/, "");
  // Remove modifiers (pb0, crop)
  name = name.replace(/-?(pb0|crop)(?=-|$)/gi, "");
  // Replace dashes/underscores with spaces
  name = name.replace(/[-_]/g, " ").trim();
  // Capitalize first letter of each word
  return name
    .split(" ")
    .filter(word => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Check if filename contains pb0 (for no padding bottom)
function hasNoPaddingBottom(filename: string): boolean {
  const name = filename.replace(/\.[^/.]+$/, "");
  return /(-|^)pb0(-|$)/i.test(name);
}

// Check if filename contains crop (for cropped images)
function hasCrop(filename: string): boolean {
  const name = filename.replace(/\.[^/.]+$/, "");
  return /(-|^)crop(-|$)/i.test(name);
}

// Extract sort order from filename (e.g., "01-name.png" -> 1)
function getSortOrder(filename: string): number {
  const match = filename.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : Infinity;
}

// Reads all PNG/JPG images from a directory with type info
function getImagesFromDirectory(dirName: string, type: "screen" | "component"): ImageData[] {
  const publicDir = path.join(process.cwd(), "public", "images", dirName);

  try {
    if (!fs.existsSync(publicDir)) {
      return [];
    }

    const files = fs.readdirSync(publicDir);
    const imageFiles = files.filter((file) =>
      /\.(png|jpg|jpeg|webp)$/i.test(file)
    );

    return imageFiles.map((file) => ({
      src: `/images/${dirName}/${file}`,
      alt: filenameToAlt(file),
      type,
      order: getSortOrder(file),
      noPaddingBottom: hasNoPaddingBottom(file),
      crop: hasCrop(file),
    }));
  } catch {
    return [];
  }
}

export default function Home() {
  // Dynamically discover images from both folders
  const screenImages = getImagesFromDirectory("screens", "screen");
  const componentImages = getImagesFromDirectory("components", "component");

  // Merge all images and sort globally by order
  const allImages = [...screenImages, ...componentImages].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.alt.localeCompare(b.alt);
  });

  return <HomeContent images={allImages} />;
}
