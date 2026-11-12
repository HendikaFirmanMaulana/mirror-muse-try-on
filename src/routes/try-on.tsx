import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Aperture,
  Camera,
  Check,
  Download,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";

import studioPortrait from "@/assets/style-studio-editorial.jpg";
import { VirtualHeader } from "@/components/virtual-style-shell";
import { Button } from "@/components/ui/button";
import {
  defaultTryOnCategory,
  tryOnCategories,
  tryOnColors,
  type TryOnCategory,
} from "@/lib/try-on-data";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "Try-On Studio — Virtual Try-On AI" },
      {
        name: "description",
        content:
          "Explore the Virtual Try-On AI studio. Select accessories, choose a color, and preview yourself on camera.",
      },
      { property: "og:title", content: "Try-On Studio — Virtual Try-On AI" },
      {
        property: "og:description",
        content: "Explore accessories in your own camera preview with the Virtual Try-On AI studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TryOnPage,
});

function TryOnPage() {
  const [selectedCategory, setSelectedCategory] = useState<TryOnCategory>(defaultTryOnCategory);
  const [selectedSample, setSelectedSample] = useState<string>(defaultTryOnCategory.samples[0]);
  const [selectedColor, setSelectedColor] = useState<(typeof tryOnColors)[number]>(tryOnColors[0]);
  const [cameraState, setCameraState] = useState<"idle" | "starting" | "active" | "error">("idle");
  const [cameraError, setCameraError] = useState("");
  const [snapshotMessage, setSnapshotMessage] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const changeCategory = (category: (typeof tryOnCategories)[number]) => {
    setSelectedCategory(category);
    setSelectedSample(category.samples[0]);
  };

  const startCamera = async () => {
    setCameraError("");
    setSnapshotMessage("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access isn't available here. You can still explore the studio preview.");
      setCameraState("error");
      return;
    }

    setCameraState("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("active");
    } catch (error) {
      const name = error instanceof Error ? error.name : "";
      setCameraError(
        name === "NotAllowedError" || name === "PermissionDeniedError"
          ? "Camera permission was declined. Allow camera access in your browser settings to try it live."
          : "We couldn't start your camera. Check that it's connected and available, then try again.",
      );
      setCameraState("error");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraError("");
    setCameraState("idle");
  };

  const saveSnapshot = () => {
    const video = videoRef.current;
    const image = imageRef.current;
    const sourceWidth = video && cameraState === "active" ? video.videoWidth : image?.naturalWidth;
    const sourceHeight = video && cameraState === "active" ? video.videoHeight : image?.naturalHeight;

    if (!sourceWidth || !sourceHeight) {
      setSnapshotMessage("The preview is still loading. Try again in a moment.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setSnapshotMessage("This browser couldn't save the snapshot. Please try another browser.");
      return;
    }
    if (video && cameraState === "active") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } else if (image) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        setSnapshotMessage("This browser couldn't save the snapshot. Please try again.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const download = document.createElement("a");
      download.href = url;
      download.download = "virtual-try-on-preview.png";
      download.click();
      URL.revokeObjectURL(url);
      setSnapshotMessage("Your preview has been saved.");
    }, "image/png");
  };

  const ActiveIcon = selectedCategory.icon;

  return (
    <div className="min-h-screen bg-background">
      <VirtualHeader workspace />
      <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9 lg:px-12">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="grid size-6 place-items-center rounded-full bg-accent text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
              </span>
              THE PERSONAL STYLING ROOM
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Your try-on studio
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose an edit, find your color, see how you feel.
            </p>
          </div>
          <div className="flex min-h-9 items-center gap-2 text-xs font-medium text-muted-foreground">
            <span
              className={`size-2 rounded-full ${cameraState === "active" ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            {cameraState === "active" ? "Camera on" : "Preview mode"}
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:gap-7">
          <section aria-label="Camera preview" className="min-w-0">
            <div className="relative aspect-[4/3] min-h-[320px] max-h-[760px] overflow-hidden rounded-[4px] bg-secondary sm:aspect-[16/10] lg:aspect-[1.18/1] xl:aspect-[1.3/1]">
              <img
                ref={imageRef}
                src={studioPortrait}
                alt="Studio sample portrait for your preview"
                width={1600}
                height={1200}
                className={`absolute inset-0 h-full w-full object-cover object-[58%_43%] ${cameraState === "active" ? "hidden" : "block"}`}
              />
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                aria-label="Your live camera preview"
                className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${cameraState === "active" ? "block" : "hidden"}`}
              />

              <div className="absolute left-4 top-4 flex items-center gap-2 bg-background/90 px-3 py-2 text-xs font-medium text-foreground backdrop-blur-sm sm:left-5 sm:top-5">
                <Aperture className="size-3.5 text-primary" aria-hidden="true" />
                {cameraState === "active" ? "LIVE CAMERA" : "STUDIO PREVIEW"}
              </div>
              <div className="absolute right-4 top-4 grid size-9 place-items-center bg-background/90 text-muted-foreground backdrop-blur-sm sm:right-5 sm:top-5">
                <ActiveIcon className="size-4" aria-hidden="true" />
              </div>

              {cameraState !== "active" && (
                <div className="absolute inset-x-4 bottom-[72px] flex justify-center sm:bottom-[82px]">
                  <div className="max-w-[300px] bg-background/90 px-4 py-3 text-center backdrop-blur-sm">
                    <p className="font-display text-base font-semibold text-foreground">A moment for you.</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Turn on your camera for a personal preview.
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-3 bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-5">
                <Button
                  onClick={cameraState === "active" ? stopCamera : startCamera}
                  disabled={cameraState === "starting"}
                  size="sm"
                  className="rounded-md"
                >
                  {cameraState === "starting" ? (
                    <LoaderCircle className="animate-spin" aria-hidden="true" />
                  ) : cameraState === "active" ? (
                    <X aria-hidden="true" />
                  ) : (
                    <Camera aria-hidden="true" />
                  )}
                  {cameraState === "starting"
                    ? "Starting camera…"
                    : cameraState === "active"
                      ? "Turn camera off"
                      : "Activate camera"}
                </Button>
                <Button
                  onClick={saveSnapshot}
                  variant="outline"
                  size="sm"
                  className="rounded-md bg-background"
                >
                  <Download aria-hidden="true" />
                  Save snapshot
                </Button>
              </div>
            </div>
            <div className="flex min-h-12 flex-wrap items-center justify-between gap-2 pt-2 text-xs">
              {cameraError ? (
                <p role="alert" className="max-w-xl leading-5 text-destructive">
                  {cameraError}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Camera stays off until you choose to activate it.
                </p>
              )}
              {snapshotMessage && (
                <p role="status" className="flex items-center gap-1.5 text-foreground">
                  <Check className="size-3.5 text-primary" aria-hidden="true" />
                  {snapshotMessage}
                </p>
              )}
            </div>
          </section>

          <aside className="border-t border-border bg-background pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 xl:pl-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-semibold text-foreground">The edit</h2>
              <span className="text-xs text-muted-foreground">09 categories</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2" role="group" aria-label="Accessory categories">
              {tryOnCategories.map((category) => (
                <Button
                  key={category.name}
                  type="button"
                  variant="outline"
                  aria-pressed={selectedCategory.name === category.name}
                  onClick={() => changeCategory(category)}
                  className={`h-auto min-h-[66px] flex-col gap-1.5 whitespace-normal rounded-sm px-1.5 py-2 text-[11px] font-medium shadow-none ${
                    selectedCategory.name === category.name
                      ? "border-primary bg-accent text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <category.icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="mt-7 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    {selectedCategory.name}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-foreground">Choose a style</h3>
                </div>
                <span className="grid size-9 place-items-center rounded-full bg-accent text-primary">
                  <ActiveIcon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {selectedCategory.samples.map((sample, index) => (
                  <Button
                    key={sample}
                    type="button"
                    variant="outline"
                    aria-pressed={selectedSample === sample}
                    onClick={() => setSelectedSample(sample)}
                    className={`h-auto min-h-[92px] flex-col gap-2 whitespace-normal rounded-sm px-2 py-3 text-center shadow-none ${
                      selectedSample === sample
                        ? "border-primary bg-accent/50"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <span
                      className={`grid size-9 place-items-center rounded-full text-primary ${
                        index === 1 ? "bg-secondary" : "bg-accent"
                      }`}
                    >
                      <ActiveIcon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="text-[11px] font-medium leading-4 text-foreground">{sample}</span>
                  </Button>
                ))}
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground">Color story</h3>
                  <span className="text-xs text-muted-foreground">{selectedColor.name}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label="Choose a color">
                  {tryOnColors.map(({ name, className }) => (
                    <button
                      key={name}
                      type="button"
                      aria-label={name}
                      aria-pressed={selectedColor.name === name}
                      onClick={() => setSelectedColor({ name, className })}
                      className={`grid size-8 place-items-center rounded-full border border-foreground/10 ${className} outline-offset-2 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring ${
                        selectedColor.name === name ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      {selectedColor.name === name && (
                        <Check className="size-3.5 text-foreground" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 border-l-2 border-primary/50 py-1 pl-3 text-xs leading-5 text-muted-foreground">
              Selections are a style guide for this studio preview. Live fitting is coming soon.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}