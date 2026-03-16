import React from 'react';
import type {
	AnimationStyle,
	CustomizationSettings,
	FontFamily,
	HighlightStyle,
	TransitionEffect,
} from '../hooks/useEditorStore';

const FONTS: {value: FontFamily; label: string; preview: string}[] = [
	{value: 'Inter', label: 'Inter', preview: 'Clean & Modern'},
	{value: 'Montserrat', label: 'Montserrat', preview: 'Bold & Geometric'},
	{value: 'Poppins', label: 'Poppins', preview: 'Friendly & Round'},
	{value: 'Oswald', label: 'Oswald', preview: 'Tall & Condensed'},
	{
		value: 'Playfair Display',
		label: 'Playfair Display',
		preview: 'Elegant & Serif',
	},
	{value: 'Roboto Mono', label: 'Roboto Mono', preview: 'Tech & Monospace'},
];

const ANIMATIONS: {value: AnimationStyle; label: string}[] = [
	{value: 'spring', label: 'Spring Bounce'},
	{value: 'fade', label: 'Fade In'},
	{value: 'slide-up', label: 'Slide Up'},
	{value: 'slide-left', label: 'Slide Left'},
	{value: 'zoom', label: 'Zoom In'},
	{value: 'typewriter', label: 'Typewriter'},
];

const TRANSITIONS: {value: TransitionEffect; label: string}[] = [
	{value: 'cut', label: 'Hard Cut'},
	{value: 'crossfade', label: 'Crossfade'},
	{value: 'slide', label: 'Slide'},
	{value: 'zoom', label: 'Zoom'},
	{value: 'wipe', label: 'Wipe'},
];

const HIGHLIGHTS: {value: HighlightStyle; label: string}[] = [
	{value: 'none', label: 'None'},
	{value: 'underline', label: 'Underline'},
	{value: 'boxed', label: 'Boxed'},
	{value: 'glow', label: 'Glow'},
	{value: 'gradient', label: 'Gradient'},
];

const PRESET_COLORS = [
	'#6C5CE7',
	'#E1306C',
	'#00B894',
	'#FF6348',
	'#0984E3',
	'#FDCB6E',
	'#E84393',
	'#00CEC9',
	'#FF7675',
	'#A29BFE',
];

const Section: React.FC<{
	readonly title: string;
	readonly children: React.ReactNode;
}> = ({title, children}) => (
	<div className="mb-6">
		<h3 className="text-sm font-semibold text-editor-muted uppercase tracking-wider mb-3">
			{title}
		</h3>
		{children}
	</div>
);

const OptionGrid: React.FC<{
	readonly children: React.ReactNode;
	readonly columns?: number;
}> = ({children, columns = 3}) => (
	<div
		className="grid gap-2"
		style={{gridTemplateColumns: `repeat(${columns}, 1fr)`}}
	>
		{children}
	</div>
);

const OptionButton: React.FC<{
	readonly selected: boolean;
	readonly onClick: () => void;
	readonly children: React.ReactNode;
}> = ({selected, onClick, children}) => (
	<button
		onClick={onClick}
		className={`
			px-3 py-2 rounded-lg text-sm font-medium transition-all text-center
			${
				selected
					? 'bg-editor-accent text-white'
					: 'bg-editor-border text-editor-text hover:bg-editor-border/80'
			}
		`}
		type="button"
	>
		{children}
	</button>
);

