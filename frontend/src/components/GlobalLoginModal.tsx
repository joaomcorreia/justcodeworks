'use client';

import { useLoginModal } from '@/contexts/login-modal-context';
import LoginModal from './LoginModal';
import type { Locale } from '@/i18n';

interface GlobalLoginModalProps {
  locale: Locale;
}

export default function GlobalLoginModal({ locale }: GlobalLoginModalProps) {
  const { isOpen, closeLoginModal } = useLoginModal();

  return (
    <LoginModal
      isOpen={isOpen}
      onClose={closeLoginModal}
      locale={locale}
    />
  );
}