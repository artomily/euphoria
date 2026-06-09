import { WalletButton } from "./wallet-button";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center h-14 px-6 border-b border-border-subtle bg-bg-base/80 backdrop-blur-sm sticky top-0 z-10">
      {title && (
        <h1 className="text-sm font-medium text-text-secondary">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" aria-hidden />
          <span>BNB Chain</span>
        </div>
        <WalletButton />
      </div>
    </header>
  );
}
