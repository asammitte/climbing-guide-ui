// Preload every SVG at build time as raw strings
const modules = import.meta.glob('/assets/images/icons/*.svg', {
  as: 'raw',
  eager: true
}) as Record<string, string>;

// Build a { [name]: svgString } map
const iconMap: Record<string, string> = {};
for (const p in modules) {
  const name = p.split('/').pop()!.replace('.svg', '');
  iconMap[name] = modules[p];
}

export function useSvgLoader() {
  function loadSvg(iconName: string): string | null {
    return iconMap[iconName] ?? null;
  }
  return { loadSvg };
}
