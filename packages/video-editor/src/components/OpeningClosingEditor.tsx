import React from 'react';
import type {
	ClosingSettings,
	OpeningSettings,
} from '../hooks/useEditorStore';

const InputField: React.FC<{
	readonly label: string;
	readonly value: string;
	readonly onChange: (value: string) => void;
	readonly placeholder: string;
	readonly multiline?: boolean;
}> = ({label, value, onChange, placeholder, multiline}) => (
	<div className="mb-4">
		<label className="block text-sm font-medium text-editor-muted mb-1.5">
			{label}
		</label>
		{multiline ? (
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={3}
				className="w-full px-4 py-2.5 rounded-lg bg-editor-border text-editor-text placeholder:text-editor-muted/50
					border border-editor-border focus:border-editor-accent focus:outline-none transition-colors resize-none"
			/>
		) : (
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full px-4 py-2.5 rounded-lg bg-editor-border text-editor-text placeholder:text-editor-muted/50
					border border-editor-border focus:border-editor-accent focus:outline-none transition-colors"
			/>
		)}
	</div>
);

const DurationSlider: React.FC<{
	readonly label: string;
	readonly value: number;
	readonly onChange: (value: number) => void;
	readonly fps: number;
}> = ({label, value, onChange, fps}) => (
	<div className="mb-4">
		<label className="block text-sm font-medium text-editor-muted mb-1.5">
			{label}
		</label>
		<div className="flex items-center gap-4">
			<input
				type="range"
				min={30}
				max={180}
				step={15}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="flex-1"
			/>
			<span className="text-sm font-mono text-editor-muted w-16 text-right">
				{(value / fps).toFixed(1)}s
			</span>
		</div>
	</div>
);

export const OpeningClosingEditor: React.FC<{
	readonly opening: OpeningSettings;
	readonly closing: ClosingSettings;
	readonly onOpeningChange: (updates: Partial<OpeningSettings>) => void;
	readonly onClosingChange: (updates: Partial<ClosingSettings>) => void;
	readonly fps: number;
	readonly onNext: () => void;
	readonly onPrev: () => void;
}> = ({opening, closing, onOpeningChange, onClosingChange, fps, onNext, onPrev}) => {
	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Opening & Closing</h2>
			<p className="text-editor-muted mb-8">
				Configure the intro and outro sections of your video.
			</p>

			{/* Opening Section */}
			<div className="mb-8 p-6 rounded-xl bg-editor-surface border border-editor-border">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold flex items-center gap-2">
						<span className="text-xl">{'\uD83C\uDFAC'}</span> Opening / Intro
					</h3>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={opening.enabled}
							onChange={(e) =>
								onOpeningChange({enabled: e.target.checked})
							}
							className="w-5 h-5 rounded accent-editor-accent"
						/>
						<span className="text-sm">Enabled</span>
					</label>
				</div>

				{opening.enabled ? (
					<div>
						<InputField
							label="Title"
							value={opening.title}
							onChange={(title) => onOpeningChange({title})}
							placeholder="Your bold opening title..."
						/>
						<InputField
							label="Subtitle"
							value={opening.subtitle}
							onChange={(subtitle) => onOpeningChange({subtitle})}
							placeholder="Optional subtitle or tagline..."
						/>
						<InputField
							label="Logo URL"
							value={opening.logoUrl}
							onChange={(logoUrl) => onOpeningChange({logoUrl})}
							placeholder="https://... or leave empty"
						/>
						<DurationSlider
							label="Duration"
							value={opening.durationInFrames}
							onChange={(durationInFrames) =>
								onOpeningChange({durationInFrames})
							}
							fps={fps}
						/>
					</div>
				) : (
					<p className="text-sm text-editor-muted italic">
						Opening section is disabled. Enable to add an intro.
					</p>
				)}
			</div>

			{/* Closing Section */}
			<div className="mb-8 p-6 rounded-xl bg-editor-surface border border-editor-border">
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-lg font-bold flex items-center gap-2">
						<span className="text-xl">{'\uD83C\uDFAF'}</span> Closing / Outro
					</h3>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={closing.enabled}
							onChange={(e) =>
								onClosingChange({enabled: e.target.checked})
							}
							className="w-5 h-5 rounded accent-editor-accent"
						/>
						<span className="text-sm">Enabled</span>
					</label>
				</div>

				{closing.enabled ? (
					<div>
						<InputField
							label="Call to Action"
							value={closing.ctaText}
							onChange={(ctaText) => onClosingChange({ctaText})}
							placeholder="Follow for more, Save this, etc."
						/>
						<InputField
							label="Subtext"
							value={closing.ctaSubtext}
							onChange={(ctaSubtext) => onClosingChange({ctaSubtext})}
							placeholder="Comment CLAUDE to get the repo..."
						/>
						<InputField
							label="Handle / Username"
							value={closing.handle}
							onChange={(handle) => onClosingChange({handle})}
							placeholder="@yourhandle"
						/>
						<DurationSlider
							label="Duration"
							value={closing.durationInFrames}
							onChange={(durationInFrames) =>
								onClosingChange({durationInFrames})
							}
							fps={fps}
						/>
					</div>
				) : (
					<p className="text-sm text-editor-muted italic">
						Closing section is disabled. Enable to add an outro.
					</p>
				)}
			</div>

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
					Continue
				</button>
			</div>
		</div>
	);
};
