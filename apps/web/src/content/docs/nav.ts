export const docsNav = [
  {
    group: 'GETTING STARTED',
    items: [
      { title: 'Introduction', href: '/docs/getting-started/introduction' },
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Quick Start', href: '/docs/getting-started/quick-start' },
      { title: 'Skills', href: '/docs/getting-started/skills' },
      { title: 'LLMs', href: '/llms.txt', external: true },
    ],
  },
  {
    group: 'CLI',
    items: [
      { title: 'Overview', href: '/docs/cli/overview' },
      { title: 'init', href: '/docs/cli/init' },
      { title: 'add', href: '/docs/cli/add' },
      { title: 'Global Config', href: '/docs/cli/global-config' },
    ],
  },
  {
    group: 'THEMING',
    items: [
      { title: 'Design Tokens', href: '/docs/theming/design-tokens' },
      { title: 'OKLCH Colors', href: '/docs/theming/oklch-colors' },
      { title: 'Custom Fonts', href: '/docs/theming/custom-fonts' },
    ],
  },
  {
    group: 'PACKAGES',
    items: [
      { title: '@gwenui/themes', href: '/docs/packages/themes' },
      { title: '@gwenui/react', href: '/docs/packages/react' },
      { title: '@gwenui/cli', href: '/docs/packages/cli' },
      { title: '@gwenui/supreme', href: '/docs/packages/supreme' },
    ],
  },
]

export const flatNav = docsNav.flatMap(g => g.items)

export function getPagination(pathname: string) {
  const idx = flatNav.findIndex(item => item.href === pathname)
  return {
    prev: idx > 0 ? flatNav[idx - 1] : undefined,
    next: idx < flatNav.length - 1 ? flatNav[idx + 1] : undefined,
  }
}
