import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  machineTypeOptions,
  partsTypeOptions,
  partCategories,
} from "@/mocks/parts";
import { useAdminAuth, changePassword } from "@/lib/adminAuth";
import {
  addCustomPart,
  deleteCustomPart,
  fileToCompressedDataUrl,
  useCustomParts,
} from "@/lib/customParts";
import { AllPartsBrowser } from "./AllPartsBrowser";

const NEW_CATEGORY = "__new__";

// Neutral placeholder shown when a part is saved without a photo.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#e1e4ea"/><g fill="#9aa0ab" font-family="sans-serif" font-size="22" text-anchor="middle"><text x="200" y="210">No photo</text></g></svg>`
  );

function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-canvas-edge bg-canvas py-2.5 pl-4 pr-11 text-ink outline-none focus:border-brand-red"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-ink-subtle transition-colors hover:text-ink"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => Promise<boolean> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const ok = await onLogin(username, password);
    setBusy(false);
    if (!ok) {
      setError("Incorrect username or password.");
      setPassword("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-canvas-edge bg-white p-8 shadow-card"
      >
        <div className="mb-6 inline-flex items-center gap-3">
          <span className="h-8 w-px bg-brand-red" />
          <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-red">
            Admin Access
          </span>
        </div>
        <h1
          className="mb-1 text-2xl font-black tracking-tight text-ink"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Sign in
        </h1>
        <p className="mb-6 text-sm text-ink-muted">Restricted area — staff only.</p>

        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle">
          Username
        </label>
        <input
          type="text"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-lg border border-canvas-edge bg-canvas px-4 py-2.5 text-ink outline-none focus:border-brand-red"
          autoComplete="username"
        />

        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle">
          Password
        </label>
        <div className="mb-2">
          <PasswordInput
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="mb-3 text-sm font-medium text-brand-red">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-full bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ruby disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Enter"}
        </button>

        <Link
          to="/"
          className="mt-4 block text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-subtle hover:text-ink"
        >
          Back to site
        </Link>
      </form>
    </div>
  );
}

