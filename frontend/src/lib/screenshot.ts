"use client";

import html2canvas from "html2canvas";

/**
 * Capture a screenshot of the current page viewport.
 *
 * By default we capture document.body; you can pass a specific element if needed.
 */
export async function capturePageScreenshot(
  target?: HTMLElement | null,
): Promise<string> {
  const element = target ?? document.body;
  if (!element) {
    throw new Error("No element available to capture screenshot.");
  }

  const canvas = await html2canvas(element, {
    allowTaint: true,
  });

  // Return data URL (PNG)
  return canvas.toDataURL("image/png");
}