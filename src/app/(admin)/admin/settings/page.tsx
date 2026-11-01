"use client";

import { useEffect, useState } from "react";
import { backgroundImages } from "@/config/background-images";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [selectedImage, setSelectedImage] = useState(
    backgroundImages[0]?.path ?? "",
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/settings");

        if (!response.ok) {
          throw new Error("Failed to load settings.");
        }

        const data = await response.json();

        if (
          data.public_background &&
          backgroundImages.some(
            (image) => image.path === data.public_background,
          )
        ) {
          setSelectedImage(data.public_background);
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "public_background",
          value: selectedImage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save settings.");
      }

      setMessage("Background image updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your website settings and preferences.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize the background image of your public website.
          </p>
        </div>

        <div className="max-w-xl space-y-5">
          <div className="space-y-2">
            <label htmlFor="background-image" className="text-sm font-medium">
              Public Background Image
            </label>

            <select
              id="background-image"
              value={selectedImage}
              onChange={(event) => setSelectedImage(event.target.value)}
              disabled={loading || saving}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {backgroundImages.map((image) => (
                <option key={image.path} value={image.path}>
                  {image.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Image Preview</p>

            <div
              className="aspect-video w-full rounded-lg border bg-cover bg-center"
              style={{
                backgroundImage: `url('${selectedImage}')`,
              }}
            />
          </div>

          {message && (
            <p className="text-sm font-medium text-muted-foreground">
              {message}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={loading || saving || !selectedImage}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
