// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Lume",
      description:
        "Embeddable AI assistant bubble for any React app. Self-hostable with Ollama.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/ovt2/lume",
        },
        {
          icon: "npm",
          label: "npm",
          href: "https://www.npmjs.com/package/@ovt2/lume",
        },
      ],
      logo: {
        src: "./src/assets/lume-logo.svg",
        alt: "Lume Logo",
      },
      favicon: "./src/assets/lume-logo.svg",
    
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "Introduction", slug: "getting-started" },
            { label: "Ollama setup", slug: "ollama-setup" },
          ],
        },
        {
          label: "Core concepts",
          items: [
            { label: "LumeProvider", slug: "lumeprovider" },
            { label: "Context", slug: "context" },
            { label: "Knowledge base", slug: "knowledge-base" },
          ],
        },
        {
          label: "Features",
          items: [
            { label: "Actions", slug: "actions" },
            { label: "UI Components", slug: "ui-components" },
            { label: "Memory", slug: "memory" },
            { label: "Proactive triggers", slug: "proactive-triggers" },
            { label: "Suggestion chips", slug: "suggestion-chips" },
            { label: "Debug mode", slug: "debug-mode" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Props", slug: "reference/props" },
            { label: "useAssistant", slug: "reference/use-assistant" },
            { label: "useLume", slug: "reference/use-lume" },
            { label: "defineAction", slug: "reference/define-action" },
            { label: "defineComponent", slug: "reference/define-component" },
            { label: "Models", slug: "reference/models" },
          ],
        },
        {
          label: "Changelog",
          items: [{ label: "Changelog", slug: "changelog" }],
        },
      ],
      customCss: ["./src/styles/custom.css"],
    }),
  ],
});
