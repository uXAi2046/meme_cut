# BlockSlice - Product Requirement Document (PRD)

## 1. Product Overview
**BlockSlice** is a web-based image processing tool designed to split/slice images into smaller grid blocks. It is commonly used for creating "grid" posts for Instagram, splitting panoramic images for carousels, or creating meme formats.

## 2. User Flow
1.  **Landing**: User sees a clean upload interface.
2.  **Upload**: User drags & drops an image or clicks to select one.
3.  **Configure**: User selects how to slice the image (e.g., 3 columns x 2 rows).
4.  **Preview**: User sees a visual grid overlay on their image.
5.  **Download**: User downloads the resulting slices (individually or as a ZIP).

## 3. Functional Requirements

### 3.1 Image Upload
*   **Interface**: Central drag-and-drop zone.
*   **Actions**: Drag & drop file, Click to open file dialog.
*   **Validation**:
    *   **Formats**: JPG, PNG, WEBP.
    *   **Size Limit**: Maximum 10MB.
    *   **Error Handling**: Show toast/alert for invalid formats or oversized files.

### 3.2 Slicing Configuration
*   **Grid Settings**:
    *   Input for **Rows** (e.g., 1-10).
    *   Input for **Columns** (e.g., 1-10).
*   **Visual Feedback**:
    *   Render a grid overlay on the uploaded image in real-time as settings change.

### 3.3 Processing & Export
*   **Technology**: Client-side processing (Canvas API) for privacy and speed.
*   **Download Options**:
    *   **Download ZIP**: Package all slices into a single `images.zip` file.
    *   (Optional) **Download Individual**: Click to download specific blocks.

## 4. Technical Architecture
*   **Framework**: React (Vite) + TypeScript.
*   **Styling**: Tailwind CSS for a modern, responsive UI.
*   **Core Logic**: HTML5 Canvas API for image manipulation.
*   **Libraries**:
    *   `jszip`: For bundling slices.
    *   `file-saver`: For triggering downloads.
    *   `react-dropzone`: For robust upload handling.
