import { useCallback, useState } from 'react';

export type SubmitStatus = 'idle' | 'submitting' | 'success';

export function useMockSubmit(delay = 900) {
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const submit = useCallback(
    (event?: { preventDefault: () => void }) => {
      event?.preventDefault();
      setStatus('submitting');
      setTimeout(() => setStatus('success'), delay);
    },
    [delay],
  );

  const reset = useCallback(() => setStatus('idle'), []);

  return { status, submit, reset };
}
