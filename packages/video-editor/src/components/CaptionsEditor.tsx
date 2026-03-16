import React, {useCallback} from 'react';
import type {CaptionEntry} from '../hooks/useEditorStore';

let captionCounter = 0;

export const CaptionsEditor: React.FC<{
	readonly captions: CaptionEntry[];
	readonly totalDuration: number;
	readonly fps: number;
	readonly onAdd: (caption: CaptionEntry) => void;
	readonly onRemove: (id: string) => void;
	readonly onUpdate: (id: string, updates: Partial<CaptionEntry>) => void;
	readonly onNext: () => void;
	readonly onPrev: () => void;
}> = ({captions, totalDuration, fps, onAdd, onRemove, onUpdate, onNext, onPrev}) => {
	const handleAdd = useCallback(() => {
		const lastCaption = captions[captions.length - 1];
		const startFrame = lastCaption
			? lastCaption.startFrame + lastCaption.durationInFrames + 10
			: 0;

		onAdd({
			id: `caption-${Date.now()}-${++captionCounter}`,
			text: '',
			startFrame: Math.min(startFrame, totalDuration - 60),
			durationInFrames: 60,
		});
	}, [captions, onAdd, totalDuration]);

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Captions & Text</h2>
			<p className="text-editor-muted mb-6">
				Add timed text overlays that appear during your video. These use
				the animation style you selected.
			</p>

			{/* Timeline indicator */}
			<div className="mb-6 p-3 rounded-lg bg-editor-surface border border-editor-border">
				<div className="flex justify-between text-xs text-editor-muted mb-2">
					<span>0s</span>
					<span>Total: {(totalDuration / fps).toFixed(1)}s</span>
				</div>
				<div className="relative h-8 bg-editor-border rounded-full overflow-hidden">
					{captions.map((c) => {
						const left = (c.startFrame / totalDuration) * 100;
						const width =
							(c.durationInFrames / totalDuration) * 100;
						return (
							<div
								key={c.id}
								className="absolute top-1 bottom-1 rounded-full bg-editor-accent/60"
								style={{left: `${left}%`, width: `${Math.max(width, 1)}%`}}
								title={c.text || 'Empty caption'}
							/>
						);
					})}
				</div>
			</div>

			{/* Caption list */}
			<div className="space-y-3 mb-6">
				{captions.map((caption, i) => (
					<div
						key={caption.id}
						className="p-4 rounded-xl bg-editor-surface border border-editor-border"
					>
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-semibold text-editor-accent">
								Caption {i + 1}
							</span>
							<button
								onClick={() => onRemove(caption.id)}
								className="text-xs px-2 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
								type="button"
							>
								Remove
							</button>
						</div>

						<textarea
							value={caption.text}
							onChange={(e) =>
								onUpdate(caption.id, {text: e.target.value})
							}
							placeholder="Enter caption text..."
							rows={2}
							className="w-full px-3 py-2 rounded-lg bg-editor-border text-editor-text placeholder:text-editor-muted/50
								border border-editor-border focus:border-editor-accent focus:outline-none transition-colors resize-none mb-3"
						/>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs text-editor-muted mb-1">
									Start ({(caption.startFrame / fps).toFixed(1)}s)
								</label>
								<input
									type="range"
									min={0}
									max={totalDuration - caption.durationInFrames}
									value={caption.startFrame}
									onChange={(e) =>
										onUpdate(caption.id, {
											startFrame: Number(e.target.value),
										})
									}
									className="w-full"
								/>
							</div>
							<div>
								<label className="block text-xs text-editor-muted mb-1">
									Duration ({(caption.durationInFrames / fps).toFixed(1)}s)
								</label>
								<input
									type="range"
									min={15}
									max={150}
									value={caption.durationInFrames}
									onChange={(e) =>
										onUpdate(caption.id, {
											durationInFrames: Number(e.target.value),
										})
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				))}

				{captions.length === 0 ? (
					<div className="text-center py-8 text-editor-muted">
						<p className="mb-2">No captions yet.</p>
						<p className="text-sm">
							Add captions to overlay animated text during your video.
						</p>
					</div>
				) : null}
			</div>

			<button
				onClick={handleAdd}
				className="w-full py-3 rounded-xl border-2 border-dashed border-editor-border text-editor-muted
					hover:border-editor-accent/50 hover:text-editor-accent transition-all text-sm font-medium"
				type="button"
			>
				+ Add Caption
			</button>

			{/* Navigation */}
			<div className="mt-8 flex justify-between">
				<button
					onClick={onPrev}
					className="px-6 py-3 rounded-xl font-semibold text-sm bg-editor-border text-editor-text hover:bg-editor-border/80 transition-all"
					type="button"
				>
					Back
				</button>
				<button
					onClick={onNext}
					className="px-8 py-3 rounded-xl font-semibold text-sm bg-editor-accent hover:bg-editor-accent-hover text-white transition-all"
					type="button"
				>
					Preview Video
				</button>
			</div>
		</div>
	);
};
