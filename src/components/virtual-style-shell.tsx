import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function VirtualHeader({ workspace = false }: { workspace?: boolean }) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex min-h-[72px] max-w-[1320px] items-center justify-between gap-4 px-6 sm:px-10 lg:px-12">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2.5" aria-label="Beranda Virtual Try-On AI">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-[17px]" aria-hidden="true" />
          </span>
          <span className="font-display text-sm font-semibold text-foreground sm:text-base">
            Virtual Try-On <span className="text-primary">AI</span>
          </span>
        </Link>
        {workspace ? (
          <Button asChild variant="outline" size="sm" className="rounded-md px-3 sm:px-4">
            <Link to="/">
              <span aria-hidden="true">←</span> <span>Kembali ke beranda</span>
            </Link>
          </Button>
        ) : (
          <nav className="flex items-center gap-3 sm:gap-6" aria-label="Navigasi utama">
            <a
              href="#discover"
              className="hidden min-h-10 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Jelajahi
            </a>
            <Button asChild size="sm" className="rounded-md px-3 sm:px-4">
              <Link to="/try-on">
                <span>Masuk studio</span> <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}

export function VirtualFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1320px] flex-col gap-3 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-12">
        <Link to="/" className="inline-flex min-h-9 w-fit items-center gap-2 font-medium text-foreground">
          <span className="grid size-7 place-items-center rounded-full bg-accent text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
          </span>
          Virtual Try-On AI
        </Link>
        <p>Temukan detail yang paling mencerminkan dirimu.</p>
      </div>
    </footer>
  );
}