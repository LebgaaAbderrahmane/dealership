import { useCallback, useState } from 'react';
import { apiFetch } from '../lib/api';

export type SubmitStatus = 'idle' | 'submitting' | 'success';

interface OrderInput {
  vehicleId: number;
  name: string;
  phone: string;
  email: string;
  finance: 'cash' | 'financing';
  downPayment?: number;
  term?: number;
  notes?: string;
}

export function useSubmitOrder() {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  const submit = useCallback(
    async (input: OrderInput, event?: { preventDefault: () => void }) => {
      event?.preventDefault();
      setStatus('submitting');
      setError(null);
      try {
        const res = await apiFetch<{ ok: boolean; id: number }>('/orders', {
          method: 'POST',
          body: JSON.stringify(input),
        });
        setOrderId(res.id);
        setStatus('success');
      } catch (err) {
        setError((err as Error).message);
        setStatus('idle');
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setOrderId(null);
  }, []);

  return { status, error, orderId, submit, reset };
}
