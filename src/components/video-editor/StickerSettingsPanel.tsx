import { Pin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScopedT } from "@/contexts/I18nContext";
import {
  getStickerById,
  getStickerDataUrl,
  getStickersByCategory,
  type StickerDef,
} from "@/lib/stickers/stickerLibrary";
import { cn } from "@/lib/utils";
import type { AnnotationRegion, StickerCategory, StickerData } from "./types";

interface StickerSettingsPanelProps {
  stickerRegion: AnnotationRegion;
  onStickerDataChange: (stickerData: StickerData) => void;
  onDelete: () => void;
}

function StickerThumbnail({
  sticker,
  isSelected,
  onClick,
}: {
  sticker: StickerDef;
  isSelected: boolean;
  onClick: () => void;
}) {
  const thumbnailUrl = getStickerDataUrl(sticker);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-xl border-2 p-2 transition-all hover:scale-105",
        isSelected
          ? "border-[#f472b6] bg-[#f472b6]/10 shadow-[0_0_12px_rgba(244,114,182,0.25)]"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/[0.15]",
      )}
      title={sticker.name}
    >
      <img
        src={thumbnailUrl}
        alt={sticker.name}
        className="w-full h-full object-contain"
        draggable={false}
      />
    </button>
  );
}

export function StickerSettingsPanel({
  stickerRegion,
  onStickerDataChange,
  onDelete,
}: StickerSettingsPanelProps) {
  const t = useScopedT("settings");

  const currentStickerId = stickerRegion.stickerData?.stickerId ?? "";
  const currentCategory: StickerCategory = stickerRegion.stickerData?.category ?? "round";

  const roundStickers = getStickersByCategory("round");
  const squareStickers = getStickersByCategory("square");

  const handleSelectSticker = (sticker: StickerDef) => {
    onStickerDataChange({
      stickerId: sticker.id,
      category: sticker.category,
    });
  };

  const selectedSticker = getStickerById(currentStickerId);
  const previewUrl = selectedSticker ? getStickerDataUrl(selectedSticker) : "";

  return (
    <div className="min-w-0 p-4 flex flex-col h-full overflow-y-auto custom-scrollbar">
      <div className="mb-3">
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t("sticker.category")}
          </span>
          <div className="mt-1 text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Pin className="w-5 h-5 text-[#f472b6]" />
            {t("sticker.title")}
          </div>
        </div>

        {/* Selected sticker preview */}
        {previewUrl && (
          <div className="mb-4 flex items-center justify-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <img
              src={previewUrl}
              alt={selectedSticker?.name ?? "Sticker"}
              className="w-16 h-16 object-contain"
              draggable={false}
            />
          </div>
        )}

        {/* Category tabs */}
        <Tabs
          value={currentCategory}
          onValueChange={(value) => {
            const category = value as StickerCategory;
            const firstInCategory = getStickersByCategory(category)[0];
            if (firstInCategory) {
              handleSelectSticker(firstInCategory);
            }
          }}
          className="mb-4"
        >
          <TabsList className="mb-4 bg-white/[0.035] border border-white/[0.06] p-0.5 w-full grid grid-cols-2 h-9 rounded-xl">
            <TabsTrigger
              value="round"
              className="data-[state=active]:bg-[#f472b6] data-[state=active]:text-white text-slate-400 rounded-lg transition-all gap-1.5 text-[11px]"
            >
              {t("sticker.categoryRound")}
            </TabsTrigger>
            <TabsTrigger
              value="square"
              className="data-[state=active]:bg-[#f472b6] data-[state=active]:text-white text-slate-400 rounded-lg transition-all gap-1.5 text-[11px]"
            >
              {t("sticker.categorySquare")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="round" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {roundStickers.map((sticker) => (
                <StickerThumbnail
                  key={sticker.id}
                  sticker={sticker}
                  isSelected={currentStickerId === sticker.id}
                  onClick={() => handleSelectSticker(sticker)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="square" className="mt-0">
            <div className="grid grid-cols-3 gap-2">
              {squareStickers.map((sticker) => (
                <StickerThumbnail
                  key={sticker.id}
                  sticker={sticker}
                  isSelected={currentStickerId === sticker.id}
                  onClick={() => handleSelectSticker(sticker)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Options */}
        <div className="space-y-2 mt-4">
          <label className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
            <input
              type="checkbox"
              checked={stickerRegion.stickerData?.linkedToVideo ?? true}
              onChange={(e) =>
                onStickerDataChange({
                  ...(stickerRegion.stickerData ?? {
                    stickerId: currentStickerId,
                    category: currentCategory,
                  }),
                  linkedToVideo: e.target.checked,
                })
              }
              className="w-4 h-4 rounded accent-[#f472b6]"
            />
            <span className="text-[11px] text-slate-300 select-none">Link to video</span>
          </label>

          <label className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] cursor-pointer hover:bg-white/[0.05] transition-colors">
            <input
              type="checkbox"
              checked={
                stickerRegion.stickerData?.fillArea ??
                stickerRegion.stickerData?.category === "square"
              }
              onChange={(e) =>
                onStickerDataChange({
                  ...(stickerRegion.stickerData ?? {
                    stickerId: currentStickerId,
                    category: currentCategory,
                  }),
                  fillArea: e.target.checked,
                })
              }
              className="w-4 h-4 rounded accent-[#f472b6]"
            />
            <span className="text-[11px] text-slate-300 select-none">Fill area</span>
          </label>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/[0.06]">
        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl h-9 text-[11px] font-medium transition-all"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
          {t("annotation.delete")}
        </Button>
      </div>
    </div>
  );
}
