/** Anchor-based static diagrams gain selection controls without replacing their SVG. */
export function enhanceCaseDiagrams() {
  document
    .querySelectorAll<HTMLElement>("[data-case-flow], [data-support-dx]")
    .forEach((root) => {
      if (root.dataset.enhanced) return;
      const links = [...root.querySelectorAll<SVGAElement>("[data-node]")];
      const details = [...root.querySelectorAll<HTMLElement>("[data-detail]")];
      const compact = root.hasAttribute("data-compact-interactive");
      const panel = root.querySelector<HTMLElement>(".case-diagram-details");
      const returnLink = root.querySelector<HTMLElement>(
        ".case-diagram-return",
      );
      const status = root.querySelector<HTMLElement>('[role="status"]');
      function select(id: string, announce = true) {
        if (compact && panel) panel.hidden = false;
        if (compact && returnLink) returnLink.hidden = false;
        details.forEach(
          (detail) => (detail.hidden = detail.dataset.detail !== id),
        );
        links.forEach((link) =>
          link.setAttribute("aria-pressed", String(link.dataset.node === id)),
        );
        if (status && announce)
          status.textContent =
            details.find((d) => d.dataset.detail === id)?.textContent?.trim() ||
            "";
      }
      links.forEach((link) => {
        link.setAttribute("role", "button");
        link.setAttribute("tabindex", "0");
        link.setAttribute("aria-controls", link.getAttribute("href")!.slice(1));
        link.addEventListener("click", (event) => {
          event.preventDefault();
          select(link.dataset.node!);
          const detail = details.find(
            (d) => d.dataset.detail === link.dataset.node,
          );
          if (detail && root.clientWidth < 640) {
            const b = detail.getBoundingClientRect();
            if (b.bottom > innerHeight || b.top < 100)
              detail.scrollIntoView({
                block: "nearest",
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
          }
        });
        link.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(link.dataset.node!);
          }
        });
      });
      root.dataset.enhanced = "true";
      if (compact) {
        details.forEach((detail) => (detail.hidden = true));
        links.forEach((link) => link.setAttribute("aria-pressed", "false"));
        if (panel) panel.hidden = true;
        if (returnLink) returnLink.hidden = true;
      } else select(links[0].dataset.node!, false);
    });
}
