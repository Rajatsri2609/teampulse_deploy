import { useState, useEffect, useId } from "react";
import {
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronRight,
  ChevronDown,
  Eye,
  X,
  Info,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  UserCircle,
  Loader2,
  Mail,
  Home,
  GitBranch,
  Shield,
  Database,
  Lock,
  Search,
  Github,
  Clock,
  BookOpen,
  RefreshCw,
  UserCheck,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";

// ── Flow & navigation types ───────────────────────────────────────────────────

type FlowStep =
  | "landing"
  | "login"
  | "create-account"
  | "workspace"
  | "connect-sources"
  | "privacy-review"
  | "processing"
  | "app"
  | "emp-data"
  | "emp-home";

type Role = "manager" | "contributor";

type JobRole =
  | "Project Manager"
  | "Engineering Manager"
  | "Team Lead"
  | "Developer / Contributor"
  | "Other";

type Page = "overview" | "profiles" | "settings";

type ContribPage = "my-overview" | "my-contributions" | "my-pulse" | "my-data" | "team-context" | "my-profile";

const MANAGER_NAV: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard size={15} /> },
  { id: "profiles", label: "Evidence Profiles", icon: <Users size={15} /> },
  { id: "settings", label: "Settings / Integrations", icon: <Settings size={15} /> },
];

const CONTRIB_NAV: { id: ContribPage; label: string; icon: React.ReactNode }[] = [
  { id: "my-overview", label: "My Overview", icon: <Home size={15} /> },
  { id: "my-contributions", label: "Contributions", icon: <GitBranch size={15} /> },
  { id: "my-pulse", label: "Weekly Pulse", icon: <Activity size={15} /> },
  { id: "my-data", label: "My Data", icon: <Shield size={15} /> },
  { id: "my-profile", label: "Individual Profile", icon: <UserCircle size={15} /> },
  { id: "team-context", label: "Team Context", icon: <Users size={15} /> },
];

const PROJECTS = ["Payments Platform", "Customer Portal", "Internal Tools"];

// ── Brand mark ────────────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
  const gradId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <defs>
        <linearGradient id={gradId} x1="12" y1="8" x2="88" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5AA9E6" />
          <stop offset="100%" stopColor="#9B7FE0" />
        </linearGradient>
      </defs>
      <polygon points="50,9 83.5,29.5 83.5,70.5 50,91 16.5,70.5 16.5,29.5" stroke={`url(#${gradId})`} strokeWidth="5" strokeLinejoin="round" />
      <polyline points="3,54 27,54 34,54 40,37 46,70 52,15 58,68 64,41 70,54 76,54 97,54" stroke={`url(#${gradId})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LogoWordmark({ size = 15 }: { size?: number }) {
  return (
    <span className="font-semibold" style={{ fontSize: size }}>
      <span style={{ color: "#5AA9E6" }}>Team</span>
      <span style={{ color: "#9B7FE0" }}>Pulse</span>
    </span>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [flow, setFlow] = useState<FlowStep>("landing");
  const [selectedJobRole, setSelectedJobRole] = useState<JobRole>("Project Manager");
  const [connectedSources, setConnectedSources] = useState<string[]>([]);
  const [role, setRole] = useState<Role>("manager");
  // The role the account actually signed up as. Contributors are locked to the
  // contributor view; only manager accounts get the "View as" preview toggle.
  const [accountRole, setAccountRole] = useState<Role>("manager");
  const [page, setPage] = useState<Page>("overview");
  const [contribPage, setContribPage] = useState<ContribPage>("my-overview");
  const [project, setProject] = useState("Payments Platform");
  const [projectOpen, setProjectOpen] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const completeSignup = () => {
    const signupRole: Role = selectedJobRole === "Developer / Contributor" ? "contributor" : "manager";
    setAccountRole(signupRole);
    setRole(signupRole);
    if (signupRole === "contributor") setContribPage("my-overview");
  };

  // Onboarding screens
  if (flow !== "app" && flow !== "emp-data" && flow !== "emp-home") {
    return <OnboardingFlow step={flow} selectedJobRole={selectedJobRole} connectedSources={connectedSources} onStep={setFlow} onBack={setFlow} onSelectJobRole={setSelectedJobRole} setConnectedSources={setConnectedSources} onCompleteSignup={completeSignup} />;
  }

  // Employee invitation flow
  if (flow === "emp-data" || flow === "emp-home") {
    return <EmployeeFlow step={flow} onStep={setFlow} />;
  }

  const gotoPage = (id: Page) => {
    setPage(id);
    if (id === "profiles") setSelectedEmployeeId(null);
  };

  const openProfile = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setPage("profiles");
  };

  const goHome = () => {
    if (role === "manager") gotoPage("overview");
    else setContribPage("my-overview");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "#F3F4F7" }}>
      {/* ── Sidebar ── */}
      <aside className="flex flex-col w-56 shrink-0 border-r" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.1)" }}>
        {/* Logo */}
        <button onClick={goHome} className="px-4 py-4 border-b text-left transition-colors hover:bg-black/[0.07]" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
          <div className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <div>
              <LogoWordmark size={14} />
              <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "#4F46E5" }}>Collaboration Intelligence</div>
            </div>
          </div>
        </button>

        {/* Project switcher */}
        <div className="relative border-b" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
          <button
            onClick={() => setProjectOpen(!projectOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-black/[0.07]"
          >
            <div>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "#8A93A6" }}>Project</div>
              <div className="text-xs font-medium" style={{ color: "#3D4459" }}>{project}</div>
            </div>
            <ChevronDown size={12} color="#8A93A6" className={`transition-transform ${projectOpen ? "rotate-180" : ""}`} />
          </button>
          {projectOpen && (
            <div className="absolute left-0 right-0 top-full z-50 border-b shadow-xl" style={{ background: "#F3F4F7", borderColor: "rgba(15,23,42,0.12)" }}>
              {PROJECTS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setProject(p); setProjectOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-xs hover:bg-black/[0.08]"
                  style={{ color: p === project ? "#23273A" : "#6B7280" }}
                >
                  {p}
                  {p === project && <CheckCircle2 size={11} color="#6366f1" />}
                </button>
              ))}
              <div className="border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left" style={{ color: "#6B7280" }}>
                  <Plus size={11} /> Connect another project
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-xs text-left" style={{ color: "#6B7280" }}>
                  <Settings size={11} /> Workspace Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sprint context */}
        <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
          <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: "#8A93A6" }}>Current Sprint</div>
          <div className="text-xs font-medium" style={{ color: "#5B6478" }}>Sprint 23 · Jul 14 – Jul 28</div>
          <div className="mt-2 h-1 rounded-full" style={{ background: "rgba(15,23,42,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "64%", background: "#6366f1" }} />
          </div>
          <div className="text-[9px] mt-1" style={{ fontFamily: "'DM Mono', monospace", color: "#8A93A6" }}>9 days remaining · 64%</div>
        </div>

        {/* Role toggle — only manager accounts may preview the contributor view. Contributor accounts are locked to their own view and never see this. */}
        {accountRole === "manager" && (
        <div className="px-4 py-2.5 border-b" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
          <div className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "#8A93A6" }}>View as</div>
          <div className="flex rounded-md overflow-hidden border" style={{ borderColor: "rgba(15,23,42,0.12)" }}>
            {(["manager", "contributor"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); if (r === "contributor") setContribPage("my-overview"); }}
                className="flex-1 text-[10px] py-1 capitalize transition-colors"
                style={{
                  background: role === r ? "#6366f1" : "transparent",
                  color: role === r ? "#fff" : "#8A93A6",
                }}
              >
                {r === "manager" ? "Manager" : "Contributor"}
              </button>
            ))}
          </div>
        </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {role === "manager"
            ? MANAGER_NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => gotoPage(n.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{
                    fontSize: 12.5,
                    color: page === n.id ? "#23273A" : "#6B7280",
                    background: page === n.id ? "rgba(99,102,241,0.1)" : "transparent",
                    borderLeft: `2px solid ${page === n.id ? "#6366f1" : "transparent"}`,
                  }}
                >
                  <span style={{ color: page === n.id ? "#6366f1" : "#A9AFC0" }}>{n.icon}</span>
                  {n.label}
                </button>
              ))
            : CONTRIB_NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setContribPage(n.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{
                    fontSize: 12.5,
                    color: contribPage === n.id ? "#23273A" : "#6B7280",
                    background: contribPage === n.id ? "rgba(99,102,241,0.1)" : "transparent",
                    borderLeft: `2px solid ${contribPage === n.id ? "#6366f1" : "transparent"}`,
                  }}
                >
                  <span style={{ color: contribPage === n.id ? "#6366f1" : "#A9AFC0" }}>{n.icon}</span>
                  {n.label}
                </button>
              ))}
        </nav>

        {/* Demo: preview employee flow */}
        {role === "manager" && (
          <div className="px-4 pb-2">
            <button
              onClick={() => setShowInviteDialog(true)}
              className="w-full text-[10px] px-2 py-1.5 rounded border text-left transition-colors"
              style={{ borderColor: "rgba(15,23,42,0.1)", color: "#8A93A6" }}
            >
              <Mail size={9} className="inline mr-1.5 mb-0.5" />
              Preview employee invitation flow
            </button>
          </div>
        )}

        {/* User */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {role === "manager" ? "SC" : "PS"}
            </div>
            <div>
              <div className="text-xs font-medium" style={{ color: "#23273A" }}>{role === "manager" ? "Sarah Chen" : "Priya Sharma"}</div>
              <div className="text-[10px]" style={{ color: "#8A93A6" }}>{role === "manager" ? "Project Manager" : "Frontend Engineer"}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {role === "manager" ? (
            <>
              {page === "overview" && <OverviewPage onOpenProfile={openProfile} />}
              {page === "profiles" && <EvidenceProfilesPage selectedEmployeeId={selectedEmployeeId} onSelectEmployee={setSelectedEmployeeId} />}
              {page === "settings" && <SettingsIntegrationsPage />}
            </>
          ) : (
            <ContributorView page={contribPage} />
          )}
        </main>
      </div>

      <InvitationDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onAccept={() => { setShowInviteDialog(false); setFlow("emp-data"); }}
      />
    </div>
  );
}

// ── Invitation accept/reject popup (contributor role) ─────────────────────────

function InvitationDialog({ open, onOpenChange, onAccept }: { open: boolean; onOpenChange: (open: boolean) => void; onAccept: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-1">
            <Mail size={20} color="#4F46E5" />
          </div>
          <DialogTitle className="text-center" style={{ color: "#23273A" }}>You've been invited to TeamPulse</DialogTitle>
          <DialogDescription className="text-center" style={{ color: "#6B7280" }}>Sarah Chen invited you to join as a contributor:</DialogDescription>
        </DialogHeader>
        <div className="p-3 rounded-lg" style={{ background: "rgba(15,23,42,0.07)", border: "1px solid rgba(15,23,42,0.1)" }}>
          <div className="text-sm font-semibold" style={{ color: "#23273A" }}>Payments Platform</div>
          <div className="text-xs mt-0.5" style={{ color: "#8A93A6" }}>Acme Engineering</div>
        </div>
        <DialogFooter className="sm:flex-col gap-2">
          <button onClick={onAccept} className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ background: "#6366f1", color: "#fff" }}>
            Accept Invitation
          </button>
          <DialogClose asChild>
            <button className="w-full py-2 text-xs" style={{ color: "#8A93A6" }}>Reject</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING FLOW
// ═══════════════════════════════════════════════════════════════════════════════

function getPreviousStep(step: FlowStep, selectedJobRole: JobRole): FlowStep | null {
  switch (step) {
    case "login":
      return "landing";
    case "create-account":
      return "landing";
    case "workspace":
      return "create-account";
    case "connect-sources":
      return selectedJobRole === "Project Manager" ? "workspace" : "create-account";
    case "privacy-review":
      return "connect-sources";
    case "processing":
      return "privacy-review";
    default:
      return null;
  }
}

function OnboardingFlow({
  step,
  selectedJobRole,
  connectedSources,
  onStep,
  onBack,
  onSelectJobRole,
  setConnectedSources,
  onCompleteSignup,
}: {
  step: FlowStep;
  selectedJobRole: JobRole;
  connectedSources: string[];
  onStep: (s: FlowStep) => void;
  onBack: (s: FlowStep) => void;
  onSelectJobRole: (role: JobRole) => void;
  setConnectedSources: React.Dispatch<React.SetStateAction<string[]>>;
  onCompleteSignup: () => void;
}) {
  const prevStep = getPreviousStep(step, selectedJobRole);
  const handleBack = prevStep ? () => onBack(prevStep) : undefined;

  if (step === "landing") return <OnboardLanding onStep={onStep} />;
  if (step === "login") return <OnboardLogin onStep={onStep} onBack={handleBack} />;
  if (step === "create-account") return <OnboardCreateAccount onNext={() => { onCompleteSignup(); onStep(selectedJobRole === "Project Manager" ? "workspace" : "connect-sources"); }} selectedRole={selectedJobRole} onSelectRole={onSelectJobRole} onBack={handleBack} />;
  if (step === "workspace") return <OnboardWorkspace onStep={onStep} onBack={handleBack} />;
  if (step === "connect-sources") return <OnboardConnectSources connectedSources={connectedSources} setConnectedSources={setConnectedSources} onStep={onStep} onBack={handleBack} />;
  if (step === "privacy-review") return <OnboardPrivacyReview connectedSources={connectedSources} onStep={onStep} onBack={handleBack} />;
  if (step === "processing") return <OnboardProcessing onStep={onStep} onBack={handleBack} />;
  return null;
}

// Shared onboarding chrome
function OnboardShell({ step, total, children, onBack }: { step: number; total: number; children: React.ReactNode; onBack?: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "#F3F4F7", fontFamily: "'Inter', sans-serif" }}>
      {/* logo */}
      <div className="flex items-center gap-2.5 mb-8">
        <LogoMark size={32} />
        <LogoWordmark size={17} />
      </div>
      {/* progress */}
      {onBack && (
        <div className="w-full max-w-md mb-4">
          <button onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            ← Back
          </button>
        </div>
      )}
      {total > 0 && (
        <div className="w-full max-w-md mb-6">
          <div className="h-0.5 rounded-full" style={{ background: "rgba(15,23,42,0.1)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(step / total) * 100}%`, background: "#6366f1" }} />
          </div>
          <div className="text-[10px] mt-1.5 text-right" style={{ fontFamily: "'DM Mono', monospace", color: "#8A93A6" }}>Step {step} of {total}</div>
        </div>
      )}
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

function OnboardCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-7" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
      {children}
    </div>
  );
}

function OnboardBtn({ label, onClick, secondary = false }: { label: string; onClick: () => void; secondary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
      style={secondary
        ? { background: "rgba(15,23,42,0.09)", color: "#5B6478", border: "1px solid rgba(15,23,42,0.12)" }
        : { background: "#6366f1", color: "#fff" }}
    >
      {label}
    </button>
  );
}

function OnboardField({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#3D4459" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full text-sm px-3 py-2.5 rounded-lg"
        style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }}
      />
    </div>
  );
}

// 1. Landing
function OnboardLanding({ onStep }: { onStep: (s: FlowStep) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F3F4F7", fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center gap-3 mb-12">
        <LogoMark size={40} />
        <LogoWordmark size={22} />
      </div>
      <div className="text-center max-w-lg mb-10">
        <h1 className="text-3xl font-semibold mb-4" style={{ color: "#23273A" }}>Collaboration Intelligence for Better Team Decisions</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
          Surface delivery risks, knowledge dependencies and contribution evidence from the tools your team already uses.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-72">
        <button onClick={() => onStep("create-account")} className="w-full py-3 rounded-lg text-sm font-semibold transition-colors" style={{ background: "#6366f1", color: "#fff" }}>
          Get Started
        </button>
        <button onClick={() => onStep("login")} className="w-full py-3 rounded-lg text-sm font-medium border transition-colors" style={{ background: "transparent", borderColor: "rgba(15,23,42,0.15)", color: "#3D4459" }}>
          Sign In
        </button>
      </div>
      <p className="text-[11px] mt-8 text-center max-w-xs leading-relaxed" style={{ color: "#8A93A6" }}>
        TeamPulse supports managerial decisions. It does not score or rank employees.
      </p>
      {/* data sources note */}
      <div className="flex items-center gap-5 mt-12">
        {["Jira", "GitHub", "Confluence"].map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs" style={{ color: "#A9AFC0" }}>
            <CheckCircle2 size={11} color="#8A93A6" /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Login
function OnboardLogin({ onStep }: { onStep: (s: FlowStep) => void }) {
  return (
    <OnboardShell step={0} total={0}>
      <OnboardCard>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Welcome back</h2>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>Sign in to your TeamPulse account.</p>
        <div className="space-y-4 mb-5">
          <OnboardField label="Work Email" placeholder="manager@company.com" type="email" />
          <OnboardField label="Password" placeholder="••••••••" type="password" />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "#6B7280" }}>
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <button className="text-xs" style={{ color: "#6366f1" }}>Forgot password?</button>
          </div>
        </div>
        <OnboardBtn label="Sign In" onClick={() => onStep("app")} />
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "rgba(15,23,42,0.1)" }} />
          <span className="text-[10px]" style={{ color: "#8A93A6" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(15,23,42,0.1)" }} />
        </div>
        <div className="space-y-2">
          <button className="w-full py-2 rounded-lg text-xs border transition-colors" style={{ borderColor: "rgba(15,23,42,0.12)", color: "#5B6478" }}>Continue with Google</button>
          <button className="w-full py-2 rounded-lg text-xs border transition-colors" style={{ borderColor: "rgba(15,23,42,0.12)", color: "#5B6478" }}>Continue with Microsoft</button>
        </div>
        <p className="text-[11px] text-center mt-5" style={{ color: "#8A93A6" }}>
          New to TeamPulse?{" "}
          <button onClick={() => onStep("create-account")} className="underline" style={{ color: "#6366f1" }}>Create Workspace</button>
        </p>
      </OnboardCard>
    </OnboardShell>
  );
}

// 3. Create Account
function OnboardCreateAccount({
  onNext,
  selectedRole,
  onSelectRole,
  onBack,
}: {
  onNext: () => void;
  selectedRole: JobRole;
  onSelectRole: (role: JobRole) => void;
  onBack?: () => void;
}) {
  return (
    <OnboardShell step={1} total={4} onBack={onBack}>
      <OnboardCard>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Create your TeamPulse account</h2>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>Job role is for context only — access permissions are set within your workspace.</p>
        <div className="space-y-4 mb-5">
          <OnboardField label="Full Name" placeholder="Sarah Chen" />
          <OnboardField label="Work Email" placeholder="sarah@acme.com" type="email" />
          <OnboardField label="Password" placeholder="••••••••" type="password" />
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#3D4459" }}>Job Role</label>
            <select
              value={selectedRole}
              onChange={(event) => onSelectRole(event.target.value as JobRole)}
              className="w-full text-sm px-3 py-2.5 rounded-lg appearance-none"
              style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }}
            >
              <option>Project Manager</option>
              <option>Engineering Manager</option>
              <option>Team Lead</option>
              <option>Developer / Contributor</option>
              <option>Other</option>
            </select>
          </div>
          <label className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: "#6B7280" }}>
            <input type="checkbox" className="mt-0.5 rounded" defaultChecked />
            <span>I agree to TeamPulse's data and privacy policy.</span>
          </label>
        </div>
        <OnboardBtn label="Create Account" onClick={onNext} />
      </OnboardCard>
    </OnboardShell>
  );
}

// 4. Workspace Setup
function OnboardWorkspace({ onStep, onBack }: { onStep: (s: FlowStep) => void; onBack?: () => void }) {
  return (
    <OnboardShell step={2} total={4} onBack={onBack}>
      <OnboardCard>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Set up your workspace</h2>
        <p className="text-xs mb-6" style={{ color: "#6B7280" }}>A workspace groups your projects and team. You can connect multiple projects later.</p>
        <div className="space-y-4 mb-5">
          <OnboardField label="Workspace Name" placeholder="Acme Engineering" />
          <OnboardField label="Your Role" placeholder="Project Manager" />
          <OnboardField label="Team Name" placeholder="Payments Platform" />
        </div>
        <OnboardBtn label="Continue" onClick={() => onStep("connect-sources")} />
        <button className="w-full text-xs text-center mt-3" style={{ color: "#8A93A6" }}>
          Have an invitation? Join an existing workspace
        </button>
      </OnboardCard>
    </OnboardShell>
  );
}

// 5. Connect Data Sources
function OnboardConnectSources({ connectedSources, setConnectedSources, onStep, onBack }: { connectedSources: string[]; setConnectedSources: React.Dispatch<React.SetStateAction<string[]>>; onStep: (s: FlowStep) => void; onBack?: () => void }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const sources = [
    { name: "Jira", desc: "Task status · assignees · sprints · blockers · estimates" },
    { name: "GitHub", desc: "Pull requests · reviews · repository activity" },
    { name: "Confluence", desc: "Documentation activity · ownership" },
  ];

  const openConnectDialog = (name: string) => {
    if (!connectedSources.includes(name)) {
      setSelectedSource(name);
      setIsDialogOpen(true);
    }
  };

  const completeConnection = (name: string) => {
    setConnectedSources((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setIsDialogOpen(false);
    setSelectedSource(null);
  };

  return (
    <OnboardShell step={3} total={4} onBack={onBack}>
      <OnboardCard>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Connect your work tools</h2>
        <p className="text-xs mb-6 leading-relaxed" style={{ color: "#6B7280" }}>
          TeamPulse uses project metadata to surface team-level conditions. Connect only the sources you want analyzed.
        </p>
        <div className="space-y-3 mb-5">
          {sources.map((s) => (
            <div key={s.name} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: connectedSources.includes(s.name) ? "#6366f1" : "rgba(15,23,42,0.11)", background: connectedSources.includes(s.name) ? "rgba(99,102,241,0.06)" : "transparent" }}>
              <div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "#23273A" }}>{s.name}</div>
                <div className="text-[11px]" style={{ color: "#8A93A6" }}>{s.desc}</div>
              </div>
              <button
                onClick={() => openConnectDialog(s.name)}
                className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
                style={connectedSources.includes(s.name)
                  ? { background: "rgba(34,197,94,0.12)", color: "#22c55e" }
                  : { background: "rgba(99,102,241,0.12)", color: "#4F46E5" }}
              >
                {connectedSources.includes(s.name) ? "✓ Connected" : `Connect ${s.name}`}
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-lg mb-5" style={{ background: "rgba(15,23,42,0.06)", border: "1px solid rgba(15,23,42,0.1)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "#8A93A6" }}>TeamPulse does not collect</div>
          <div className="text-[11px]" style={{ color: "#6B7280" }}>Private messages · keystrokes · screen activity · webcam / microphone</div>
        </div>
        <OnboardBtn label="Continue" onClick={() => onStep("privacy-review")} />
      </OnboardCard>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {selectedSource}</DialogTitle>
            <DialogDescription>
              Choose how you’d like to connect {selectedSource?.toLowerCase()} for TeamPulse.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            <button
              onClick={() => selectedSource && completeConnection(selectedSource)}
              className="w-full rounded-lg py-3 text-sm font-medium"
              style={{ background: "#6366f1", color: "#fff" }}
            >
              Connect with Google
            </button>
            <button
              onClick={() => selectedSource && completeConnection(selectedSource)}
              className="w-full rounded-lg py-3 text-sm font-medium border"
              style={{ background: "transparent", borderColor: "rgba(15,23,42,0.18)", color: "#3D4459" }}
            >
              Connect with work email
            </button>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <button className="w-full rounded-lg py-3 text-sm font-medium" style={{ background: "rgba(15,23,42,0.09)", color: "#3D4459" }}>
                Cancel
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </OnboardShell>
  );
}

