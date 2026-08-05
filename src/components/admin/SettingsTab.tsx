import { useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { adminToken } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Label } from '@/components/shadcn/label';
import type { SiteSettings } from '@/data/settings';

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h3 className="font-semibold tracking-tight">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

const INITIAL_DRAFT = (s: SiteSettings): SiteSettings => ({
  ...s,
  dealer: { ...s.dealer },
  hours: { ...s.hours },
  hero: { ...s.hero, stats: s.hero.stats.map((x) => ({ ...x })) },
  trust: s.trust.map((x) => ({ ...x })),
  social: { ...s.social },
  footer: { ...s.footer },
});

export function SettingsTab() {
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load settings'))))
      .then((data: SiteSettings) => active && setDraft(INITIAL_DRAFT(data)))
      .catch((err: Error) => active && setLoadError(err.message));
    return () => {
      active = false;
    };
  }, []);

  const updateDealer = (key: keyof SiteSettings['dealer'], value: string) =>
    setDraft((d) => (d ? { ...d, dealer: { ...d.dealer, [key]: value } } : d));

  const updateHours = (key: keyof SiteSettings['hours'], value: string) =>
    setDraft((d) => (d ? { ...d, hours: { ...d.hours, [key]: value } } : d));

  const updateHero = (patch: Partial<SiteSettings['hero']>) =>
    setDraft((d) => (d ? { ...d, hero: { ...d.hero, ...patch } } : d));

  const updateHeroStat = (i: number, key: 'value' | 'label', value: string) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            hero: { ...d.hero, stats: d.hero.stats.map((s, j) => (j === i ? { ...s, [key]: value } : s)) },
          }
        : d,
    );

  const updateTrust = (i: number, key: 'label' | 'sub', value: string) =>
    setDraft((d) => (d ? { ...d, trust: d.trust.map((t, j) => (j === i ? { ...t, [key]: value } : t)) } : d));

  const updateSocial = (key: keyof SiteSettings['social'], value: string) =>
    setDraft((d) => (d ? { ...d, social: { ...d.social, [key]: value } } : d));

  const updateFooter = (key: keyof SiteSettings['footer'], value: string) =>
    setDraft((d) => (d ? { ...d, footer: { ...d.footer, [key]: value } } : d));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      await apiFetch('/settings', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken()}` },
        body: JSON.stringify(draft),
      });
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setBusy(false);
    }
  };

  if (loadError) {
    return <p className="text-sm text-destructive">{loadError}</p>;
  }

  if (!draft) {
    return <p className="text-sm text-muted-foreground">Loading settings…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Site settings</h2>
          <p className="text-sm text-muted-foreground">
            Edit dealership info, hours, hero content, and social links. Changes appear on the public site immediately.
          </p>
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>

      <Section title="Dealership" description="Contact details used across the site, footer, and contact page.">
        <Field label="Name">
          <Input value={draft.dealer.name} onChange={(e) => updateDealer('name', e.target.value)} />
        </Field>
        <Field label="Phone (display)">
          <Input value={draft.dealer.phone} onChange={(e) => updateDealer('phone', e.target.value)} />
        </Field>
        <Field label="Phone link">
          <Input value={draft.dealer.phoneHref} onChange={(e) => updateDealer('phoneHref', e.target.value)} />
        </Field>
        <Field label="Sales email">
          <Input value={draft.dealer.salesEmail} onChange={(e) => updateDealer('salesEmail', e.target.value)} />
        </Field>
        <Field label="Service email">
          <Input value={draft.dealer.serviceEmail} onChange={(e) => updateDealer('serviceEmail', e.target.value)} />
        </Field>
        <Field label="Address line 1">
          <Input value={draft.dealer.addressLine1} onChange={(e) => updateDealer('addressLine1', e.target.value)} />
        </Field>
        <Field label="Address line 2">
          <Input value={draft.dealer.addressLine2} onChange={(e) => updateDealer('addressLine2', e.target.value)} />
        </Field>
        <Field label="Dealer license #">
          <Input value={draft.dealer.license} onChange={(e) => updateDealer('license', e.target.value)} />
        </Field>
      </Section>

      <Section title="Hours" description="Single-line opening-hours text.">
        <Field label="Sales hours">
          <Input value={draft.hours.sales} onChange={(e) => updateHours('sales', e.target.value)} />
        </Field>
        <Field label="Service hours">
          <Input value={draft.hours.service} onChange={(e) => updateHours('service', e.target.value)} />
        </Field>
      </Section>

      <Section title="Home hero" description="Headline, subline, and the four stat cards on the homepage.">
        <Field label="Eyebrow">
          <Input value={draft.hero.eyebrow} onChange={(e) => updateHero({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Subline">
          <Input value={draft.hero.subline} onChange={(e) => updateHero({ subline: e.target.value })} />
        </Field>
        {draft.hero.stats.map((stat, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <Field label={`Stat ${i + 1} — value`}>
                <Input value={stat.value} onChange={(e) => updateHeroStat(i, 'value', e.target.value)} />
              </Field>
            </div>
            <div className="flex-[2]">
              <Field label={`Stat ${i + 1} — label`}>
                <Input value={stat.label} onChange={(e) => updateHeroStat(i, 'label', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Trust strip" description="The four trust badges shown under the homepage hero.">
        {draft.trust.map((item, i) => (
          <div key={i} className="contents">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Field label={`Badge ${i + 1} — title`}>
                  <Input value={item.label} onChange={(e) => updateTrust(i, 'label', e.target.value)} />
                </Field>
              </div>
              <div className="flex-[2]">
                <Field label={`Badge ${i + 1} — detail`}>
                  <Input value={item.sub} onChange={(e) => updateTrust(i, 'sub', e.target.value)} />
                </Field>
              </div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Social links" description="Full URLs (https://…). Empty fields are hidden from the footer.">
        <Field label="Instagram">
          <Input value={draft.social.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} />
        </Field>
        <Field label="Facebook">
          <Input value={draft.social.facebook} onChange={(e) => updateSocial('facebook', e.target.value)} />
        </Field>
        <Field label="YouTube">
          <Input value={draft.social.youtube} onChange={(e) => updateSocial('youtube', e.target.value)} />
        </Field>
        <Field label="WhatsApp">
          <Input value={draft.social.whatsapp} onChange={(e) => updateSocial('whatsapp', e.target.value)} />
        </Field>
      </Section>

      <Section title="Footer" description="Tagline shown in the footer.">
        <div className="sm:col-span-2">
          <Field label="Blurb">
            <Textarea rows={2} value={draft.footer.blurb} onChange={(e) => updateFooter('blurb', e.target.value)} />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button type="submit" disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {busy ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
