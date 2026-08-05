import { useCallback, useState } from 'react';
import { apiFetch } from '../lib/api';

export type SubmitStatus = 'idle' | 'submitting' | 'success';

export type LeadKind = 'contact' | 'pre-qualify' | 'service' | 'trade-in';

export function useSubmitLead(kind: LeadKind) {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: Record<string, unknown>, event?: { preventDefault: () => void }) => {
      event?.preventDefault();
      setStatus('submitting');
      setError(null);
      try {
        await apiFetch('/leads', { method: 'POST', body: JSON.stringify({ kind, ...payload }) });
        setStatus('success');
      } catch (err) {
        setError((err as Error).message);
        setStatus('idle');
      }
    },
    [kind],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { status, error, submit, reset };
}
