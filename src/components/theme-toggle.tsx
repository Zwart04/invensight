import { useLang } from '@/lib/lang';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const themes = [
    { value: 'light' as const, label: t['settings.themeLight'] },
    { value: 'dark' as const, label: t['settings.themeDark'] },
    { value: 'system' as const, label: t['settings.themeSystem'] },
  ];
  return (
    <div className="flex items-center gap-2">
      {themes.map((th) => (
        <button
          key={th.value}
          onClick={() => setTheme(th.value)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            theme === th.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-foreground border-border hover:bg-muted'
          }`}
        >
          {th.label}
        </button>
      ))}
    </div>
  );
}
