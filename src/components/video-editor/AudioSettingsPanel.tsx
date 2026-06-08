import { Search, Trash2, Upload, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Fuse, { type FuseResult } from "fuse.js";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScopedT } from "@/contexts/I18nContext";
import { AUDIO_LIBRARY } from "@/lib/audioLibrary";
import { cn } from "@/lib/utils";
import type { AudioLibraryItem } from "@/lib/audioLibrary";
import type { AudioHooksConfig, AudioHookType, TrimRegion } from "./types";
import { DEFAULT_AUDIO_HOOKS } from "./types";

export interface AudioSettingsPanelProps {
	backgroundMusicPath?: string | null;
	backgroundMusicVolume?: number;
	backgroundMusicFadeIn?: number;
	backgroundMusicFadeOut?: number;
	onBackgroundMusicPick?: () => void;
	onBackgroundMusicRemove?: () => void;
	onBackgroundMusicVolumeChange?: (volume: number) => void;
	onBackgroundMusicVolumeCommit?: () => void;
	onBackgroundMusicFadeInChange?: (value: number) => void;
	onBackgroundMusicFadeInCommit?: () => void;
	onBackgroundMusicFadeOutChange?: (value: number) => void;
	onBackgroundMusicFadeOutCommit?: () => void;
	onMusicTrackSelect?: (trackUrl: string) => void;
	backgroundMusicRegions?: TrimRegion[];
	audioHooks?: AudioHooksConfig;
	audioHooksVolume?: number;
	onAudioHooksChange?: (hooks: AudioHooksConfig) => void;
	onAudioHooksVolumeChange?: (volume: number) => void;
	onAudioHooksVolumeCommit?: () => void;
	hookSoundLayers?: Record<AudioHookType, string[]>;
	onHookTrackAdd?: (hook: AudioHookType, trackUrl: string) => void;
	onHookTrackRemove?: (hook: AudioHookType, trackUrl: string) => void;
}