export const CustomizePanel: React.FC<{
	readonly settings: CustomizationSettings;
	readonly onChange: (updates: Partial<CustomizationSettings>) => void;
	readonly onNext: () => void;
	readonly onPrev: () => void;
}> = ({settings, onChange, onNext, onPrev}) => {
	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Customize Style</h2>
			<p className="text-editor-muted mb-8">
				Set fonts, colors, animations, and effects for your video.
			</p>

			{/* Font */}
			<Section title="Font Family">
				<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
					{FONTS.map((f) => (
						<button
							key={f.value}
							onClick={() => onChange({fontFamily: f.value})}
							className={`
								p-3 rounded-lg text-left transition-all border
								${
									settings.fontFamily === f.value
										? 'border-editor-accent bg-editor-accent/10'
										: 'border-editor-border bg-editor-surface hover:border-editor-accent/40'
								}
							`}
							type="button"
						>
							<div
								className="text-base font-bold"
								style={{fontFamily: f.value}}
							>
								{f.label}
							</div>
							<div className="text-xs text-editor-muted mt-1">{f.preview}</div>
						</button>
					))}
				</div>
			</Section>

			{/* Colors */}
			<Section title="Accent Color">
				<div className="flex flex-wrap gap-2 mb-3">
					{PRESET_COLORS.map((color) => (
						<button
							key={color}
							onClick={() => onChange({accentColor: color})}
							className={`
								w-10 h-10 rounded-lg transition-all
								${settings.accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-editor-bg scale-110' : 'hover:scale-105'}
							`}
							style={{backgroundColor: color}}
							type="button"
						/>
					))}
				</div>
				<div className="flex items-center gap-3">
					<label
						htmlFor="custom-color-input"
						className="text-sm text-editor-muted"
					>
						Custom:
					</label>
					<input
						id="custom-color-input"
						type="color"
						value={settings.accentColor}
						onChange={(e) => onChange({accentColor: e.target.value})}
						className="w-10 h-10 rounded cursor-pointer bg-transparent"
					/>
					<span className="text-sm text-editor-muted font-mono">
						{settings.accentColor}
					</span>
				</div>
			</Section>

			{/* Background Color */}
			<Section title="Background Color">
				<div className="flex items-center gap-3">
					<input
						type="color"
						value={settings.backgroundColor}
						onChange={(e) => onChange({backgroundColor: e.target.value})}
						className="w-10 h-10 rounded cursor-pointer bg-transparent"
					/>
					<span className="text-sm text-editor-muted font-mono">
						{settings.backgroundColor}
					</span>
				</div>
			</Section>

			{/* Text Animation */}
			<Section title="Text Animation">
				<OptionGrid columns={3}>
					{ANIMATIONS.map((a) => (
						<OptionButton
							key={a.value}
							selected={settings.animationStyle === a.value}
							onClick={() => onChange({animationStyle: a.value})}
						>
							{a.label}
						</OptionButton>
					))}
				</OptionGrid>
			</Section>

			{/* Transition Effect */}
			<Section title="Clip Transitions">
				<OptionGrid columns={3}>
					{TRANSITIONS.map((t) => (
						<OptionButton
							key={t.value}
							selected={settings.transitionEffect === t.value}
							onClick={() => onChange({transitionEffect: t.value})}
						>
							{t.label}
						</OptionButton>
					))}
				</OptionGrid>
			</Section>

			{/* Highlight Style */}
			<Section title="Text Highlight">
				<OptionGrid columns={3}>
					{HIGHLIGHTS.map((h) => (
						<OptionButton
							key={h.value}
							selected={settings.highlightStyle === h.value}
							onClick={() => onChange({highlightStyle: h.value})}
						>
							{h.label}
						</OptionButton>
					))}
				</OptionGrid>
			</Section>

			{/* Caption Position */}
			<Section title="Caption Position">
				<OptionGrid columns={3}>
					{(['top', 'center', 'bottom'] as const).map((pos) => (
						<OptionButton
							key={pos}
							selected={settings.captionPosition === pos}
							onClick={() => onChange({captionPosition: pos})}
						>
							{pos.charAt(0).toUpperCase() + pos.slice(1)}
						</OptionButton>
					))}
				</OptionGrid>
			</Section>

			{/* Font Size */}
			<Section title="Caption Size">
				<div className="flex items-center gap-4">
					<input
						type="range"
						min={24}
						max={64}
						value={settings.captionFontSize}
						onChange={(e) =>
							onChange({captionFontSize: Number(e.target.value)})
						}
						className="flex-1"
					/>
					<span className="text-sm font-mono text-editor-muted w-10 text-right">
						{settings.captionFontSize}px
					</span>
				</div>
			</Section>

			{/* Dim overlay */}
			<Section title="Background Dim">
				<div className="flex items-center gap-4">
					<input
						type="range"
						min={0}
						max={80}
						value={Math.round(settings.dimOverlay * 100)}
						onChange={(e) =>
							onChange({dimOverlay: Number(e.target.value) / 100})
						}
						className="flex-1"
					/>
					<span className="text-sm font-mono text-editor-muted w-10 text-right">
						{Math.round(settings.dimOverlay * 100)}%
					</span>
				</div>
			</Section>

			{/* Progress bar toggle */}
			<Section title="Options">
				<label className="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						checked={settings.showProgressBar}
						onChange={(e) =>
							onChange({showProgressBar: e.target.checked})
						}
						className="w-5 h-5 rounded accent-editor-accent"
					/>
					<span className="text-sm">Show progress bar</span>
				</label>
			</Section>

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
