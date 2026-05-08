import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--bg-subtle)] flex-col justify-center p-12 border-r border-[var(--border-default)]">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-md bg-[var(--accent-primary)] flex items-center justify-center text-[var(--bg-base)] font-bold">
              G
            </div>
            <div className="text-2xl font-bold tracking-tight">Ghost AI</div>
          </div>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Join the real-time collaborative system design workspace powered by AI.
          </p>
          <ul className="space-y-4 text-[var(--text-secondary)]">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
              AI-assisted system design
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
              Real-time multiplayer editing
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />
              Code and infrastructure generation
            </li>
          </ul>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--bg-base)]">
        <SignUp />
      </div>
    </div>
  );
}
