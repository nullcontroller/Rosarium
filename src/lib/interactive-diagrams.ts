/** Anchor-based static diagrams gain selection controls without replacing their SVG. */
export function enhanceCaseDiagrams() {
  document
    .querySelectorAll<HTMLElement>("[data-case-flow], [data-support-dx]")
    .forEach((root) => {
      if (root.dataset.enhanced) return;
      const links = [...root.querySelectorAll<SVGAElement>("[data-node]")];
      const details = [...root.querySelectorAll<HTMLElement>("[data-detail]")];
      const empty = root.querySelector<HTMLElement>("[data-diagram-empty]");
      const status = root.querySelector<HTMLElement>('[role="status"]');
      function select(id: string | null, announce = true) {
        if (empty) empty.hidden = id !== null;
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
        });
        link.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(link.dataset.node!);
          }
        });
      });
      root.dataset.enhanced = "true";
      select(empty ? null : links[0].dataset.node!, false);
    });
}