// 9. Privacy Review
function OnboardPrivacyReview({ connectedSources, onStep, onBack }: { connectedSources: string[]; onStep: (s: FlowStep) => void; onBack?: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const connectedList = connectedSources.map((source) => {
    switch (source) {
      case "Jira":
        return "✓ Jira — Payments Platform";
      case "GitHub":
        return "✓ GitHub — payments-api";
      case "Confluence":
        return "✓ Confluence — Payments Space";
      default:
        return `✓ ${source}`;
    }
  });

  return (
    <OnboardShell step={4} total={4} onBack={onBack}>
      <OnboardCard>
        <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Review what TeamPulse will analyse</h2>
        <p className="text-xs mb-5" style={{ color: "#6B7280" }}>Before we start, confirm what is and isn't collected in your workspace.</p>
        <div className="grid grid-cols-2 gap-3 mb-4 text-[11px]">
          <div className="p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.12)" }}>
            <div className="font-semibold mb-2" style={{ color: "#22c55e" }}>Connected</div>
            {connectedList.length > 0 ? (
              connectedList.map((s) => (
                <div key={s} className="mb-1" style={{ color: "#3D4459" }}>{s}</div>
              ))
            ) : (
              <div className="text-sm" style={{ color: "#3D4459" }}>No tools connected yet.</div>
            )}
            <div className="mt-2 pt-2 border-t" style={{ borderColor: "rgba(34,197,94,0.1)", color: "#8A93A6" }}>5 contributors</div>
          </div>
          <div>
            <div className="p-3 rounded-lg mb-2" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
              <div className="font-semibold mb-1.5" style={{ color: "#4F46E5" }}>TeamPulse will analyse</div>
              {["Delivery workflow metadata", "PR/review distribution", "Documentation activity"].map((s) => (
                <div key={s} className="flex items-center gap-1.5 mb-0.5" style={{ color: "#6B7280" }}><CheckCircle2 size={9} color="#6366f1" />{s}</div>
              ))}
            </div>
            <div className="p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}>
              <div className="font-semibold mb-1.5" style={{ color: "#ef4444" }}>Will not analyse</div>
              {["Private messages", "Screens / keystrokes", "Emotional state", "Employee personality"].map((s) => (
                <div key={s} className="flex items-center gap-1.5 mb-0.5" style={{ color: "#6B7280" }}><X size={9} color="#ef4444" />{s}</div>
              ))}
            </div>
          </div>
        </div>
        <label className="flex items-start gap-2.5 text-xs cursor-pointer mb-5" style={{ color: "#5B6478" }}>
          <input type="checkbox" className="mt-0.5 rounded shrink-0" checked={agreed} onChange={() => setAgreed(!agreed)} />
          I understand TeamPulse provides decision-support signals, not employee performance scores.
        </label>
        <button
          onClick={() => { if (agreed) onStep("processing"); }}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{ background: agreed ? "#6366f1" : "rgba(99,102,241,0.2)", color: agreed ? "#fff" : "#6B7280", cursor: agreed ? "pointer" : "not-allowed" }}
        >
          Start TeamPulse
        </button>
      </OnboardCard>
    </OnboardShell>
  );
}

// 10. Processing
function OnboardProcessing({ onStep, onBack }: { onStep: (s: FlowStep) => void; onBack?: () => void }) {
  const [done, setDone] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  const steps = [
    "Jira project connected",
    "5 contributors identified",
    "Sprint history imported",
    "GitHub identities mapped",
    "Contribution evidence organised",
    "Analysing team-level patterns...",
  ];

  useEffect(() => {
    if (stepIdx < steps.length) {
      const t = setTimeout(() => setStepIdx((i) => i + 1), 550);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [stepIdx]);

  return (
    <OnboardShell step={0} total={0} onBack={onBack}>
      <div className="flex items-center gap-2.5 mb-10">
        <LogoMark size={32} />
        <LogoWordmark size={17} />
      </div>
      {!done ? (
        <div className="w-80">
          <div className="text-sm font-medium mb-6 text-center" style={{ color: "#3D4459" }}>Preparing your TeamPulse workspace...</div>
          <div className="space-y-2.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-xs" style={{ color: i < stepIdx ? "#22c55e" : i === stepIdx ? "#3D4459" : "#A9AFC0" }}>
                {i < stepIdx ? (
                  <CheckCircle2 size={13} color="#22c55e" />
                ) : i === stepIdx ? (
                  <Loader2 size={13} className="animate-spin" color="#6366f1" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: "#A9AFC0" }} />
                )}
                {s}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)" }}>
            <CheckCircle2 size={28} color="#22c55e" />
          </div>
          <div className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Workspace ready</div>
          <div className="text-sm mb-6" style={{ color: "#6B7280" }}>3 conditions need your attention</div>
          <button onClick={() => onStep("app")} className="flex items-center gap-2 mx-auto text-sm px-5 py-2.5 rounded-lg font-medium" style={{ background: "#6366f1", color: "#fff" }}>
            Go to Dashboard <ArrowRight size={14} />
          </button>
        </div>
      )}
    </OnboardShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMPLOYEE INVITATION FLOW (invite accept/reject is a popup — see InvitationDialog)
// ═══════════════════════════════════════════════════════════════════════════════

function EmployeeFlow({ step, onStep }: { step: FlowStep; onStep: (s: FlowStep) => void }) {
  if (step === "emp-data") return <EmpDataConfirm onStep={onStep} />;
  return <EmpHome onStep={onStep} />;
}

function EmpDataConfirm({ onStep }: { onStep: (s: FlowStep) => void }) {
  const attrs = [
    { source: "Jira", identity: "Priya Sharma" },
    { source: "GitHub", identity: "priya-s" },
    { source: "Confluence", identity: "Priya Sharma" },
  ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F3F4F7", fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center gap-2.5 mb-10">
        <LogoMark size={32} />
        <LogoWordmark size={17} />
      </div>
      <div className="w-full max-w-sm">
        <div className="p-7 rounded-xl border" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
          <h2 className="text-lg font-semibold mb-1" style={{ color: "#23273A" }}>Your data in TeamPulse</h2>
          <p className="text-xs mb-5 leading-relaxed" style={{ color: "#6B7280" }}>
            TeamPulse currently associates the following identities with your account. You can review evidence, add context, and report inaccuracies.
          </p>
          <div className="space-y-2.5 mb-5">
            {attrs.map((a) => (
              <div key={a.source} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.1)" }}>
                <span className="text-xs font-medium" style={{ color: "#3D4459" }}>{a.source}</span>
                <span className="text-xs" style={{ fontFamily: "'DM Mono', monospace", color: "#22c55e" }}>✓ {a.identity}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg text-[11px] leading-relaxed mb-5" style={{ background: "rgba(15,23,42,0.06)", color: "#8A93A6" }}>
            Evidence attributed to you is visible only to you and your manager. You can dispute or add context to any item.
          </div>
          <button onClick={() => onStep("emp-home")} className="w-full py-2.5 rounded-lg text-sm font-medium" style={{ background: "#6366f1", color: "#fff" }}>
            Looks Correct
          </button>
        </div>
      </div>
    </div>
  );
}

function EmpHome({ onStep }: { onStep: (s: FlowStep) => void }) {
  return (
    <div className="min-h-screen" style={{ background: "#F3F4F7", fontFamily: "'Inter', sans-serif" }}>
      {/* Mini header */}
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
        <div className="flex items-center gap-2">
          <LogoMark size={22} />
          <LogoWordmark size={13} />
          <span className="text-xs ml-2" style={{ color: "#8A93A6" }}>Payments Platform</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-[9px] font-bold text-white">PS</div>
          <span className="text-xs" style={{ color: "#3D4459" }}>Priya Sharma</span>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#8A93A6" }}>Sprint 23 · Jul 24</div>
          <h1 className="text-xl font-semibold" style={{ color: "#23273A" }}>Good morning, Priya</h1>
        </div>
        <div className="space-y-4">
          {/* Weekly Pulse */}
          <div className="p-5 rounded-xl border" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold" style={{ color: "#23273A" }}>Your Weekly Pulse</div>
                <div className="text-xs mt-0.5" style={{ color: "#8A93A6" }}>Not submitted this week</div>
              </div>
              <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
            </div>
            <button onClick={() => onStep("app")} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>
              Complete this week's pulse
            </button>
          </div>
          {/* Contribution Evidence */}
          <div className="p-5 rounded-xl border" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#23273A" }}>Contribution Evidence</div>
            <div className="text-xs mb-3" style={{ color: "#8A93A6" }}>6 recent items this sprint</div>
            <div className="space-y-2 text-xs" style={{ color: "#6B7280" }}>
              {["Jira — TASK-119 closed", "GitHub — PR #88 reviewed", "Confluence — Auth guide updated"].map((e) => (
                <div key={e} className="flex items-center gap-2">
                  <CheckCircle2 size={10} color="#8A93A6" /> {e}
                </div>
              ))}
            </div>
          </div>
          {/* Context requested */}
          <div className="p-5 rounded-xl border" style={{ background: "#FFFFFF", borderColor: "rgba(245,158,11,0.2)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#f59e0b" }}>Context requested</div>
            <div className="text-xs mb-3" style={{ color: "#3D4459" }}>TASK-231 exceeded expected completion date. Your context helps give this signal meaning.</div>
            <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>Add Context</button>
          </div>
          {/* Peer context */}
          <div className="p-5 rounded-xl border" style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: "#23273A" }}>Recent Peer Context</div>
            <div className="text-xs" style={{ color: "#3D4459" }}>Liam Torres added context about your authentication support on Jul 20.</div>
          </div>
        </div>
        <button onClick={() => onStep("app")} className="mt-6 text-xs" style={{ color: "#8A93A6" }}>← Back to manager demo view</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTRIBUTOR VIEW (role = contributor, inside main app shell)
// ═══════════════════════════════════════════════════════════════════════════════

function ContributorView({ page }: { page: ContribPage }) {
  if (page === "my-overview") return <ContribOverview />;
  if (page === "my-contributions") return <ContribContributions />;
  if (page === "my-pulse") return <SubmitPulse />;
  if (page === "my-data") return <MyData />;
  if (page === "my-profile") return <ContribProfile />;
  return <ContribTeamContext />;
}

function ContribOverview() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "#8A93A6" }}>Sprint 23 · Jul 24</div>
        <h1 className="text-xl font-semibold" style={{ color: "#23273A" }}>Good morning, Priya</h1>
        <p className="text-xs mt-1" style={{ color: "#8A93A6" }}>Your responses provide context to project signals and are not used to calculate a performance score.</p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Card>
          <Label>Weekly Pulse</Label>
          <div className="text-sm font-medium mb-3" style={{ color: "#f59e0b" }}>Not submitted this week</div>
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>Complete Pulse</button>
        </Card>
        <Card>
          <Label>Contribution Evidence</Label>
          <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "#23273A" }}>6</div>
          <div className="text-xs" style={{ color: "#8A93A6" }}>items this sprint</div>
        </Card>
        <Card>
          <Label>Context Requested</Label>
          <div className="text-xs mb-2" style={{ color: "#3D4459" }}>TASK-231 exceeded expected completion date.</div>
          <button className="text-xs px-3 py-1.5 rounded-lg font-medium" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>Add Context</button>
        </Card>
        <Card>
          <Label>Recent Peer Context</Label>
          <div className="text-xs" style={{ color: "#3D4459" }}>Liam Torres added context about your authentication support on Jul 20.</div>
        </Card>
      </div>
    </div>
  );
}

