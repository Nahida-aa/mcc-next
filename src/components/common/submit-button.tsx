'use client';

import { useFormStatus } from 'react-dom';

import { LoaderIcon } from '@/components/icons';

import { Button } from '@/components/ui/button';

export function SubmitButton({
  children,
  isLoading,
  onClick,
  className,
}: {
  children: React.ReactNode;
  isLoading: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const { pending } = useFormStatus();

  console.log(`pending: ${pending}, isLoading: ${isLoading}`);
  return (
    <Button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending || isLoading}
      disabled={pending || isLoading}
      onClick={onClick}
      className={`${className} relative`}
    >

      {children}
      {(pending || isLoading) && (
        <span className="animate-spin  ">
          <LoaderIcon />
        </span>
      )}
      <output aria-live="polite" className="sr-only">
        {pending || isLoading ? 'Loading' : 'Submit form'}
      </output>
    </Button>
  );
}
