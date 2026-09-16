import { useLang } from '@/lib/lang';

export default function LangToggle() {
  const { locale, setLocale } = useLang();
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-md">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          locale === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('id')}
        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
          locale === 'id' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
        }`}
      >
        ID
      </button>
    </div>
  );
}
