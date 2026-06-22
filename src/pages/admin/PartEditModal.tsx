import { useMemo, useState } from "react";
import {
  machineTypeOptions,
  partsTypeOptions,
  partCategories,
  type PartItem,
} from "@/mocks/parts";
import { fileToCompressedDataUrl, updateCustomPart } from "@/lib/customParts";

const NEW_CATEGORY = "__new__";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#e1e4ea"/><g fill="#9aa0ab" font-family="sans-serif" font-size="22" text-anchor="middle"><text x="200" y="210">No photo</text></g></svg>`
  );

type EditablePart = PartItem & { isCustom?: boolean };

export function PartEditModal({
  part,
  onClose,
  onSaved,
}: {
  part: EditablePart;
  onClose: () => void;
  onSaved: () => void;
}) {
  const initialPartsType = partsTypeOptions.find((p) => p.id === part.partsTypeId);
  const initialCategories = part.partsTypeId ? partCategories[part.partsTypeId] ?? [] : [];
  const categoryInList = initialCategories.includes(part.category);

  const [name, setName] = useState(part.name);
  const [partNumber, setPartNumber] = useState(part.partNumber);
  const [machineTypeId, setMachineTypeId] = useState(initialPartsType?.machineTypeId ?? "");
  const [partsTypeId, setPartsTypeId] = useState(part.partsTypeId);
  const [categorySelect, setCategorySelect] = useState(
    categoryInList ? part.category : part.category ? NEW_CATEGORY : ""
  );
  const [newCategory, setNewCategory] = useState(categoryInList ? "" : part.category);
  const [description, setDescription] = useState(part.description ?? "");
  const [imageDataUrl, setImageDataUrl] = useState(part.image);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const availablePartsTypes = useMemo(
    () => partsTypeOptions.filter((pt) => pt.machineTypeId === machineTypeId),
    [machineTypeId]
  );
  const availableCategories = partsTypeId ? partCategories[partsTypeId] ?? [] : [];
  const resolvedCategory = categorySelect === NEW_CATEGORY ? newCategory.trim() : categorySelect;

  const machineLabel = machineTypeOptions.find((m) => m.id === machineTypeId)?.label ?? "";
  const partsTypeLabel = partsTypeOptions.find((p) => p.id === partsTypeId)?.label ?? "";

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

    if (!name.trim() || !partNumber.trim()) {
      setError("Name and part number are required.");
      return;
    }
    if (!machineTypeId || !partsTypeId) {
      setError("Choose a machine type and parts type.");
      return;
    }
    if (!resolvedCategory) {
      setError("Pick a category (or add a new one).");
      return;
    }

    setSaving(true);
    try {
      await updateCustomPart({
        id: part.id,
        name: name.trim(),
        partNumber: partNumber.trim(),
        partsTypeId,
        category: resolvedCategory,
        image: imageDataUrl || PLACEHOLDER_IMAGE,
        description: description.trim() || undefined,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-canvas-edge bg-canvas px-4 py-2.5 text-ink outline-none focus:border-brand-red disabled:opacity-50";
  const labelClass =
    "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-part-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink-deep/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={submit}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-canvas-edge bg-white p-6 shadow-card sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-brand-red">
              Edit part
            </p>
            <h2
              id="edit-part-title"
              className="mt-1 text-xl font-black tracking-tight text-ink"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {part.name}
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              {part.isCustom ? "Uploaded part" : "Catalog part — saves as a live override"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-canvas-edge text-xl text-ink-subtle hover:text-ink"
            aria-label="Close editor"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Part name</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Part number</label>
            <input
              className={inputClass}
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-canvas-edge bg-canvas/60 p-5">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red">
            Where it goes
          </p>
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
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
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
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
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
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                {imageBusy ? "Processing image…" : "Choose a new photo to replace the current one."}
              </p>
            </div>
          </div>
        </div>

        {error && <p className="mt-5 text-sm font-medium text-brand-red">{error}</p>}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={imageBusy || saving}
            className="rounded-full bg-brand-red px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-ruby disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-canvas-edge px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-ink-subtle hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