export function AudioSettingsPanel({
	backgroundMusicPath = null,
	backgroundMusicVolume = 0.35,
	backgroundMusicFadeIn = 0,
	backgroundMusicFadeOut = 0,
	onBackgroundMusicPick,
	onBackgroundMusicRemove,
	onBackgroundMusicVolumeChange,
	onBackgroundMusicVolumeCommit,
	onBackgroundMusicFadeInChange,
	onBackgroundMusicFadeInCommit,
	onBackgroundMusicFadeOutChange,
	onBackgroundMusicFadeOutCommit,
	onMusicTrackSelect,
	backgroundMusicRegions = [],
	audioHooks = DEFAULT_AUDIO_HOOKS,
	audioHooksVolume = 0.35,
	onAudioHooksChange,
	onAudioHooksVolumeChange,
	onAudioHooksVolumeCommit,
	hookSoundLayers = {
		zoom: ["/audio/hooks/zoom.wav"],
		trim: ["/audio/hooks/trim.wav"],
		speed: ["/audio/hooks/speed.mp3"],
		annotation: ["/audio/hooks/annotation.mp3"],
		blur: ["/audio/hooks/blur.wav"],
	},
	onHookTrackAdd,
	onHookTrackRemove,
}: AudioSettingsPanelProps) {
	const t = useScopedT("settings");

	const [musicLibraryQuery, setMusicLibraryQuery] = useState("");
	const [hookLibraryQuery, setHookLibraryQuery] = useState("");
	const [selectedHookTarget, setSelectedHookTarget] = useState<AudioHookType>("zoom");
	const [previewingMusicTrackId, setPreviewingMusicTrackId] = useState<string | null>(null);
	const musicPreviewAudioRef = useRef<HTMLAudioElement | null>(null);

	const backgroundMusicName = useMemo(() => {
		if (!backgroundMusicPath) return null;
		const parts = backgroundMusicPath.split(/[\\/]+/);
		return parts[parts.length - 1] || backgroundMusicPath;
	}, [backgroundMusicPath]);

	const hookOptions = useMemo<Array<{ key: AudioHookType; label: string }>>(
		() => [
			{ key: "zoom", label: t("audio.hooks.zoom") },
			{ key: "trim", label: t("audio.hooks.trim") },
			{ key: "speed", label: t("audio.hooks.speed") },
			{ key: "annotation", label: t("audio.hooks.annotation") },
			{ key: "blur", label: t("audio.hooks.blur") },
		],
		[t],
	);

	const musicLibrary = useMemo(
		() => AUDIO_LIBRARY.filter((entry) => entry.category === "music"),
		[],
	);
	const hookLibrary = useMemo(
		() => AUDIO_LIBRARY.filter((entry) => entry.category === "hook"),
		[],
	);

	const musicFuse = useMemo(
		() =>
			new Fuse(musicLibrary, {
				keys: ["name", "tags"],
				threshold: 0.4,
			}),
		[musicLibrary],
	);
	const hookFuse = useMemo(
		() =>
			new Fuse(hookLibrary, {
				keys: ["name", "tags"],
				threshold: 0.4,
			}),
		[hookLibrary],
	);

	const filteredMusicLibrary = useMemo(() => {
		const query = musicLibraryQuery.trim();
		if (!query) return musicLibrary;
		return musicFuse.search(query).map((r: FuseResult<typeof musicLibrary[number]>) => r.item);
	}, [musicLibrary, musicLibraryQuery, musicFuse]);

	const filteredHookLibrary = useMemo(() => {
		const query = hookLibraryQuery.trim();
		if (!query) return hookLibrary;
		return hookFuse.search(query).map((r: FuseResult<typeof hookLibrary[number]>) => r.item);
	}, [hookLibrary, hookLibraryQuery, hookFuse]);

	const stopMusicPreview = useCallback(() => {
		if (musicPreviewAudioRef.current) {
			musicPreviewAudioRef.current.pause();
			musicPreviewAudioRef.current.currentTime = 0;
			musicPreviewAudioRef.current = null;
		}
		setPreviewingMusicTrackId(null);
	}, []);

	const handleMusicLibraryPreview = useCallback(
		(trackId: string, trackUrl: string) => {
			if (previewingMusicTrackId === trackId && musicPreviewAudioRef.current) {
				stopMusicPreview();
				return;
			}
			stopMusicPreview();
			const audio = new Audio(trackUrl);
			audio.volume = 0.5;
			audio.preload = "auto";
			musicPreviewAudioRef.current = audio;
			setPreviewingMusicTrackId(trackId);
			void audio.play().catch(() => {
				stopMusicPreview();
			});
			audio.addEventListener("ended", stopMusicPreview, { once: true });
		},
		[previewingMusicTrackId, stopMusicPreview],
	);

	useEffect(() => {
		return () => {
			stopMusicPreview();
		};
	}, [stopMusicPreview]);

	return (
		<Tabs defaultValue="upload" className="w-full">
			<TabsList className="mb-2 bg-white/5 border border-white/5 p-0.5 w-full grid grid-cols-3 h-7 rounded-lg">
				<TabsTrigger
					value="upload"
					className="text-[10px] px-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
				>
					{t("audio.tabs.upload")}
				</TabsTrigger>
				<TabsTrigger
					value="music"
					className="text-[10px] px-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
				>
					{t("audio.tabs.music")}
				</TabsTrigger>
				<TabsTrigger
					value="hooks"
					className="text-[10px] px-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-md"
				>
					{t("audio.tabs.hooks")}
				</TabsTrigger>
			</TabsList>

			{/* Upload tab */}
			<TabsContent value="upload" className="mt-0 space-y-2">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={onBackgroundMusicPick}
						className="flex-1 h-8 bg-white/5 border-white/10 hover:bg-white/10 text-xs"
					>
						<Upload className="w-3 h-3 mr-1" />
						{backgroundMusicPath ? t("audio.replace") : t("audio.upload")}
					</Button>
					{backgroundMusicPath && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onBackgroundMusicRemove}
							className="h-8 w-8 hover:bg-red-500/10 text-slate-400 hover:text-red-400"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</Button>
					)}
				</div>
				{backgroundMusicName ? (
					<p className="text-[10px] text-slate-400 truncate">{backgroundMusicName}</p>
				) : (
					<p className="text-[10px] text-slate-500 italic">{t("audio.noFileSelected")}</p>
				)}

				{/* Volume */}
				<div className="flex items-center gap-2">
					<Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
					<span className="text-[10px] text-slate-400 w-16 shrink-0">{t("audio.volume")}</span>
					<Slider
						min={0}
						max={1}
						step={0.01}
						value={[backgroundMusicVolume]}
						onValueChange={([v]) => onBackgroundMusicVolumeChange?.(v)}
						onValueCommit={() => onBackgroundMusicVolumeCommit?.()}
						className="flex-1"
					/>
					<span className="text-[10px] text-slate-500 w-8 text-right">
						{Math.round(backgroundMusicVolume * 100)}%
					</span>
				</div>

				{/* Fade In */}
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-slate-400 w-16 shrink-0">{t("audio.fadeIn")}</span>
					<Slider
						min={0}
						max={10}
						step={0.1}
						value={[backgroundMusicFadeIn]}
						onValueChange={([v]) => onBackgroundMusicFadeInChange?.(v)}
						onValueCommit={() => onBackgroundMusicFadeInCommit?.()}
						className="flex-1"
					/>
					<span className="text-[10px] text-slate-500 w-8 text-right">
						{backgroundMusicFadeIn.toFixed(1)}s
					</span>
				</div>

				{/* Fade Out */}
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-slate-400 w-16 shrink-0">{t("audio.fadeOut")}</span>
					<Slider
						min={0}
						max={10}
						step={0.1}
						value={[backgroundMusicFadeOut]}
						onValueChange={([v]) => onBackgroundMusicFadeOutChange?.(v)}
						onValueCommit={() => onBackgroundMusicFadeOutCommit?.()}
						className="flex-1"
					/>
					<span className="text-[10px] text-slate-500 w-8 text-right">
						{backgroundMusicFadeOut.toFixed(1)}s
					</span>
				</div>

				{backgroundMusicRegions.length > 0 && (
					<div className="text-[10px] text-slate-500">
						{t("audio.regionCount", { count: backgroundMusicRegions.length })}
					</div>
				)}
			</TabsContent>

			{/* Music Library tab */}
			<TabsContent value="music" className="mt-0 space-y-2">
				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
					<input
						type="text"
						placeholder={t("audio.searchMusicPlaceholder")}
						value={musicLibraryQuery}
						onChange={(e) => setMusicLibraryQuery(e.target.value)}
						className="w-full h-7 pl-7 pr-2 rounded-md border border-white/10 bg-white/5 text-[10px] text-slate-200 outline-none focus:border-[#34B27B]/50"
					/>
				</div>
				<div className="max-h-40 overflow-y-auto space-y-1">
					{filteredMusicLibrary.length === 0 ? (
						<p className="text-[10px] text-slate-500 text-center py-2">
							{t("audio.noSearchResults")}
						</p>
					) : (
						filteredMusicLibrary.map((track: AudioLibraryItem) => (
							<div
								key={track.id}
								className="flex items-center gap-2 p-1.5 rounded-md hover:bg-white/5"
							>
								<button
									type="button"
									onClick={() => handleMusicLibraryPreview(track.id, track.url)}
									className="shrink-0 w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-[10px]"
								>
									{previewingMusicTrackId === track.id ? "⏹" : "▶"}
								</button>
								<span className="flex-1 text-[10px] text-slate-300 truncate">
									{track.name}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onMusicTrackSelect?.(track.url)}
									className="h-6 text-[10px] text-[#34B27B] hover:text-[#34B27B] hover:bg-[#34B27B]/10 px-2"
								>
									{t("audio.useTrack")}
								</Button>
							</div>
						))
					)}
				</div>
			</TabsContent>

			{/* Hooks tab */}
			<TabsContent value="hooks" className="mt-0 space-y-2">
				<div className="text-[10px] font-medium text-slate-400">{t("audio.hooks.title")}</div>

				{/* Hook type selector */}
				<div className="flex items-center gap-2">
					<span className="text-[10px] text-slate-500">{t("audio.hooks.assignTo")}:</span>
					<Select
						value={selectedHookTarget}
						onValueChange={(v) => setSelectedHookTarget(v as AudioHookType)}
					>
						<SelectTrigger className="h-7 text-[10px] w-28">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{hookOptions.map((opt) => (
								<SelectItem key={opt.key} value={opt.key}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Hook toggle switches */}
				<div className="flex flex-wrap gap-1.5">
					{hookOptions.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() =>
								onAudioHooksChange?.({
									...audioHooks,
									[key]: !audioHooks[key],
								})
							}
							className={cn(
								"px-2 py-0.5 rounded text-[10px] border transition-all",
								audioHooks[key]
									? "bg-[#34B27B]/10 border-[#34B27B]/50 text-[#34B27B]"
									: "bg-white/5 border-white/10 text-slate-500 hover:border-white/20",
							)}
						>
							{label}
						</button>
					))}
				</div>

				{/* Hook volume */}
				<div className="flex items-center gap-2">
					<Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
					<Slider
						min={0}
						max={1}
						step={0.01}
						value={[audioHooksVolume]}
						onValueChange={([v]) => onAudioHooksVolumeChange?.(v)}
						onValueCommit={() => onAudioHooksVolumeCommit?.()}
						className="flex-1"
					/>
					<span className="text-[10px] text-slate-500 w-8 text-right">
						{Math.round(audioHooksVolume * 100)}%
					</span>
				</div>

				{/* SFX search */}
				<div className="relative">
					<Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
					<input
						type="text"
						placeholder={t("audio.searchHookPlaceholder")}
						value={hookLibraryQuery}
						onChange={(e) => setHookLibraryQuery(e.target.value)}
						className="w-full h-7 pl-7 pr-2 rounded-md border border-white/10 bg-white/5 text-[10px] text-slate-200 outline-none focus:border-[#34B27B]/50"
					/>
				</div>
				<div className="max-h-32 overflow-y-auto space-y-1">
					{filteredHookLibrary.length === 0 ? (
						<p className="text-[10px] text-slate-500 text-center py-2">
							{t("audio.noSearchResults")}
						</p>
					) : (
						filteredHookLibrary.map((track: AudioLibraryItem) => (
							<div
								key={track.id}
								className="flex items-center gap-2 p-1.5 rounded-md hover:bg-white/5"
							>
								<span className="flex-1 text-[10px] text-slate-300 truncate">
									{track.name}
								</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onHookTrackAdd?.(selectedHookTarget, track.url)}
									className="h-6 text-[10px] text-[#34B27B] hover:text-[#34B27B] hover:bg-[#34B27B]/10 px-2"
								>
									{t("audio.addTrack")}
								</Button>
							</div>
						))
					)}
				</div>

				{/* Assigned tracks */}
				{Object.entries(hookSoundLayers).some(([, urls]) => urls.length > 1) && (
					<div className="text-[10px] font-medium text-slate-400 pt-1">
						{t("audio.hooks.assigned")}:
					</div>
				)}
				{Object.entries(hookSoundLayers).map(([hook, urls]) => {
					const customUrls = urls.slice(1);
					if (customUrls.length === 0) return null;
					return customUrls.map((url) => (
						<div key={`${hook}-${url}`} className="flex items-center gap-2 text-[10px]">
							<span className="text-slate-500">
								{hookOptions.find((o) => o.key === hook)?.label}
							</span>
							<span className="flex-1 text-slate-400 truncate">{url.split("/").pop()}</span>
							<button
								type="button"
								onClick={() => onHookTrackRemove?.(hook as AudioHookType, url)}
								className="text-slate-500 hover:text-red-400"
							>
								<X className="w-3 h-3" />
							</button>
						</div>
					));
				})}
			</TabsContent>
		</Tabs>
	);
}
