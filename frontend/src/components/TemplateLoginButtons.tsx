'use client';

import { useLoginModal } from '@/contexts/login-modal-context';

export function TemplateLoginButton() {
  const { openLoginModal } = useLoginModal();

  return (
    <button
      onClick={openLoginModal}
      className="rounded-full bg-slate-600 px-4 py-1.5 text-[11px] font-semibold text-slate-100 shadow hover:bg-slate-500"
    >
      Login to Use Template
    </button>
  );
}

export function BuilderLoginButton() {
  const { openLoginModal } = useLoginModal();

  return (
    <button
      onClick={openLoginModal}
      className="text-xs font-medium text-slate-400 hover:text-slate-300"
    >
      Login to Access Builder →
    </button>
  );
}