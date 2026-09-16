'use client';
import { useState, useEffect } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/lib/toast';
import { useAuth } from '@/lib/auth';
import { useTheme } from '@/lib/theme';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Switch } from '@/components/switch';
import { Save, Link, Copy, Check } from 'lucide-react';

export default function SettingsPage({ addToast }: { addToast: (msg: string, type?: 'default' | 'success' | 'error' | 'info') => void }) {
  const { t } = useLang();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [businessName, setBusinessName] = useState('My Business');
  const [emailNotif, setEmailNotif] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [shareGenerated, setShareGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const b = localStorage.getItem('inv_business') || 'My Business';
      setBusinessName(b);
      const e = localStorage.getItem('inv_notify_email') || '';
      setNotifyEmail(e);
      setEmailNotif(!!e);
    } catch {}
  }, []);

  const saveSettings = () => {
    localStorage.setItem('inv_business', businessName);
    if (emailNotif && notifyEmail) localStorage.setItem('inv_notify_email', notifyEmail);
    else localStorage.removeItem('inv_notify_email');
    addToast(t['settings.saved'], 'success');
  };

  const generateShareLink = () => {
    const url = `${window.location.origin}/s/shared`;
    setShareUrl(url);
    setShareGenerated(true);
    addToast(t['settings.shareGenerated'], 'success');
  };

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      addToast(t['settings.shareCopied'], 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast(t['share.copyFailed'], 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t['settings.title']}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t['settings.profile']}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t['auth.name']}</label>
            <Input value={user?.name || ''} onChange={e => {}} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t['auth.email']}</label>
            <Input value={user?.email || ''} onChange={e => {}} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t['settings.businessName']}</label>
            <Input value={businessName} onChange={e => setBusinessName(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t['settings.notifications']}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t['settings.enableEmail']}</p>
              <p className="text-xs text-muted-foreground">{t['settings.emailAddress']}</p>
            </div>
              <Switch
                checked={emailNotif}
                onChange={setEmailNotif as any}
                className="w-9 h-5"
              />
          </div>
          {emailNotif && (
            <div>
              <label className="block text-sm font-medium mb-1.5">{t['settings.emailAddress']}</label>
              <Input type="email" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} placeholder="notif@company.com" />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveSettings}><Save size={16} /> Save Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t['settings.shareLink']}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{t['settings.shareNote']}</p>
          {shareUrl ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input value={shareUrl} readOnly className="flex-1 font-mono text-sm" />
                <Button variant="outline" size="sm" onClick={copyShareLink}>
                  {copied ? <><Check size={14} />{t['shared.linkCopied']}</> : <><Copy size={14} />{t['shared.copyLink']}</>}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t['settings.shareExpiration']}</p>
            </div>
          ) : (
            <Button onClick={generateShareLink}><Link size={16} />{t['settings.shareButton']}</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
