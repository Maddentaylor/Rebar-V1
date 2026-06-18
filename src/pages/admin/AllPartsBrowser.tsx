import { useMemo, useState } from "react";
import {
  parts,
  partsTypeOptions,
  machineTypeOptions,
  type PartItem,
} from "@/mocks/parts";
import { deleteCustomPart, useCustomParts } from "@/lib/customParts";
import {
  hideCatalogPart,
  isCustomPartId,
  restoreCatalogPart,
  useHiddenPartIds,
} from "@/lib/hiddenParts";

const PAGE_SIZE = 50;

function labelForPartsType(partsTypeId: string): string {
  return partsTypeOptions.find((p) => p.id === partsTypeId)?.label ?? partsTypeId;
}

export function AllPartsBrowser() {
  const { parts: customParts } = useCustomParts();
  const { hiddenIds, refresh: refreshHidden } = useHiddenPartIds();
  const [search, setSearch] = useState("");
  const [machineTypeId, setMachineTypeId] = useState("");
  const [showRemoved, setShowRemoved] = useState(false);
  const [page, setPage] = useState(0);

  const catalogParts = useMemo(() => {
    const customIds = new Set(customParts.map((p) => p.id));
    return parts.filter((p) => !customIds.has(p.id));
  }, [customParts]);

  const allVisible = useMemo(() => {
    const merged: (PartItem & { isCustom: boolean; isHidden: boolean })[] = [
      ...customParts.map((p) => ({
        ...p,
        isCustom: true,
        isHidden: false,
      })),
      ...catalogParts.map((p) => ({
        ...p,
        isCustom: false,
        isHidden: hiddenIds.has(p.id),
      })),
    ];

    const q = search.trim().toLowerCase();
    return merged.filter((p) => {
      if (!showRemoved && p.isHidden) return false;
      if (machineTypeId) {
        const pt = partsTypeOptions.find((o) => o.id === p.partsTypeId);
        if (pt?.machineTypeId !== machineTypeId) return false;
      }
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [customParts, catalogParts, hiddenIds, search, machineTypeId, showRemoved]);

  const totalPages = Math.max(1, Math.ceil(allVisible.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = allVisible.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const handleRemove = async (part: PartItem & { isCustom: boolean; isHidden: boolean }) => {
    const action = part.isHidden ? "restore" : "remove";
    if (
      !window.confirm(
        part.isHidden
          ? `Restore "${part.name}" to the public Parts catalog?`
          : `Remove "${part.name}" from the public Parts catalog?`
      )
    ) {
      return;
    }

    try {
      if (part.isHidden) {
        await restoreCatalogPart(part.id);
      } else if (part.isCustom || isCustomPartId(part.id)) {
        await deleteCustomPart(part.id);
      } else {
        await hideCatalogPart(part.id);
      }
      refreshHidden();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Could not update part.");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-canvas-edge bg-canvas px-4 py-2.5 text-ink outline-none focus:border-brand-red";

  return (
    <section className="mt-10 rounded-2xl border border-canvas-edge bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-xl font-black tracking-tight text-ink"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            All catalog parts
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Browse every part on the site. Remove hides it from the public Parts page; uploaded
            parts are deleted permanently.
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-subtle">
          {allVisible.length} showing
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle">
            Search
          </label>
          <input
            className={inputClass}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            placeholder="Name, part number, or category…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.25em] text-ink-subtle">
            Machine type
          </label>
          <select
            className={inputClass}
            value={machineTypeId}
            onChange={(e) => {
              setMachineTypeId(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All machines</option>
            {machineTypeOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={showRemoved}
          onChange={(e) => {
            setShowRemoved(e.target.checked);
            setPage(0);
          }}
          className="rounded border-canvas-edge text-brand-red focus:ring-brand-red"
        />
        Show removed catalog parts ({hiddenIds.size})
      </label>

      <div className="max-h-[32rem] space-y-2 overflow-y-auto rounded-xl border border-canvas-edge bg-canvas/40 p-2">
        {pageItems.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-muted">No parts match your filters.</p>
        ) : (
          pageItems.map((part) => (
            <div
              key={part.id}
              className={`flex items-center gap-3 rounded-lg border bg-white p-3 ${
                part.isHidden ? "border-ink-subtle/40 opacity-70" : "border-canvas-edge"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-canvas-edge bg-canvas">
                <img src={part.image} alt="" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink">{part.name}</p>
                <p className="truncate text-xs text-ink-muted">
                  <span className="font-mono">{part.partNumber}</span>
                  <span className="text-ink-subtle">
                    {" "}
                    · {labelForPartsType(part.partsTypeId)} › {part.category}
                  </span>
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
                  {part.isHidden ? "Removed" : part.isCustom ? "Uploaded" : "Catalog"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void handleRemove(part)}
                className="shrink-0 rounded-full border border-canvas-edge px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-ink-subtle transition-colors hover:border-brand-red/50 hover:text-brand-red"
              >
                {part.isHidden ? "Restore" : "Remove"}
              </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={safePage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-full border border-canvas-edge px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-ink-muted">
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-full border border-canvas-edge px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
