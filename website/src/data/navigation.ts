import type { NavLink, NavGroup } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { href: "/features",     label: "Features"     },
  { href: "/screenshots",  label: "Screenshots"  },
  { href: "/downloads",    label: "Downloads"    },
  { href: "/changelog",    label: "Changelog"    },
  { href: "/roadmap",      label: "Roadmap"      },
  { href: "/about",        label: "About"        },
];

export const FOOTER_GROUPS: NavGroup[] = [
  {
    label: "Product",
    links: [
      { href: "/features",     label: "Features"    },
      { href: "/screenshots",  label: "Screenshots" },
      { href: "/downloads",    label: "Downloads"   },
      { href: "/changelog",    label: "Changelog"   },
      { href: "/roadmap",      label: "Roadmap"     },
    ],
  },
  {
    label: "Community",
    links: [
      { href: "https://github.com/SujalUshir/AetherCP",        label: "GitHub",          external: true },
      { href: "https://github.com/SujalUshir/AetherCP/issues", label: "Report a Bug",    external: true },
      { href: "/feedback",                                       label: "Feedback"                       },
      { href: "/about",                                          label: "About"                          },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/privacy",                                                   label: "Privacy Policy"      },
      { href: "https://github.com/SujalUshir/AetherCP/blob/main/SECURITY.md", label: "Security",        external: true },
      { href: "https://github.com/SujalUshir/AetherCP/blob/main/LICENSE",     label: "MIT License",     external: true },
    ],
  },
];

export const GITHUB_URL = "https://github.com/SujalUshir/AetherCP";
export const GITHUB_RELEASES_URL = "https://github.com/SujalUshir/AetherCP/releases";
export const GITHUB_ISSUES_URL = "https://github.com/SujalUshir/AetherCP/issues";
export const EXTENSION_VERSION = "1.2.0";
export const DOWNLOAD_URL = `https://github.com/SujalUshir/AetherCP/releases/download/v${EXTENSION_VERSION}/AetherCP-v${EXTENSION_VERSION}.zip`;
