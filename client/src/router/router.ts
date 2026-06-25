import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/router/route-tree";

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