function ContribContributions() {
  const [tab, setTab] = useState<"Timeline" | "Add Context" | "Peer Context">("Timeline");

  return (
    <div>
      <SectionHeader title="Contributions" subtitle="Evidence from connected systems and contextual contributions. Sprint 23." />
      <div className="flex flex-wrap gap-2 mb-5">
        {(["Timeline", "Add Context", "Peer Context"] as const).map((option) => (
          <button
            key={option}
            onClick={() => setTab(option)}
            className="text-xs px-3 py-2 rounded-lg border transition-colors"
            style={{
              borderColor: tab === option ? "#6366f1" : "rgba(15,23,42,0.12)",
              background: tab === option ? "rgba(99,102,241,0.12)" : "transparent",
              color: tab === option ? "#23273A" : "#3D4459",
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {tab === "Timeline" ? <ContribTimeline /> : tab === "Add Context" ? <AddContext /> : <PeerContext />}
    </div>
  );
}

function ContribTeamContext() {
  return (
    <div>
      <SectionHeader title="Team Context" subtitle="High-level sprint and collaboration signals visible to all team members." />
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <Label>Sprint Progress</Label>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-2xl font-bold" style={{ fontFamily: "'DM Mono', monospace", color: "#23273A" }}>64%</span>
            <span className="text-xs mb-0.5" style={{ color: "#8A93A6" }}>Sprint 23 complete</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full" style={{ background: "rgba(15,23,42,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "64%", background: "#6366f1" }} />
          </div>
        </Card>
        <Card>
          <Label>Team Conditions</Label>
          <div className="space-y-1.5 mt-1">
            {[["Delivery", "Stable →"], ["Collaboration", "Stable →"]].map(([l, v]) => (
              <div key={l as string} className="flex items-center justify-between text-xs">
                <span style={{ color: "#5B6478" }}>{l}</span>
                <span style={{ color: (v as string).includes("Attention") ? "#f59e0b" : "#4F46E5" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ContribProfile() {
  return (
    <div>
      <SectionHeader title="Individual Profile" subtitle="Your current contribution evidence and recent collaboration signals." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <Label>Contribution Evidence</Label>
          <div className="text-5xl font-semibold" style={{ color: "#23273A", fontFamily: "'DM Mono', monospace" }}>6</div>
          <div className="text-xs" style={{ color: "#3D4459" }}>Evidence items this sprint</div>
        </Card>
        <Card>
          <Label>Status Snapshot</Label>
          <div className="text-xs leading-relaxed" style={{ color: "#3D4459" }}>
            Blockers: Minor
            <br />
            Context requested: None
          </div>
        </Card>
        <Card>
          <Label>Recent Peer Support</Label>
          <div className="text-xs" style={{ color: "#3D4459" }}>
            Priya helped unblock a cross-team API integration on Jul 20 and added context to TASK-231.
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <Label>Recent Contribution Timeline</Label>
        <div className="space-y-3 mt-3">
          {[
            { date: "Jul 24", desc: "Closed TASK-119 — Auth Token Refresh Logic", source: "Jira" },
            { date: "Jul 22", desc: "Resolved authentication incident", source: "Jira" },
            { date: "Jul 21", desc: "Reviewed payment integration PR #88", source: "GitHub" },
            { date: "Jul 19", desc: "Updated API authentication guide", source: "Confluence" },
          ].map((item) => (
            <div key={item.desc} className="flex items-start gap-3">
              <Mono className="text-[10px] w-16 shrink-0" style={{ color: "#8A93A6" }}>{item.date}</Mono>
              <div className="text-[11px]" style={{ color: "#3D4459" }}>{item.desc}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.08)", color: "#4F46E5" }}>{item.source}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Contributor-only shared components (Timeline, Add/Peer Context, Weekly Pulse form, My Data)
// ═══════════════════════════════════════════════════════════════════════════════

function ContribTimeline() {
  const entries = [
    { date: "Jul 24", source: "Jira", type: "Delivery", desc: "Closed TASK-119 — Refresh token endpoint", member: "Priya Sharma" },
    { date: "Jul 23", source: "GitHub", type: "Review", desc: "Reviewed payment integration PR #88", member: "Liam Torres" },
    { date: "Jul 22", source: "Peer Context", type: "Collaboration", desc: "Helped Ji-yeon unblock CORS configuration issue", member: "Marcus Webb" },
    { date: "Jul 21", source: "Confluence", type: "Documentation", desc: "Updated API authentication guide", member: "Priya Sharma" },
    { date: "Jul 20", source: "Self-added", type: "Cross-team", desc: "Supported Platform team during API outage · Manager validated", member: "Ananya Iyer" },
    { date: "Jul 18", source: "Jira", type: "Delivery", desc: "Resolved production authentication incident (blocker cleared)", member: "Priya Sharma" },
  ];

  const sourceColor: Record<string, string> = {
    "Jira": "#6366f1",
    "GitHub": "#22c55e",
    "Peer Context": "#f59e0b",
    "Confluence": "#38bdf8",
    "Self-added": "#7C3AED",
  };

  return (
    <div>
      <SectionHeader title="Contribution Timeline" subtitle="Automatically captured digital signals combined with voluntary contextual contributions. No scoring." />
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: "rgba(15,23,42,0.1)" }} />
        <div className="space-y-3">
          {entries.map((e) => (
            <div key={e.desc} className="relative">
              <div className="absolute -left-[18px] top-3 w-2.5 h-2.5 rounded-full border" style={{ background: "#FFFFFF", borderColor: sourceColor[e.source] }} />
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: `${sourceColor[e.source]}15`, color: sourceColor[e.source], fontFamily: "'DM Mono', monospace" }}>{e.source}</span>
                    <div>
                      <div className="text-xs font-medium" style={{ color: "#23273A" }}>{e.desc}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#6B7280" }}>{e.member} · {e.type}</div>
                    </div>
                  </div>
                  <Mono className="text-[10px] shrink-0" style={{ color: "#8A93A6" }}>{e.date}</Mono>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddContext() {
  const [type, setType] = useState("Peer Support");
  const types = ["Peer Support", "Mentoring", "Problem Solving", "Incident Support", "Knowledge Sharing", "Documentation", "Cross-Team Assistance", "Other"];

  return (
    <div>
      <SectionHeader title="Add Contribution Context" subtitle="Log work not automatically captured. Voluntary — under 30 seconds. Goes into your contribution timeline as evidence." />
      <Card>
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <Label>Contribution Type</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
                  style={{
                    borderColor: type === t ? "#6366f1" : "rgba(15,23,42,0.12)",
                    background: type === t ? "rgba(99,102,241,0.12)" : "transparent",
                    color: type === t ? "#4F46E5" : "#8A93A6",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <Label>What happened?</Label>
              <textarea
                rows={3}
                className="w-full mt-0.5 text-xs px-3 py-2 rounded-md resize-none"
                placeholder="Helped another team resolve authentication API issue."
                style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Related task (optional)</Label>
                <input className="w-full text-xs px-3 py-1.5 rounded-md" placeholder="TASK-318" style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }} />
              </div>
              <div>
                <Label>Outcome (optional)</Label>
                <input className="w-full text-xs px-3 py-1.5 rounded-md" placeholder="Unblocked deployment." style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }} />
              </div>
            </div>
            <button className="text-xs px-4 py-2 rounded-lg font-medium self-start" style={{ background: "#6366f1", color: "#fff" }}>Add to Timeline</button>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <Label>Recent Self-Added Context</Label>
        <div className="space-y-2 mt-1">
          {[
            { type: "Incident Support", desc: "Supported Platform team during API outage", outcome: "Service restored within 40 min", date: "Jul 20", validated: true },
            { type: "Cross-Team Assistance", desc: "Reviewed authentication schema with Backend team", outcome: "Alignment reached before implementation", date: "Jul 16", validated: false },
          ].map((e) => (
            <div key={e.desc} className="flex items-start gap-3 p-2.5 rounded-md" style={{ background: "rgba(15,23,42,0.05)" }}>
              <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: "rgba(167,139,250,0.1)", color: "#7C3AED", fontFamily: "'DM Mono', monospace" }}>{e.type}</span>
              <div className="flex-1 text-xs" style={{ color: "#3D4459" }}>
                {e.desc}
                {e.validated && <span className="ml-2 text-[10px]" style={{ color: "#22c55e" }}>· Manager validated</span>}
              </div>
              <Mono className="text-[10px] shrink-0" style={{ color: "#8A93A6" }}>{e.date}</Mono>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function PeerContext() {
  const [selected, setSelected] = useState("Priya Sharma");
  const [helpType, setHelpType] = useState("Helped unblock my work");
  const members = ["Priya Sharma", "Liam Torres", "Ji-yeon Park", "Marcus Webb", "Ananya Iyer"];
  const helpTypes = ["Helped unblock my work", "Shared knowledge", "Reviewed my work", "Mentored me", "Solved a problem together", "Other"];

  return (
    <div>
      <SectionHeader
        title="Peer Contribution Context"
        subtitle="Add context when a colleague contributed to your work. This becomes evidence in their contribution timeline — not a vote, point, or rating."
      />
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
        <Card>
          <div className="text-sm font-semibold mb-4" style={{ color: "#23273A" }}>Add Contribution Context</div>
          <div className="mb-4">
            <Label>Who contributed?</Label>
            <div className="flex flex-col gap-1.5 mt-1">
              {members.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelected(m)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left border transition-colors"
                  style={{
                    borderColor: selected === m ? "#6366f1" : "rgba(15,23,42,0.1)",
                    background: selected === m ? "rgba(99,102,241,0.08)" : "transparent",
                    color: selected === m ? "#23273A" : "#5B6478",
                  }}
                >
                  <div className="w-6 h-6 rounded-full text-[10px] flex items-center justify-center font-bold text-white bg-indigo-700 shrink-0">
                    {m.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-xs">{m}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <Label>What happened?</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {helpTypes.map((h) => (
                <button key={h} onClick={() => setHelpType(h)} className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
                  style={{ borderColor: helpType === h ? "#6366f1" : "rgba(15,23,42,0.1)", background: helpType === h ? "rgba(99,102,241,0.12)" : "transparent", color: helpType === h ? "#4F46E5" : "#8A93A6" }}>
                  {h}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label>Related task (optional)</Label>
              <input className="w-full text-xs px-3 py-1.5 rounded-md" placeholder="TASK-318" style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }} />
            </div>
            <div>
              <Label>Outcome / context (optional)</Label>
              <input className="w-full text-xs px-3 py-1.5 rounded-md" placeholder="Resolved dependency before release." style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }} />
            </div>
          </div>
          <div className="mb-4 p-3 rounded-md text-[11px] leading-relaxed" style={{ background: "rgba(15,23,42,0.06)", color: "#8A93A6" }}>
            This context is added as evidence to {selected.split(" ")[0]}'s contribution timeline. It is not a vote, rating, or recognition score.
          </div>
          <button className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "#6366f1", color: "#fff" }}>Submit Context</button>
        </Card>

        <Card>
          <Label>Recent Peer Context Added</Label>
          <div className="space-y-3 mt-1">
            {[
              { from: "Ji-yeon Park", to: "Marcus Webb", type: "Solved a problem together", task: "TASK-248", outcome: "CORS config resolved — blocker cleared same day.", date: "Jul 22" },
              { from: "Liam Torres", to: "Priya Sharma", type: "Shared knowledge", task: "TASK-241", outcome: "Auth token refresh approach clarified before implementation.", date: "Jul 20" },
              { from: "Priya Sharma", to: "Ananya Iyer", type: "Helped unblock my work", task: "TASK-255", outcome: "Regression caught in staging before merge.", date: "Jul 18" },
            ].map((r) => (
              <div key={r.outcome} className="p-3 rounded-lg" style={{ background: "rgba(15,23,42,0.06)" }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[11px]" style={{ color: "#6B7280" }}>
                    <span style={{ color: "#3D4459" }}>{r.to}</span> — context by {r.from}
                  </div>
                  <Mono className="text-[10px]" style={{ color: "#8A93A6" }}>{r.date}</Mono>
                </div>
                <div className="text-[10px] px-1.5 py-0.5 rounded inline-block mb-1" style={{ background: "rgba(99,102,241,0.08)", color: "#4F46E5" }}>{r.type}</div>
                <p className="text-[11px]" style={{ color: "#5B6478" }}>{r.outcome}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SubmitPulse() {
  const [workload, setWorkload] = useState<string | null>(null);
  const [blockers, setBlockers] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const Select = ({ opts, val, set }: { opts: string[]; val: string | null; set: (v: string) => void }) => (
    <div className="flex gap-2">
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => set(o)}
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={{
            borderColor: val === o ? "#6366f1" : "rgba(15,23,42,0.12)",
            background: val === o ? "rgba(99,102,241,0.12)" : "transparent",
            color: val === o ? "#4F46E5" : "#6B7280",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <SectionHeader title="Weekly Team Pulse" />
      <div className="p-3 rounded-lg mb-5 text-xs" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", color: "#6B7280" }}>
        Your responses provide context to project signals and are not used to calculate a performance score.
      </div>
      <Card>
        <div className="text-sm font-semibold mb-5" style={{ color: "#23273A" }}>This week — Sprint 23</div>
        <div className="space-y-6">
          <div>
            <div className="text-sm mb-2" style={{ color: "#3D4459" }}>My workload currently feels:</div>
            <Select opts={["Too Low", "Manageable", "High", "Unsustainable"]} val={workload} set={setWorkload} />
          </div>
          <div>
            <div className="text-sm mb-2" style={{ color: "#3D4459" }}>I currently have blockers:</div>
            <Select opts={["None", "Minor", "Significant"]} val={blockers} set={setBlockers} />
          </div>
          <div>
            <div className="text-sm mb-2" style={{ color: "#3D4459" }}>I have the information / context needed to do my work:</div>
            <Select opts={["Yes", "Partially", "No"]} val={info} set={setInfo} />
          </div>
          <div>
            <div className="text-sm mb-2" style={{ color: "#3D4459" }}>Anything your manager should know? <span style={{ color: "#8A93A6" }}>(optional)</span></div>
            <textarea
              rows={3}
              className="w-full text-xs px-3 py-2 rounded-lg resize-none"
              placeholder="Open text — context that project data can't capture..."
              style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }}
            />
          </div>
          <button className="text-sm px-5 py-2.5 rounded-lg font-medium" style={{ background: "#6366f1", color: "#fff" }}>Submit Pulse</button>
        </div>
      </Card>
    </div>
  );
}

function MyData() {
  const [contextTarget, setContextTarget] = useState<string | null>(null);

  const items = [
    { id: "TASK-231", source: "Jira", desc: "TASK-231 exceeded expected completion date by 3 days.", date: "Jul 15", status: "flagged", context: null },
    { id: "PR-88", source: "GitHub", desc: "Reviewed payment integration PR #88.", date: "Jul 21", status: "accurate", context: null },
    { id: "DOC-41", source: "Confluence", desc: "Updated API authentication guide.", date: "Jul 19", status: "accurate", context: null },
    { id: "PEER-22", source: "Peer Context", desc: "Helped Ji-yeon unblock CORS configuration issue.", date: "Jul 22", status: "accurate", context: "This took about 2 hours and required reviewing 3 different services." },
  ];

  return (
    <div>
      <SectionHeader title="My TeamPulse Data" subtitle="Evidence attributed to you from connected systems and peer context. You can add context or report inaccuracies." />
      <div className="space-y-3">
        {items.map((it) => (
          <Card key={it.id}>
            <div className="flex items-start gap-3">
              <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0 mt-0.5" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5", fontFamily: "'DM Mono', monospace" }}>{it.source}</span>
              <div className="flex-1">
                <div className="text-xs font-medium mb-0.5" style={{ color: "#23273A" }}>{it.desc}</div>
                {it.context && (
                  <div className="text-[11px] mt-1 p-2 rounded" style={{ background: "rgba(34,197,94,0.06)", color: "#15803D", border: "1px solid rgba(34,197,94,0.12)" }}>
                    Context added: {it.context}
                  </div>
                )}
              </div>
              <Mono className="text-[10px] shrink-0" style={{ color: "#8A93A6" }}>{it.date}</Mono>
              <div className="flex flex-col gap-1.5 shrink-0">
                {it.status === "flagged" ? (
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>Review suggested</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e" }}>Accurate ✓</span>
                )}
                <button onClick={() => setContextTarget(contextTarget === it.id ? null : it.id)} className="text-[10px] px-2 py-0.5 rounded" style={{ background: "rgba(15,23,42,0.07)", color: "#6B7280" }}>
                  Add Context
                </button>
                <button className="text-[10px] px-2 py-0.5 rounded" style={{ color: "#8A93A6" }}>Report Incorrect</button>
              </div>
            </div>
            {contextTarget === it.id && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                <textarea rows={2} className="w-full text-xs px-3 py-2 rounded-md resize-none" placeholder="Add context that gives this signal more meaning..." style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }} />
                <button className="mt-2 text-xs px-3 py-1.5 rounded font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>Save Context</button>
              </div>
            )}
            {it.id === "TASK-231" && (
              <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
                <div className="text-[10px] p-2 rounded" style={{ background: "rgba(34,197,94,0.06)", color: "#15803D", border: "1px solid rgba(34,197,94,0.1)" }}>
                  Example context: "Delayed because external API access wasn't provided until July 27."
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Shared primitives
// ═══════════════════════════════════════════════════════════════════════════════

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border p-5 ${className}`} style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-lg font-semibold" style={{ color: "#23273A" }}>{title}</h1>
      {subtitle && <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>{subtitle}</p>}
    </div>
  );
}

function Mono({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span className={className} style={{ fontFamily: "'DM Mono', monospace", ...style }}>{children}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: "#6B7280" }}>{children}</div>;
}

type ConditionStatus = "healthy" | "stable" | "attention" | "at-risk";

function ConditionBadge({ status }: { status: ConditionStatus }) {
  const map: Record<ConditionStatus, { label: string; bg: string; color: string }> = {
    healthy: { label: "Healthy ↑", bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
    stable: { label: "Stable →", bg: "rgba(99,102,241,0.1)", color: "#4F46E5" },
    attention: { label: "Attention Needed", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    "at-risk": { label: "At Risk ↓", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
  };
  const s = map[status];
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color, fontFamily: "'DM Mono', monospace" }}>
      {s.label}
    </span>
  );
}

function RiskLevel({ level }: { level: "high" | "medium" | "low" }) {
  const map = {
    high: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  };
  const s = map[level];
  return (
    <span className="text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider" style={{ background: s.bg, color: s.color, fontFamily: "'DM Mono', monospace" }}>
      {level}
    </span>
  );
}

// Reusable dark-themed modal shell used across the manager app
function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide ? "sm:max-w-xl" : "sm:max-w-md"} style={{ background: "#FFFFFF", borderColor: "rgba(15,23,42,0.11)" }}>
        <DialogHeader>
          <DialogTitle style={{ color: "#23273A" }}>{title}</DialogTitle>
          {description && <DialogDescription style={{ color: "#6B7280" }}>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter className="mt-2 flex-wrap gap-2">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

const TONE_COLORS = {
  positive: { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  neutral: { bg: "rgba(99,102,241,0.1)", color: "#4F46E5" },
  warning: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  critical: { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
} as const;

function SignalTag({ label, tone }: { label: string; tone: keyof typeof TONE_COLORS }) {
  const t = TONE_COLORS[tone];
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap" style={{ background: t.bg, color: t.color, fontFamily: "'DM Mono', monospace" }}>
      {label}
    </span>
  );
}

function contributionTone(v: SignalLevel) { return v === "Strong" ? "positive" : v === "Moderate" ? "neutral" : "critical"; }
function collaborationTone(v: CollabLevel) { return v === "High" ? "positive" : v === "Moderate" ? "neutral" : "critical"; }
function initials(name: string) { return name.split(" ").map((n) => n[0]).join(""); }

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER APP — DATA
// Nexora Technologies · Atlas Engineering team. Kept consistent across every screen.
// ═══════════════════════════════════════════════════════════════════════════════

const ORG_TEAM = "Nexora Technologies · Atlas Engineering";

type SignalLevel = "Strong" | "Moderate" | "Needs Attention";
type CollabLevel = "High" | "Moderate" | "Declining";

interface TimelineEntry {
  date: string;
  time: string;
  desc: string;
  project: string;
  type: string;
  source: "GitHub" | "Jira" | "Team Collaboration";
  relatedMembers: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  roleCategory: "Engineering" | "Product" | "Design" | "QA";
  team: string;
  status: string;
  contribution: SignalLevel;
  collaboration: CollabLevel;
  recentEvidence?: { desc: string; time: string };
  evidence: {
    delivery: { completedTasks: number; storyPoints: number };
    collaboration: { prReviews: number; technicalDiscussions: number; teammateSupport: number };
    support: { blockersResolved: number };
    knowledge: { docs: number };
  };
  sources: {
    github: { commits: number; prs: number; reviews: number };
    jira: { completedTasks: number; storyPoints: number };
    collaboration: { support: number; blockers: number };
  };
  timeline: TimelineEntry[];
}

const EMPLOYEES: Employee[] = [
  {
    id: "aarav",
    name: "Aarav Sharma",
    role: "Backend Developer",
    roleCategory: "Engineering",
    team: "Atlas Engineering",
    status: "Active",
    contribution: "Strong",
    collaboration: "High",
    recentEvidence: { desc: "Reviewed 6 pull requests and helped unblock 2 teammates.", time: "2 hours ago" },
    evidence: {
      delivery: { completedTasks: 5, storyPoints: 18 },
      collaboration: { prReviews: 18, technicalDiscussions: 21, teammateSupport: 14 },
      support: { blockersResolved: 8 },
      knowledge: { docs: 5 },
    },
    sources: {
      github: { commits: 22, prs: 6, reviews: 18 },
      jira: { completedTasks: 5, storyPoints: 18 },
      collaboration: { support: 14, blockers: 8 },
    },
    timeline: [
      { date: "Aug 10", time: "11:24 AM", desc: "Reviewed authentication PR.", project: "Atlas", type: "Code Review", source: "GitHub", relatedMembers: 2 },
      { date: "Aug 9", time: "4:15 PM", desc: "Helped unblock teammate on API integration.", project: "Atlas", type: "Collaboration", source: "Team Collaboration", relatedMembers: 1 },
      { date: "Aug 7", time: "2:40 PM", desc: "Updated API documentation.", project: "Atlas", type: "Documentation", source: "GitHub", relatedMembers: 1 },
      { date: "Aug 5", time: "10:05 AM", desc: "Resolved backend blocker.", project: "Atlas", type: "Delivery", source: "Jira", relatedMembers: 2 },
    ],
  },
  {
    id: "meera",
    name: "Meera Sharma",
    role: "Frontend Developer",
    roleCategory: "Engineering",
    team: "Atlas Engineering",
    status: "Active",
    contribution: "Strong",
    collaboration: "Moderate",
    evidence: {
      delivery: { completedTasks: 4, storyPoints: 15 },
      collaboration: { prReviews: 9, technicalDiscussions: 12, teammateSupport: 6 },
      support: { blockersResolved: 3 },
      knowledge: { docs: 2 },
    },
    sources: {
      github: { commits: 16, prs: 5, reviews: 9 },
      jira: { completedTasks: 4, storyPoints: 15 },
      collaboration: { support: 6, blockers: 3 },
    },
    timeline: [
      { date: "Aug 11", time: "3:05 PM", desc: "Shipped onboarding flow redesign.", project: "Atlas", type: "Delivery", source: "Jira", relatedMembers: 1 },
      { date: "Aug 10", time: "1:20 PM", desc: "Reviewed notification center PR.", project: "Atlas", type: "Code Review", source: "GitHub", relatedMembers: 2 },
      { date: "Aug 8", time: "9:40 AM", desc: "Paired with QA on regression triage.", project: "Atlas", type: "Collaboration", source: "Team Collaboration", relatedMembers: 1 },
      { date: "Aug 6", time: "5:10 PM", desc: "Updated component library documentation.", project: "Atlas", type: "Documentation", source: "GitHub", relatedMembers: 1 },
    ],
  },
  {
    id: "kabir",
    name: "Kabir Singh",
    role: "Backend Developer",
    roleCategory: "Engineering",
    team: "Atlas Engineering",
    status: "Active",
    contribution: "Moderate",
    collaboration: "Declining",
    evidence: {
      delivery: { completedTasks: 3, storyPoints: 10 },
      collaboration: { prReviews: 5, technicalDiscussions: 6, teammateSupport: 2 },
      support: { blockersResolved: 2 },
      knowledge: { docs: 1 },
    },
    sources: {
      github: { commits: 9, prs: 3, reviews: 5 },
      jira: { completedTasks: 3, storyPoints: 10 },
      collaboration: { support: 2, blockers: 2 },
    },
    timeline: [
      { date: "Aug 9", time: "2:15 PM", desc: "Investigated database migration blocker.", project: "Atlas", type: "Delivery", source: "Jira", relatedMembers: 1 },
      { date: "Aug 6", time: "10:50 AM", desc: "Reviewed API integration PR.", project: "Atlas", type: "Code Review", source: "GitHub", relatedMembers: 1 },
      { date: "Aug 4", time: "4:30 PM", desc: "Closed authentication token bug.", project: "Atlas", type: "Delivery", source: "Jira", relatedMembers: 1 },
    ],
  },
  {
    id: "ananya",
    name: "Ananya Rao",
    role: "QA Engineer",
    roleCategory: "QA",
    team: "Atlas Engineering",
    status: "Active",
    contribution: "Strong",
    collaboration: "High",
    recentEvidence: { desc: "Added test coverage for 3 critical workflows and documented regression findings.", time: "Yesterday" },
    evidence: {
      delivery: { completedTasks: 6, storyPoints: 14 },
      collaboration: { prReviews: 7, technicalDiscussions: 9, teammateSupport: 8 },
      support: { blockersResolved: 1 },
      knowledge: { docs: 4 },
    },
    sources: {
      github: { commits: 11, prs: 4, reviews: 7 },
      jira: { completedTasks: 6, storyPoints: 14 },
      collaboration: { support: 8, blockers: 1 },
    },
    timeline: [
      { date: "Aug 12", time: "10:10 AM", desc: "Added test coverage for 3 critical workflows.", project: "Atlas", type: "Quality", source: "Jira", relatedMembers: 2 },
      { date: "Aug 10", time: "3:45 PM", desc: "Documented regression findings.", project: "Atlas", type: "Documentation", source: "Jira", relatedMembers: 1 },
      { date: "Aug 8", time: "11:00 AM", desc: "Paired with backend team on test plan review.", project: "Atlas", type: "Collaboration", source: "Team Collaboration", relatedMembers: 2 },
    ],
  },
  {
    id: "rohan",
    name: "Rohan Mehta",
    role: "Full Stack Developer",
    roleCategory: "Engineering",
    team: "Atlas Engineering",
    status: "Active",
    contribution: "Strong",
    collaboration: "High",
    recentEvidence: { desc: "Resolved a production issue affecting payment processing.", time: "Yesterday" },
    evidence: {
      delivery: { completedTasks: 7, storyPoints: 20 },
      collaboration: { prReviews: 10, technicalDiscussions: 9, teammateSupport: 9 },
      support: { blockersResolved: 4 },
      knowledge: { docs: 3 },
    },
    sources: {
      github: { commits: 19, prs: 7, reviews: 10 },
      jira: { completedTasks: 7, storyPoints: 20 },
      collaboration: { support: 9, blockers: 4 },
    },
    timeline: [
      { date: "Aug 12", time: "9:15 AM", desc: "Resolved a production issue affecting payment processing.", project: "Atlas", type: "Incident", source: "Jira", relatedMembers: 2 },
      { date: "Aug 10", time: "2:50 PM", desc: "Reviewed payments service PR.", project: "Atlas", type: "Code Review", source: "GitHub", relatedMembers: 1 },
      { date: "Aug 8", time: "1:05 PM", desc: "Updated deployment runbook.", project: "Atlas", type: "Documentation", source: "GitHub", relatedMembers: 1 },
    ],
  },
];

interface RiskAlert {
  id: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  potentialImpact: string;
  why: string;
  affectedWork?: { id: string; title: string; detail: string }[];
  relatedSignals: string[];
  suggestedAction: string;
  whySignals: string[];
  dataSources: string[];
  lastUpdated: string;
  affectedEmployeeIds?: string[];
}

const RISK_ALERTS: RiskAlert[] = [
  {
    id: "delivery-coordination",
    severity: "Medium",
    title: "Delivery Coordination Risk",
    description: "3 tasks have been blocked for more than 48 hours.",
    potentialImpact: "Sprint delivery may be delayed.",
    why: "Three tasks have remained blocked for more than 48 hours.",
    affectedWork: [
      { id: "TP-142", title: "API Integration", detail: "Blocked for 52 hours" },
      { id: "TP-151", title: "Authentication", detail: "Blocked for 61 hours" },
      { id: "TP-158", title: "Database Migration", detail: "Blocked for 49 hours" },
    ],
    relatedSignals: ["3 blocked tasks", "2 team members affected", "Sprint deadline in 3 days", "Blocker resolution rate ↓ 12%"],
    suggestedAction: "Review the affected blockers with the relevant team members.",
    whySignals: ["Blocked tasks increased 35%", "3 tasks exceeded 48 hours", "2 team members are affected", "Sprint deadline is approaching"],
    dataSources: ["Jira", "GitHub"],
    lastUpdated: "Today, 10:42 AM",
    affectedEmployeeIds: ["aarav", "kabir"],
  },
  {
    id: "collaboration-risk",
    severity: "Medium",
    title: "Collaboration Risk",
    description: "Cross-team review activity has decreased by 41% over the last two weeks.",
    potentialImpact: "Reduced knowledge sharing may affect coordination.",
    why: "Cross-team review activity has decreased by 41% over the last two weeks, reducing the volume of shared context between teams.",
    relatedSignals: ["Cross-team interactions down 41%", "Fewer joint PR reviews recorded this period", "Two-week trend confirms the pattern"],
    suggestedAction: "Encourage cross-team check-ins or pairing sessions to restore review activity.",
    whySignals: ["Cross-team review activity decreased 41%", "Fewer joint PR reviews recorded this period", "Trend held for two consecutive weeks"],
    dataSources: ["GitHub"],
    lastUpdated: "Today, 10:42 AM",
  },
];

interface TeamSignal {
  id: string;
  name: string;
  changeLabel: string;
  direction: "up" | "down";
  current: string;
  previous: string;
  keyContributors?: { name: string; value: number }[];
  interpretation: string;
  history: number[];
}

const TEAM_SIGNALS: TeamSignal[] = [
  {
    id: "cross-team-collaboration",
    name: "Cross-Team Collaboration",
    changeLabel: "↑ 12%",
    direction: "up",
    current: "47 interactions",
    previous: "42 interactions",
    keyContributors: [{ name: "Aarav Sharma", value: 14 }, { name: "Rohan Mehta", value: 9 }, { name: "Ananya Rao", value: 8 }],
    interpretation: "Cross-team review and support activity has increased compared with the previous two-week period.",
    history: [38, 40, 42, 47],
  },
  {
    id: "pr-review-activity",
    name: "PR Review Activity",
    changeLabel: "↑ 8%",
    direction: "up",
    current: "52 reviews",
    previous: "48 reviews",
    interpretation: "Pull request review volume has increased slightly, suggesting steady review coverage across the team.",
    history: [44, 46, 48, 52],
  },
  {
    id: "blocker-resolution",
    name: "Blocker Resolution",
    changeLabel: "↓ 6%",
    direction: "down",
    current: "82% resolved within SLA",
    previous: "87% resolved within SLA",
    interpretation: "Blocker resolution has slowed slightly this period — worth monitoring alongside the delivery coordination risk above.",
    history: [91, 89, 87, 82],
  },
  {
    id: "knowledge-sharing",
    name: "Knowledge Sharing",
    changeLabel: "↑ 15%",
    direction: "up",
    current: "15 contributions",
    previous: "13 contributions",
    interpretation: "Documentation and knowledge-sharing activity has increased across the team.",
    history: [11, 12, 13, 15],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER APP — OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════

function OverviewPage({ onOpenProfile }: { onOpenProfile: (id: string) => void }) {
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const [pulseModalOpen, setPulseModalOpen] = useState(false);

  const scrollToRisks = () => {
    setHealthModalOpen(false);
    requestAnimationFrame(() => document.getElementById("risk-alerts")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: "#23273A" }}>Team Health Overview</h1>
        <p className="text-xs mt-1" style={{ color: "#6B7280" }}>Understand your team's health, emerging risks and collaboration signals at a glance.</p>
      </div>

      {/* Team Health Summary + Weekly Team Pulse */}
      <Card className="mb-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <button onClick={() => setHealthModalOpen(true)} className="text-left rounded-lg p-1 -m-1 transition-colors hover:bg-black/[0.05]">
            <Label>Team Health</Label>
            <div className="text-2xl font-semibold mt-1" style={{ color: "#23273A" }}>Stable</div>
            <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#6B7280" }}>Overall collaboration remains healthy, with 1 signal requiring attention.</p>
            <span className="inline-flex items-center gap-1 text-[11px] mt-2" style={{ color: "#4F46E5" }}>View details <ChevronRight size={11} /></span>
          </button>
          <div className="sm:pl-5 sm:border-l" style={{ borderColor: "rgba(15,23,42,0.11)" }}>
            <Label>Weekly Team Pulse</Label>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-semibold" style={{ color: "#23273A" }}>85%</span>
              <span className="text-xs" style={{ color: "#6B7280" }}>Participation</span>
            </div>
            <div className="text-xs mt-1" style={{ color: "#3D4459" }}>Morale: Stable · 17 of 20 responses</div>
            <div className="flex items-center gap-1 text-[11px] mt-1" style={{ color: "#22c55e" }}><TrendingUp size={11} /> 4% vs previous week</div>
            <button onClick={() => setPulseModalOpen(true)} className="inline-flex items-center gap-1 text-[11px] mt-2" style={{ color: "#4F46E5" }}>View Details <ChevronRight size={11} /></button>
          </div>
        </div>
      </Card>

      <RiskAlertsSection onOpenProfile={onOpenProfile} />
      <TeamSignalsSection />
      <RecentContributionEvidenceSection onOpenProfile={onOpenProfile} />

      <Modal
        open={healthModalOpen}
        onOpenChange={setHealthModalOpen}
        title="Team Health"
        wide
        footer={
          <>
            <button onClick={scrollToRisks} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>View Risk Alerts</button>
            <DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg" style={{ color: "#6B7280" }}>Close</button></DialogClose>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Overall Status</Label>
            <div className="text-lg font-semibold" style={{ color: "#23273A" }}>Stable</div>
          </div>
          <div>
            <Label>Positive Signals</Label>
            <ul className="space-y-1 mt-1">
              {["Cross-team collaboration +12%", "Knowledge sharing +15%", "Blocker resolution +8%"].map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs" style={{ color: "#3D4459" }}><CheckCircle2 size={11} color="#22c55e" />{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <Label>Signals Requiring Attention</Label>
            <ul className="space-y-1 mt-1">
              {["3 tasks blocked for more than 48 hours"].map((s) => (
                <li key={s} className="flex items-center gap-2 text-xs" style={{ color: "#3D4459" }}><AlertCircle size={11} color="#f59e0b" />{s}</li>
              ))}
            </ul>
          </div>
          <div className="pt-2 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
            <Mono className="text-[10px]" style={{ color: "#8A93A6" }}>Last Updated: Today, 10:42 AM</Mono>
          </div>
        </div>
      </Modal>

      <Modal
        open={pulseModalOpen}
        onOpenChange={setPulseModalOpen}
        title="Weekly Team Pulse"
        footer={<DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg w-full" style={{ background: "#6366f1", color: "#fff" }}>Close</button></DialogClose>}
      >
        <div className="space-y-4">
          <div>
            <Label>Participation</Label>
            <div className="text-2xl font-semibold" style={{ color: "#23273A" }}>85%</div>
            <div className="text-xs" style={{ color: "#6B7280" }}>17 of 20 team members responded.</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Team Sentiment</Label>
              <div className="text-sm font-medium" style={{ color: "#3D4459" }}>Stable</div>
            </div>
            <div>
              <Label>Weekly Trend</Label>
              <div className="flex items-center gap-1 text-sm font-medium" style={{ color: "#22c55e" }}><TrendingUp size={12} /> 4% vs previous week</div>
            </div>
          </div>
          <div>
            <Label>Response Breakdown</Label>
            <div className="space-y-1.5 mt-1">
              {([["Positive", 11, "#22c55e"], ["Neutral", 5, "#4F46E5"], ["Needs Attention", 1, "#ef4444"]] as [string, number, string][]).map(([l, c, color]) => (
                <div key={l} className="flex items-center gap-2">
                  <div className="text-xs w-28" style={{ color: "#5B6478" }}>{l}</div>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(15,23,42,0.09)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(c / 17) * 100}%`, background: color }} />
                  </div>
                  <Mono className="text-[11px] w-4 text-right" style={{ color: "#6B7280" }}>{c}</Mono>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", color: "#3D4459" }}>
            <span className="font-medium" style={{ color: "#4F46E5" }}>Manager Takeaway: </span>
            Participation remains healthy, while one response indicates an area that may require follow-up.
          </div>
        </div>
      </Modal>
    </div>
  );
}

function RiskAlertsSection({ onOpenProfile }: { onOpenProfile: (id: string) => void }) {
  return (
    <div id="risk-alerts" className="mb-5">
      <SectionHeader title="Explainable Risk Alerts" subtitle="Evidence-based signals from connected systems — not an absolute judgment. You decide what action, if any, to take." />
      <div className="space-y-3">
        {RISK_ALERTS.map((r) => (
          <RiskAlertCard key={r.id} alert={r} onOpenProfile={onOpenProfile} />
        ))}
      </div>
    </div>
  );
}

function RiskAlertCard({ alert, onOpenProfile }: { alert: RiskAlert; onOpenProfile: (id: string) => void }) {
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [showAffected, setShowAffected] = useState(false);

  const closeAll = () => { setWhyOpen(false); setEvidenceOpen(false); setShowAffected(false); };

  return (
    <Card>
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="text-sm font-semibold" style={{ color: "#23273A" }}>{alert.title}</span>
        <RiskLevel level={alert.severity.toLowerCase() as "high" | "medium" | "low"} />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#3D4459" }}>{alert.description}</p>
      <p className="text-xs mt-2" style={{ color: "#6B7280" }}><span className="font-medium" style={{ color: "#5B6478" }}>Potential impact: </span>{alert.potentialImpact}</p>

      <button onClick={() => setEvidenceOpen(true)} className="inline-flex items-center gap-1 text-xs font-medium mt-3" style={{ color: "#4F46E5" }}>
        <Eye size={12} /> View Evidence <ArrowRight size={11} />
      </button>

      <Modal
        open={evidenceOpen}
        onOpenChange={(v) => { setEvidenceOpen(v); if (!v) setShowAffected(false); }}
        title={alert.title}
        wide
        footer={
          <div className="flex flex-wrap gap-2 w-full">
            {alert.affectedEmployeeIds && (
              <button onClick={() => setShowAffected((v) => !v)} className="text-xs px-3 py-2 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>View Affected Members</button>
            )}
            <button onClick={() => setWhyOpen(true)} className="text-xs px-3 py-2 rounded-lg font-medium inline-flex items-center gap-1.5" style={{ background: "rgba(15,23,42,0.09)", color: "#3D4459" }}><Info size={12} />Why am I seeing this?</button>
            <button onClick={closeAll} className="text-xs px-3 py-2 rounded-lg" style={{ color: "#6B7280" }}>Back to Overview</button>
            <DialogClose asChild><button className="text-xs px-3 py-2 rounded-lg ml-auto" style={{ color: "#6B7280" }}>Close</button></DialogClose>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Why was this flagged?</Label>
            <p className="text-xs leading-relaxed" style={{ color: "#3D4459" }}>{alert.why}</p>
          </div>
          {alert.affectedWork && (
            <div>
              <Label>Affected Work</Label>
              <div className="space-y-2 mt-1">
                {alert.affectedWork.map((w) => (
                  <div key={w.id} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "rgba(15,23,42,0.06)" }}>
                    <div>
                      <span className="text-xs font-medium" style={{ color: "#23273A" }}>{w.id}</span>
                      <span className="text-xs ml-1.5" style={{ color: "#5B6478" }}>— {w.title}</span>
                    </div>
                    <Mono className="text-[11px]" style={{ color: "#f59e0b" }}>{w.detail}</Mono>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <Label>Related Signals</Label>
            <ul className="space-y-1 mt-1">
              {alert.relatedSignals.map((s) => (
                <li key={s} className="text-xs flex items-center gap-1.5" style={{ color: "#6B7280" }}><span style={{ color: "#8A93A6" }}>·</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
            <div>
              <Label>Potential Impact</Label>
              <p className="text-xs" style={{ color: "#3D4459" }}>{alert.severity} delivery risk</p>
            </div>
            <div>
              <Label>Suggested Manager Action</Label>
              <p className="text-xs" style={{ color: "#4F46E5" }}>{alert.suggestedAction}</p>
            </div>
          </div>
          {showAffected && alert.affectedEmployeeIds && (
            <div className="pt-3 border-t" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
              <Label>Affected Team Members</Label>
              <div className="flex flex-col gap-1.5 mt-1">
                {alert.affectedEmployeeIds.map((id) => {
                  const emp = EMPLOYEES.find((e) => e.id === id)!;
                  return (
                    <button key={id} onClick={() => { closeAll(); onOpenProfile(id); }} className="flex items-center justify-between text-left px-3 py-2 rounded-lg transition-colors hover:bg-black/[0.07]" style={{ background: "rgba(15,23,42,0.06)" }}>
                      <span className="text-xs font-medium" style={{ color: "#23273A" }}>{emp.name}</span>
                      <span className="text-[11px]" style={{ color: "#8A93A6" }}>{emp.role} →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={whyOpen}
        onOpenChange={setWhyOpen}
        title="Why am I seeing this?"
        footer={<DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg w-full" style={{ background: "#6366f1", color: "#fff" }}>Close</button></DialogClose>}
      >
        <div className="space-y-4">
          <p className="text-xs leading-relaxed" style={{ color: "#3D4459" }}>This alert was generated from recent changes in team activity. It reflects an evidence-based signal, not an absolute judgment.</p>
          <div>
            <Label>Signals Considered</Label>
            <ul className="space-y-1 mt-1">
              {alert.whySignals.map((s) => (
                <li key={s} className="text-xs flex items-start gap-1.5" style={{ color: "#3D4459" }}><CheckCircle2 size={11} color="#6366f1" className="mt-0.5 shrink-0" />{s}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Sources</Label>
              <div className="flex gap-1.5 mt-1">
                {alert.dataSources.map((d) => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)", color: "#4F46E5", fontFamily: "'DM Mono', monospace" }}>{d}</span>
                ))}
              </div>
            </div>
            <div>
              <Label>Last Updated</Label>
              <Mono className="text-xs" style={{ color: "#6B7280" }}>{alert.lastUpdated}</Mono>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

function TeamSignalsSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const active = TEAM_SIGNALS.find((s) => s.id === openId) || null;

  return (
    <div className="mb-5">
      <SectionHeader title="Team Signals" subtitle="Observable trends from connected systems — supporting context for the risks above." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {TEAM_SIGNALS.map((s) => (
          <button key={s.id} onClick={() => setOpenId(s.id)} className="text-left">
            <Card>
              <Label>{s.name}</Label>
              <div className="flex items-center gap-1.5 mt-1">
                {s.direction === "up" ? <TrendingUp size={14} color="#22c55e" /> : <TrendingDown size={14} color="#ef4444" />}
                <span className="text-lg font-semibold" style={{ color: s.direction === "up" ? "#22c55e" : "#ef4444" }}>{s.changeLabel}</span>
              </div>
              <div className="text-[11px] mt-1" style={{ color: "#8A93A6" }}>vs previous period</div>
            </Card>
          </button>
        ))}
      </div>

      <Modal
        open={!!active}
        onOpenChange={(v) => !v && setOpenId(null)}
        title={active?.name ?? ""}
        footer={<DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg w-full" style={{ background: "#6366f1", color: "#fff" }}>Close</button></DialogClose>}
      >
        {active && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Current Period</Label><div className="text-sm font-medium" style={{ color: "#23273A" }}>{active.current}</div></div>
              <div><Label>Previous Period</Label><div className="text-sm font-medium" style={{ color: "#3D4459" }}>{active.previous}</div></div>
              <div><Label>Change</Label><div className="text-sm font-medium" style={{ color: active.direction === "up" ? "#22c55e" : "#ef4444" }}>{active.changeLabel}</div></div>
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={active.history.map((v, i) => ({ period: `Period ${i + 1}`, value: v }))}>
                <Line type="monotone" dataKey="value" stroke={active.direction === "up" ? "#22c55e" : "#ef4444"} strokeWidth={2} dot={{ r: 3 }} />
                <XAxis dataKey="period" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
                <Tooltip contentStyle={{ background: "#FFFFFF", border: "none", borderRadius: 6, fontSize: 11 }} />
              </LineChart>
            </ResponsiveContainer>
            {active.keyContributors && (
              <div>
                <Label>Key Contributors</Label>
                <div className="space-y-1 mt-1">
                  {active.keyContributors.map((k) => (
                    <div key={k.name} className="flex items-center justify-between text-xs" style={{ color: "#3D4459" }}>
                      <span>{k.name}</span><Mono style={{ color: "#6B7280" }}>{k.value}</Mono>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <Label>Interpretation</Label>
              <p className="text-xs leading-relaxed" style={{ color: "#3D4459" }}>{active.interpretation}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function RecentContributionEvidenceSection({ onOpenProfile }: { onOpenProfile: (id: string) => void }) {
  const items = EMPLOYEES.filter((e) => e.recentEvidence);
  return (
    <div className="mb-5">
      <SectionHeader title="Recent Contribution Evidence" subtitle="Recent, individually attributed activity — supporting evidence for the Evidence Profiles below." />
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((e) => (
          <Card key={e.id}>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0">{initials(e.name)}</div>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#23273A" }}>{e.name}</div>
                <div className="text-[10px]" style={{ color: "#8A93A6" }}>{e.role}</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: "#3D4459" }}>{e.recentEvidence!.desc}</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: "#8A93A6" }}><Clock size={10} />{e.recentEvidence!.time}</span>
              <button onClick={() => onOpenProfile(e.id)} className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "#4F46E5" }}>View Evidence Profile <ArrowRight size={10} /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER APP — EVIDENCE PROFILES
// ═══════════════════════════════════════════════════════════════════════════════

function EvidenceProfilesPage({ selectedEmployeeId, onSelectEmployee }: { selectedEmployeeId: string | null; onSelectEmployee: (id: string | null) => void }) {
  const employee = selectedEmployeeId ? EMPLOYEES.find((e) => e.id === selectedEmployeeId) : undefined;
  if (employee) return <EmployeeProfileDetail employee={employee} onBack={() => onSelectEmployee(null)} />;
  return <EmployeeDirectory onSelect={onSelectEmployee} />;
}

function EmployeeDirectory({ onSelect }: { onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [contribFilter, setContribFilter] = useState("All");

  const filtered = EMPLOYEES.filter((e) => {
    if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (roleFilter !== "All" && e.roleCategory !== roleFilter) return false;
    if (contribFilter !== "All" && e.contribution !== contribFilter) return false;
    return true;
  });

  const FilterGroup = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className="text-[11px] px-2.5 py-1 rounded-full border transition-colors"
            style={{ borderColor: value === o ? "#6366f1" : "rgba(15,23,42,0.12)", background: value === o ? "rgba(99,102,241,0.12)" : "transparent", color: value === o ? "#4F46E5" : "#6B7280" }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="Evidence Profiles" subtitle={`${ORG_TEAM} — contribution and collaboration signals by team member.`} />
      <Card className="mb-5">
        <div className="relative mb-4">
          <Search size={13} color="#8A93A6" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg"
            style={{ background: "#F3F4F7", border: "1px solid rgba(15,23,42,0.12)", color: "#23273A", outline: "none" }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FilterGroup label="Role" value={roleFilter} options={["All", "Engineering", "Product", "Design", "QA"]} onChange={setRoleFilter} />
          <FilterGroup label="Contribution" value={contribFilter} options={["All", "Strong", "Moderate", "Needs Attention"]} onChange={setContribFilter} />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><div className="text-xs text-center py-8" style={{ color: "#8A93A6" }}>No employees match your search.</div></Card>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {filtered.map((e) => (
            <Card key={e.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold text-white shrink-0">{initials(e.name)}</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#23273A" }}>{e.name}</div>
                  <div className="text-[10px]" style={{ color: "#8A93A6" }}>{e.role}</div>
                </div>
              </div>
              <div className="text-[10px] mb-3" style={{ color: "#8A93A6" }}>{e.team}</div>
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center justify-between"><span className="text-[11px]" style={{ color: "#6B7280" }}>Contribution</span><SignalTag label={e.contribution} tone={contributionTone(e.contribution)} /></div>
                <div className="flex items-center justify-between"><span className="text-[11px]" style={{ color: "#6B7280" }}>Collaboration</span><SignalTag label={e.collaboration} tone={collaborationTone(e.collaboration)} /></div>
              </div>
              <button onClick={() => onSelect(e.id)} className="w-full text-xs py-2 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>View Profile</button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EmployeeProfileDetail({ employee, onBack }: { employee: Employee; onBack: () => void }) {
  const [timelineModal, setTimelineModal] = useState<TimelineEntry | null>(null);
  const [sourceModal, setSourceModal] = useState<"GitHub" | "Jira" | "Team Collaboration" | null>(null);

  const openSourceFromTimeline = (source: TimelineEntry["source"]) => {
    setTimelineModal(null);
    setSourceModal(source);
  };

  return (
    <div>
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs mb-4" style={{ color: "#6B7280" }}>
        <ArrowLeft size={12} /> Back to Evidence Profiles
      </button>

      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-indigo-700 flex items-center justify-center text-base font-bold text-white shrink-0">{initials(employee.name)}</div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "#23273A" }}>{employee.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs" style={{ color: "#6B7280" }}>
              <span>{employee.role}</span>
              <span className="flex items-center gap-1"><Building2 size={11} /> Team: {employee.team}</span>
              <span className="flex items-center gap-1"><UserCheck size={11} /> Status: {employee.status}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SignalTag label={`Contribution: ${employee.contribution}`} tone={contributionTone(employee.contribution)} />
          <SignalTag label={`Collaboration: ${employee.collaboration}`} tone={collaborationTone(employee.collaboration)} />
        </div>
      </div>

      <SectionHeader title="Contribution Evidence" subtitle="Evidence from connected systems — supports managerial judgment, not a substitute for it." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <div className="flex items-center gap-1.5 mb-1.5"><GitBranch size={11} color="#6366f1" /><span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Delivery</span></div>
          <div className="text-xs space-y-0.5" style={{ color: "#3D4459" }}>
            <div>{employee.evidence.delivery.completedTasks} completed tasks</div>
            <div>{employee.evidence.delivery.storyPoints} story points</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 mb-1.5"><Users size={11} color="#6366f1" /><span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Collaboration</span></div>
          <div className="text-xs space-y-0.5" style={{ color: "#3D4459" }}>
            <div>{employee.evidence.collaboration.prReviews} PR reviews</div>
            <div>{employee.evidence.collaboration.technicalDiscussions} technical discussions</div>
            <div>{employee.evidence.collaboration.teammateSupport} teammate support interactions</div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 mb-1.5"><UserCheck size={11} color="#6366f1" /><span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Support & Unblocking</span></div>
          <div className="text-xs" style={{ color: "#3D4459" }}>{employee.evidence.support.blockersResolved} blockers resolved</div>
        </Card>
        <Card>
          <div className="flex items-center gap-1.5 mb-1.5"><BookOpen size={11} color="#6366f1" /><span className="text-[9px] uppercase tracking-widest" style={{ color: "#6B7280" }}>Knowledge Sharing</span></div>
          <div className="text-xs" style={{ color: "#3D4459" }}>{employee.evidence.knowledge.docs} documentation contributions</div>
        </Card>
      </div>

      <SectionHeader title="Contribution Timeline" subtitle="Recent activity, most recent first. Select an entry for full detail and its evidence source." />
      <Card className="mb-6">
        <div>
          {employee.timeline.map((t, i) => (
            <button
              key={i}
              onClick={() => setTimelineModal(t)}
              className="w-full flex items-start gap-3 text-left px-2 py-2.5 rounded-lg transition-colors hover:bg-black/[0.07]"
              style={{ borderBottom: i < employee.timeline.length - 1 ? "1px solid rgba(15,23,42,0.09)" : "none" }}
            >
              <span className="flex items-center gap-1 text-[10px] w-32 shrink-0 mt-0.5" style={{ fontFamily: "'DM Mono', monospace", color: "#8A93A6" }}><Clock size={9} />{t.date} · {t.time}</span>
              <div className="flex-1 text-xs" style={{ color: "#3D4459" }}>{t.desc}</div>
              <ChevronRight size={12} color="#8A93A6" className="mt-0.5 shrink-0" />
            </button>
          ))}
        </div>
      </Card>

      <SectionHeader title="Evidence Sources" subtitle="Simulated for this prototype — no live connection to GitHub or Jira." />
      <div className="grid gap-3 sm:grid-cols-3">
        <button onClick={() => setSourceModal("GitHub")} className="text-left">
          <Card>
            <div className="flex items-center gap-2 mb-2"><Github size={14} color="#3D4459" /><span className="text-sm font-semibold" style={{ color: "#23273A" }}>GitHub</span></div>
            <div className="text-xs space-y-0.5" style={{ color: "#6B7280" }}>
              <div>{employee.sources.github.commits} commits</div>
              <div>{employee.sources.github.prs} pull requests</div>
              <div>{employee.sources.github.reviews} reviews</div>
            </div>
          </Card>
        </button>
        <button onClick={() => setSourceModal("Jira")} className="text-left">
          <Card>
            <div className="flex items-center gap-2 mb-2"><Database size={14} color="#3D4459" /><span className="text-sm font-semibold" style={{ color: "#23273A" }}>Jira</span></div>
            <div className="text-xs space-y-0.5" style={{ color: "#6B7280" }}>
              <div>{employee.sources.jira.completedTasks} completed tasks</div>
              <div>{employee.sources.jira.storyPoints} story points</div>
            </div>
          </Card>
        </button>
        <button onClick={() => setSourceModal("Team Collaboration")} className="text-left">
          <Card>
            <div className="flex items-center gap-2 mb-2"><Users size={14} color="#3D4459" /><span className="text-sm font-semibold" style={{ color: "#23273A" }}>Team Collaboration</span></div>
            <div className="text-xs space-y-0.5" style={{ color: "#6B7280" }}>
              <div>{employee.sources.collaboration.support} support interactions</div>
              <div>{employee.sources.collaboration.blockers} blockers resolved</div>
            </div>
          </Card>
        </button>
      </div>

      <Modal
        open={!!timelineModal}
        onOpenChange={(v) => !v && setTimelineModal(null)}
        title="Contribution Details"
        footer={
          <>
            {timelineModal && <button onClick={() => openSourceFromTimeline(timelineModal.source)} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.15)", color: "#4F46E5" }}>View Source Evidence</button>}
            <DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg" style={{ color: "#6B7280" }}>Close</button></DialogClose>
          </>
        }
      >
        {timelineModal && (
          <div className="space-y-2 text-xs" style={{ color: "#3D4459" }}>
            <div><span style={{ color: "#6B7280" }}>Activity: </span>{timelineModal.desc}</div>
            <div><span style={{ color: "#6B7280" }}>Date: </span>{timelineModal.date}, 2026</div>
            <div><span style={{ color: "#6B7280" }}>Project: </span>{timelineModal.project}</div>
            <div><span style={{ color: "#6B7280" }}>Type: </span>{timelineModal.type}</div>
            <div><span style={{ color: "#6B7280" }}>Source: </span>{timelineModal.source}</div>
            <div><span style={{ color: "#6B7280" }}>Related team members: </span>{timelineModal.relatedMembers}</div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!sourceModal}
        onOpenChange={(v) => !v && setSourceModal(null)}
        title={`${sourceModal ?? ""} Evidence`}
        description="Simulated source detail — TeamPulse does not connect to this system in the prototype."
        footer={<DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg w-full" style={{ background: "#6366f1", color: "#fff" }}>Close</button></DialogClose>}
      >
        {sourceModal === "GitHub" && (
          <div className="text-xs space-y-1" style={{ color: "#3D4459" }}>
            <div>{employee.sources.github.commits} commits</div>
            <div>{employee.sources.github.prs} pull requests</div>
            <div>{employee.sources.github.reviews} reviews</div>
          </div>
        )}
        {sourceModal === "Jira" && (
          <div className="text-xs space-y-1" style={{ color: "#3D4459" }}>
            <div>{employee.sources.jira.completedTasks} completed tasks</div>
            <div>{employee.sources.jira.storyPoints} story points</div>
          </div>
        )}
        {sourceModal === "Team Collaboration" && (
          <div className="text-xs space-y-1" style={{ color: "#3D4459" }}>
            <div>{employee.sources.collaboration.support} support interactions</div>
            <div>{employee.sources.collaboration.blockers} blockers resolved</div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MANAGER APP — SETTINGS / INTEGRATIONS
// ═══════════════════════════════════════════════════════════════════════════════

type SourceKey = "Jira" | "GitHub" | "Slack";

function SettingsIntegrationsPage() {
  const [status, setStatus] = useState<Record<SourceKey, "connected" | "not-connected">>({ Jira: "connected", GitHub: "connected", Slack: "not-connected" });
  const [activeSource, setActiveSource] = useState<SourceKey | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const SOURCE_INFO: Record<SourceKey, { lastSync: string; data: string[] }> = {
    Jira: { lastSync: "Today, 10:42 AM", data: ["Tasks", "Sprints", "Story points", "Blockers"] },
    GitHub: { lastSync: "Today, 10:38 AM", data: ["Pull requests", "Reviews", "Commits", "Discussions"] },
    Slack: { lastSync: "—", data: ["Channel activity metadata (not yet connected)"] },
  };

  const openSource = (s: SourceKey) => { setActiveSource(s); setActionMessage(null); setConfirmDisconnect(false); };

  const handleDisconnect = () => {
    if (!activeSource) return;
    setStatus((prev) => ({ ...prev, [activeSource]: "not-connected" }));
    setConfirmDisconnect(false);
    setActionMessage(`${activeSource} disconnected.`);
  };

  const handleConnect = () => {
    if (!activeSource) return;
    setStatus((prev) => ({ ...prev, [activeSource]: "connected" }));
    setActionMessage(`${activeSource} connected successfully.`);
  };

  return (
    <div>
      <SectionHeader title="Settings / Integrations" subtitle="Connected data sources, sync status and basic governance settings for this workspace." />

      <div className="mb-6">
        <Label>Connected Sources</Label>
        <div className="grid gap-3 sm:grid-cols-3 mt-1">
          {(["Jira", "GitHub", "Slack"] as SourceKey[]).map((s) => (
            <button key={s} onClick={() => openSource(s)} className="text-left">
              <Card>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {s === "GitHub" ? <Github size={14} color="#3D4459" /> : s === "Jira" ? <Database size={14} color="#3D4459" /> : <MessageSquare size={14} color="#3D4459" />}
                    <span className="text-sm font-semibold" style={{ color: "#23273A" }}>{s}</span>
                  </div>
                  {status[s] === "connected" ? (
                    <span className="text-[10px] flex items-center gap-1" style={{ color: "#22c55e" }}><CheckCircle2 size={11} />Connected</span>
                  ) : (
                    <span className="text-[10px] flex items-center gap-1" style={{ color: "#8A93A6" }}><X size={10} />Not Connected</span>
                  )}
                </div>
                {status[s] === "connected" && (
                  <span className="flex items-center gap-1 text-[10px]" style={{ fontFamily: "'DM Mono', monospace", color: "#8A93A6" }}><RefreshCw size={9} />Last sync: {SOURCE_INFO[s].lastSync}</span>
                )}
              </Card>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <NotificationPreferencesCard />
        <BasicGovernanceCard />
      </div>

      <Modal
        open={!!activeSource}
        onOpenChange={(v) => { if (!v) { setActiveSource(null); setConfirmDisconnect(false); setActionMessage(null); } }}
        title={`${activeSource ?? ""} Integration`}
        footer={
          activeSource ? (
            confirmDisconnect ? (
              <>
                <button onClick={() => setConfirmDisconnect(false)} className="text-xs px-4 py-2 rounded-lg" style={{ color: "#6B7280" }}>Cancel</button>
                <button onClick={handleDisconnect} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>Disconnect</button>
              </>
            ) : status[activeSource] === "connected" ? (
              <>
                <DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg" style={{ color: "#6B7280" }}>Close</button></DialogClose>
                <button onClick={() => setConfirmDisconnect(true)} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>Disconnect</button>
              </>
            ) : (
              <>
                <DialogClose asChild><button className="text-xs px-4 py-2 rounded-lg" style={{ color: "#6B7280" }}>Close</button></DialogClose>
                <button onClick={handleConnect} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "#6366f1", color: "#fff" }}>Connect</button>
              </>
            )
          ) : null
        }
      >
        {activeSource && (
          <div className="space-y-4">
            {confirmDisconnect ? (
              <p className="text-xs" style={{ color: "#3D4459" }}>Are you sure you want to disconnect {activeSource}?</p>
            ) : (
              <>
                <div>
                  <Label>Status</Label>
                  <div className="text-sm font-medium" style={{ color: status[activeSource] === "connected" ? "#22c55e" : "#8A93A6" }}>{status[activeSource] === "connected" ? "Connected" : "Not Connected"}</div>
                </div>
                {status[activeSource] === "connected" && (
                  <div>
                    <Label>Last Synchronization</Label>
                    <Mono className="text-xs" style={{ color: "#6B7280" }}>{SOURCE_INFO[activeSource].lastSync}</Mono>
                  </div>
                )}
                <div>
                  <Label>Data Available</Label>
                  <ul className="space-y-1 mt-1">
                    {SOURCE_INFO[activeSource].data.map((d) => (
                      <li key={d} className="text-xs flex items-center gap-1.5" style={{ color: "#3D4459" }}><CheckCircle2 size={10} color="#6366f1" />{d}</li>
                    ))}
                  </ul>
                </div>
                {actionMessage && <div className="p-2.5 rounded-lg text-xs" style={{ background: "rgba(34,197,94,0.08)", color: "#15803D" }}>{actionMessage}</div>}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function NotificationPreferencesCard() {
  const [pref, setPref] = useState("All alerts");
  const [saved, setSaved] = useState(false);
  const options = ["All alerts", "High priority only", "Critical only"];

  return (
    <Card>
      <Label>Notification Preference</Label>
      <div className="text-sm font-semibold mb-3" style={{ color: "#23273A" }}>Choose which alerts you want to be notified about</div>
      <div className="space-y-2 mb-4">
        {options.map((o) => (
          <label key={o} className="flex items-center gap-2.5 text-xs cursor-pointer" style={{ color: "#3D4459" }}>
            <input type="radio" name="notif-pref" checked={pref === o} onChange={() => { setPref(o); setSaved(false); }} />
            {o}
          </label>
        ))}
      </div>
      <button onClick={() => setSaved(true)} className="text-xs px-4 py-2 rounded-lg font-medium" style={{ background: "#6366f1", color: "#fff" }}>Save</button>
      {saved && <div className="mt-3 p-2.5 rounded-lg text-xs" style={{ background: "rgba(34,197,94,0.08)", color: "#15803D" }}>Notification preferences updated successfully.</div>}
    </Card>
  );
}

function BasicGovernanceCard() {
  const [empView, setEmpView] = useState(true);
  const Toggle = ({ on, toggle }: { on: boolean; toggle: () => void }) => (
    <button onClick={toggle} className="w-10 h-5 rounded-full relative transition-colors shrink-0" style={{ background: on ? "#6366f1" : "#E4E5EA" }}>
      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all" style={{ left: on ? "22px" : "2px" }} />
    </button>
  );
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Lock size={13} color="#6366f1" />
        <span className="text-xs font-semibold" style={{ color: "#4F46E5" }}>Data & Governance</span>
      </div>
      <div className="flex items-start gap-3 mb-4">
        <Toggle on={empView} toggle={() => setEmpView(!empView)} />
        <div>
          <div className="text-xs font-medium" style={{ color: "#23273A" }}>Employees can view their own evidence</div>
          <div className="text-[11px] mt-0.5" style={{ color: "#8A93A6" }}>Team members can see evidence attributed to them.</div>
        </div>
      </div>
      <div className="pt-3 border-t space-y-1.5" style={{ borderColor: "rgba(15,23,42,0.1)" }}>
        {["TeamPulse surfaces evidence and signals — it does not score, rank or judge employees.", "Managers retain full interpretive authority over every signal.", "No private messages, keystrokes, screen or webcam activity is collected."].map((p) => (
          <div key={p} className="flex items-start gap-2 text-[11px] leading-relaxed" style={{ color: "#6B7280" }}><span className="text-indigo-500 mt-0.5 shrink-0">·</span>{p}</div>
        ))}
      </div>
    </Card>
  );
}
