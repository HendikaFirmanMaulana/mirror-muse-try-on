import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { tryOnCategories } from "@/lib/try-on-data";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches the try-on workspace route", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/try-on");

    expect(matches.at(-1)?.routeId).toBe("/try-on");
  });

  it("provides all nine requested accessory categories", () => {
    expect(tryOnCategories.map((category) => category.name)).toEqual([
      "Glasses",
      "Hair",
      "Hat",
      "Necklace",
      "Clothes",
      "Watch",
      "Bracelet",
      "Ring",
      "Nails",
    ]);
  });
});
