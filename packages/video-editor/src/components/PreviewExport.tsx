import {Player, type PlayerRef} from '@remotion/player';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
	VideoComposition,
	type VideoCompositionProps,
} from '../compositions/VideoComposition';
import type {EditorState} from '../hooks/useEditorStore';

export const PreviewExport: React.FC<{
	readonly state: EditorState;
	readonly totalDuration: number;
	readonly onPrev: () => void;
}> = ({state, totalDuration, onPrev}) => {
	const playerRef = useRef<PlayerRef>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [exportStatus, setExportStatus] = useState<
		'idle' | 'preparing' | 'done'
	>('idle');

	const isReel = state.format === 'reel';
	const width = isReel ? 1080 : 1080;
	const height = isReel ? 1920 : 1080;

	const inputProps: VideoCompositionProps = useMemo(
		() => ({
			mediaFiles: state.mediaFiles,
			customization: state.customization,
			opening: state.opening,
			closing: state.closing,
			captions: state.captions,
		}),
		[
			state.mediaFiles,
			state.customization,
			state.opening,
			state.closing,
			state.captions,
		],
	);

	const handlePlayPause = useCallback(() => {
		if (!playerRef.current) return;
		if (isPlaying) {
			playerRef.current.pause();
		} else {
			playerRef.current.play();
		}
		setIsPlaying(!isPlaying);
	}, [isPlaying]);

	const handleSeekStart = useCallback(() => {
		playerRef.current?.seekTo(0);
	}, []);

	const handleExport = useCallback(() => {
		setExportStatus('preparing');
		// In a full implementation, this would use @remotion/renderer or
		// the web renderer to render the video. For now we show instructions.
		setTimeout(() => {
			setExportStatus('done');
		}, 1500);
	}, []);

	// Scale the player to fit the viewport
	const playerScale = isReel ? 0.28 : 0.45;

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Preview & Export</h2>
			<p className="text-editor-muted mb-6">
				Review your video and export when ready.
			</p>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Player */}
				<div className="flex-1 flex flex-col items-center">
					<div
						className="rounded-xl overflow-hidden bg-black shadow-2xl"
						style={{
							width: width * playerScale,
							height: height * playerScale,
						}}
					>
						<Player
							ref={playerRef}
							component={VideoComposition}
							inputProps={inputProps}
							durationInFrames={Math.max(totalDuration, 30)}
							compositionWidth={width}
							compositionHeight={height}
							fps={state.fps}
							style={{
								width: width * playerScale,
								height: height * playerScale,
							}}
							controls={false}
							autoPlay={false}
							loop
							acknowledgeRemotionLicense
						/>
					</div>

					{/* Playback controls */}
					<div className="flex items-center gap-4 mt-4">
						<button
							onClick={handleSeekStart}
							className="w-10 h-10 rounded-full bg-editor-border text-editor-text flex items-center justify-center hover:bg-editor-border/80 transition-all"
							type="button"
							title="Restart"
						>
							{'\u23EE'}
						</button>
						<button
							onClick={handlePlayPause}
							className="w-14 h-14 rounded-full bg-editor-accent text-white flex items-center justify-center hover:bg-editor-accent-hover transition-all text-xl"
							type="button"
						>
							{isPlaying ? '\u23F8' : '\u25B6'}
						</button>
					</div>
				</div>

				{/* Sidebar info & export */}
				<div className="lg:w-80 space-y-4">
					{/* Video info */}
					<div className="p-4 rounded-xl bg-editor-surface border border-editor-border">
						<h3 className="font-semibold mb-3">Video Details</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-editor-muted">Template</span>
								<span className="font-medium">
									{state.template || 'None'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Format</span>
								<span className="font-medium">
									{isReel ? '9:16 Reel' : '1:1 Post'}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Resolution</span>
								<span className="font-medium">
									{width}x{height}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Duration</span>
								<span className="font-medium">
									{(totalDuration / state.fps).toFixed(1)}s
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">FPS</span>
								<span className="font-medium">{state.fps}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Media clips</span>
								<span className="font-medium">
									{state.mediaFiles.length}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Captions</span>
								<span className="font-medium">
									{state.captions.length}
								</span>
							</div>
						</div>
					</div>

					{/* Export */}
					<div className="p-4 rounded-xl bg-editor-surface border border-editor-border">
						<h3 className="font-semibold mb-3">Export</h3>

						{exportStatus === 'idle' ? (
							<div className="space-y-3">
								<button
									onClick={handleExport}
									className="w-full py-3 rounded-xl font-semibold text-sm bg-editor-accent hover:bg-editor-accent-hover text-white transition-all"
									type="button"
								>
									Export Video
								</button>
								<p className="text-xs text-editor-muted">
									Renders to MP4 at full resolution. For local rendering, use the
									Remotion CLI command shown below.
								</p>
							</div>
						) : null}

						{exportStatus === 'preparing' ? (
							<div className="text-center py-4">
								<div className="inline-block w-8 h-8 border-2 border-editor-accent border-t-transparent rounded-full animate-spin mb-2" />
								<p className="text-sm text-editor-muted">
									Preparing export...
								</p>
							</div>
						) : null}

						{exportStatus === 'done' ? (
							<div className="space-y-3">
								<div className="p-3 rounded-lg bg-green-900/20 border border-green-600/30">
									<p className="text-sm text-green-400 font-medium mb-1">
										{'\u2713'} Ready to render!
									</p>
									<p className="text-xs text-editor-muted">
										Use the Remotion CLI to render at full quality:
									</p>
								</div>
								<div className="p-3 rounded-lg bg-editor-border font-mono text-xs text-editor-text overflow-x-auto">
									<code>
										bunx remotion render VideoEditor --output out/video.mp4
									</code>
								</div>
								<button
									onClick={() => setExportStatus('idle')}
									className="w-full py-2 rounded-lg text-sm text-editor-muted hover:text-editor-text bg-editor-border hover:bg-editor-border/80 transition-all"
									type="button"
								>
									Reset
								</button>
							</div>
						) : null}
					</div>

					{/* Style summary */}
					<div className="p-4 rounded-xl bg-editor-surface border border-editor-border">
						<h3 className="font-semibold mb-3">Style</h3>
						<div className="space-y-2 text-sm">
							<div className="flex justify-between items-center">
								<span className="text-editor-muted">Font</span>
								<span
									className="font-medium"
									style={{fontFamily: state.customization.fontFamily}}
								>
									{state.customization.fontFamily}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-editor-muted">Accent</span>
								<div className="flex items-center gap-2">
									<div
										className="w-4 h-4 rounded"
										style={{
											backgroundColor: state.customization.accentColor,
										}}
									/>
									<span className="font-mono text-xs">
										{state.customization.accentColor}
									</span>
								</div>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Animation</span>
								<span className="font-medium">
									{state.customization.animationStyle}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-editor-muted">Transition</span>
								<span className="font-medium">
									{state.customization.transitionEffect}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="mt-8 flex justify-between">
				<button
					onClick={onPrev}
					className="px-6 py-3 rounded-xl font-semibold text-sm bg-editor-border text-editor-text hover:bg-editor-border/80 transition-all"
					type="button"
				>
					Back to Edit
				</button>
			</div>
		</div>
	);
};
