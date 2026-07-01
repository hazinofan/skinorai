const extensionHydrationAttribute = "bis_skin_checked";

function removeExtensionHydrationAttribute(root: ParentNode | Element) {
  if (root instanceof Element) {
    root.removeAttribute(extensionHydrationAttribute);
  }

  root
    .querySelectorAll(`[${extensionHydrationAttribute}]`)
    .forEach((node) => node.removeAttribute(extensionHydrationAttribute));
}

if (process.env.NODE_ENV === "development" && typeof document !== "undefined") {
  removeExtensionHydrationAttribute(document.documentElement);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === extensionHydrationAttribute &&
        mutation.target instanceof Element
      ) {
        mutation.target.removeAttribute(extensionHydrationAttribute);
      }

      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          removeExtensionHydrationAttribute(node);
        }
      });
    });
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: [extensionHydrationAttribute],
    childList: true,
    subtree: true,
  });
}