function AddPartForm() {
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [machineTypeId, setMachineTypeId] = useState("");
  const [partsTypeId, setPartsTypeId] = useState("");
  const [categorySelect, setCategorySelect] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const availablePartsTypes = useMemo(
    () => partsTypeOptions.filter((pt) => pt.machineTypeId === machineTypeId),
    [machineTypeId]
  );
  const availableCategories = partsTypeId ? partCategories[partsTypeId] ?? [] : [];

  const machineLabel = machineTypeOptions.find((m) => m.id === machineTypeId)?.label ?? "";
  const partsTypeLabel = partsTypeOptions.find((p) => p.id === partsTypeId)?.label ?? "";
  const resolvedCategory = categorySelect === NEW_CATEGORY ? newCategory.trim() : categorySelect;

  const reset = () => {
    setName("");
    setPartNumber("");
    setMachineTypeId("");
    setPartsTypeId("");
    setCategorySelect("");
    setNewCategory("");
    setDescription("");
    setImageDataUrl("");
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setImageBusy(true);
    try {
      setImageDataUrl(await fileToCompressedDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process image.");
    } finally {
      setImageBusy(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSavedMsg("");

    if (!name.trim() || !partNumber.trim()) {
      setError("Name and part number are required.");
      return;
    }
    if (!machineTypeId || !partsTypeId) {
      setError("Choose a machine type and a parts type so the part is placed correctly.");
      return;
    }
    if (!resolvedCategory) {
      setError("Pick a category (or add a new one).");
      return;
    }

    setSaving(true);
    try {
      await addCustomPart({
        id: `custom-${Date.now()}`,
        name: name.trim(),
        partNumber: partNumber.trim(),
        partsTypeId,
        category: resolvedCategory,
        image: imageDataUrl || PLACEHOLDER_IMAGE,
        description: description.trim() || undefined,
      });
      setSavedMsg(
        `Saved "${name.trim()}" — it now appears on the live Parts catalog under ${machineLabel} › ${partsTypeLabel} › ${resolvedCategory}.`
      );
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save part.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-canvas-edge bg-canvas px-4 py-2.5 text-ink outline-none focus:border-brand-red disabled:opacity-50";
  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-canvas-edge bg-white p-6 shadow-card sm:p-8">
      <h2 className="mb-6 text-xl font-black tracking-tight text-ink" style={{ fontFamily: "'Inter', sans-serif" }}>
        Add a part
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Part name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Foot Pedal (no cord)" />
        </div>
        <div>
          <label className={labelClass}>Part number</label>
          <input className={inputClass} value={partNumber} onChange={(e) => setPartNumber(e.target.value)} placeholder="e.g. 10-0225" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-canvas-edge bg-canvas/60 p-5">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">Where it goes</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Machine type</label>
            <select
              className={inputClass}
              value={machineTypeId}
              onChange={(e) => {
                setMachineTypeId(e.target.value);
                setPartsTypeId("");
                setCategorySelect("");
              }}
            >
              <option value="">Select…</option>
              {machineTypeOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Parts type (model)</label>
            <select
              className={inputClass}
              value={partsTypeId}
              disabled={!machineTypeId}
              onChange={(e) => {
                setPartsTypeId(e.target.value);
                setCategorySelect("");
              }}
            >
              <option value="">Select…</option>
              {availablePartsTypes.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select
              className={inputClass}
              value={categorySelect}
              disabled={!partsTypeId}
              onChange={(e) => setCategorySelect(e.target.value)}
            >
              <option value="">Select…</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value={NEW_CATEGORY}>+ Add new category…</option>
            </select>
          </div>
        </div>

        {categorySelect === NEW_CATEGORY && (
          <div className="mt-4">
            <label className={labelClass}>New category name</label>
            <input
              className={inputClass}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Hydraulic Parts"
            />
          </div>
        )}

        {machineTypeId && partsTypeId && resolvedCategory && (
          <p className="mt-4 text-sm text-ink-muted">
            Appears at: <span className="font-bold text-ink">{machineLabel}</span>
            <span className="text-ink-subtle"> › </span>
            <span className="font-bold text-ink">{partsTypeLabel}</span>
            <span className="text-ink-subtle"> › </span>
            <span className="font-bold text-ink">{resolvedCategory}</span>
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className={labelClass}>Description (optional)</label>
        <textarea
          className={`${inputClass} min-h-[88px] resize-y`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notes, fitment, voltage, etc."
        />
      </div>

      <div className="mt-6">
        <label className={labelClass}>Photo</label>
        <div className="flex items-center gap-5">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-canvas-edge bg-canvas">
            {imageDataUrl ? (
              <img src={imageDataUrl} alt="Preview" className="h-full w-full object-contain" />
            ) : (
              <i className="ri-image-add-line text-3xl text-ink-subtle" aria-hidden />
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="block text-sm text-ink-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink-deep file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-black"
            />
            <p className="mt-2 text-xs text-ink-subtle">
              {imageBusy ? "Processing image…" : "JPG or PNG. Auto-resized for the web."}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-5 text-sm font-medium text-brand-red">{error}</p>}
      {savedMsg && <p className="mt-5 rounded-lg bg-[#2e7d32]/10 px-4 py-3 text-sm font-medium text-[#2e7d32]">{savedMsg}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="submit"
          disabled={imageBusy || saving}
          className="rounded-full bg-brand-red px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ruby disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save part"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-sm font-bold uppercase tracking-[0.18em] text-ink-subtle hover:text-ink"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setSuccess("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-canvas-edge bg-white p-5 shadow-card"
    >
      <h2 className="mb-1 text-sm font-black uppercase tracking-[0.2em] text-ink">
        Change password
      </h2>
      <p className="mb-4 text-xs text-ink-muted">
        Use Show to view what you type. Saves to the live admin account.
      </p>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Current password</label>
          <PasswordInput
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className={labelClass}>New password</label>
          <PasswordInput
            value={newPassword}
            onChange={setNewPassword}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className={labelClass}>Confirm new password</label>
          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm font-medium text-brand-red">{error}</p>}
      {success && (
        <p className="mt-4 rounded-lg bg-[#2e7d32]/10 px-3 py-2 text-sm font-medium text-[#2e7d32]">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-4 w-full rounded-full border border-canvas-edge px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:border-brand-red/50 hover:text-brand-red disabled:opacity-50"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}

function CustomPartsList() {
  const { parts: customParts, loading, error } = useCustomParts();

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-canvas-edge bg-white/60 p-8 text-center">
        <p className="text-sm text-ink-muted">Loading uploaded parts…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-red/30 bg-brand-red/5 p-6">
        <p className="text-sm font-medium text-brand-red">{error}</p>
        <p className="mt-2 text-xs text-ink-muted">
          Make sure Postgres and Blob storage are connected in Vercel, then redeploy.
        </p>
      </div>
    );
  }

  if (customParts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-canvas-edge bg-white/60 p-8 text-center">
        <p className="text-sm text-ink-muted">No parts added yet. Use the form to add your first part.</p>
      </div>
    );
  }

  const labelFor = (partsTypeId: string) =>
    partsTypeOptions.find((p) => p.id === partsTypeId)?.label ?? partsTypeId;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-subtle">
        Added parts · {customParts.length}
      </p>
      {customParts.map((part) => (
        <div
          key={part.id}
          className="flex items-center gap-4 rounded-xl border border-canvas-edge bg-white p-3 shadow-soft"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-canvas-edge bg-canvas">
            <img src={part.image} alt={part.name} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">{part.name}</p>
            <p className="truncate text-xs text-ink-muted">
              <span className="font-mono">{part.partNumber}</span>
              <span className="text-ink-subtle"> · {labelFor(part.partsTypeId)} › {part.category}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!window.confirm(`Delete "${part.name}"?`)) return;
              try {
                await deleteCustomPart(part.id);
              } catch (err) {
                window.alert(err instanceof Error ? err.message : "Could not delete part.");
              }
            }}
            className="shrink-0 rounded-full border border-canvas-edge px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-ink-subtle transition-colors hover:border-brand-red/50 hover:text-brand-red"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { user, login, logout } = useAdminAuth();

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-canvas-edge bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-6 w-px bg-brand-red" />
            <span className="text-[11px] font-bold uppercase tracking-[0.35em] text-brand-red">
              RMS Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/parts" className="text-xs font-bold uppercase tracking-[0.2em] text-ink-subtle hover:text-ink">
              View catalog
            </Link>
            <span className="hidden text-xs text-ink-subtle sm:inline">Signed in as {user}</span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-canvas-edge px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:border-brand-red/50 hover:text-brand-red"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1
          className="mb-2 text-3xl font-black tracking-tight text-ink"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Parts manager
        </h1>
        <p className="mb-8 max-w-2xl text-sm text-ink-muted">
          Add replacement parts to the catalog. Choose exactly where each part appears
          (machine type, model, and category), upload a photo, and it shows up on the
          live Parts page for all visitors.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem]">
          <AddPartForm />
          <div className="space-y-6">
            <CustomPartsList />
            <ChangePasswordForm />
          </div>
        </div>

        <AllPartsBrowser />
      </main>
    </div>
  );
}
