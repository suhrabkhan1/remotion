import React from 'react';
import type {TemplateType} from '../hooks/useEditorStore';

interface TemplateInfo {
	id: TemplateType;
	name: string;
	description: string;
	icon: string;
	tags: string[];
	format: string;
}

const TEMPLATES: TemplateInfo[] = [
	{
		id: 'hook-tutorial',
		name: 'Hook + Tutorial',
		description:
			'Bold opening hook followed by step-by-step tutorial walkthrough with numbered steps and CTA.',
		icon: '\uD83C\uDFA3',
		tags: ['Tutorial', 'How-to', 'Educational'],
		format: '9:16 Reel',
	},
	{
		id: 'broll-montage',
		name: 'B-Roll Montage',
		description:
			'Cinematic footage with animated typewriter captions. Perfect for storytelling and narrative content.',
		icon: '\uD83C\uDFAC',
		tags: ['Cinematic', 'Storytelling', 'Aesthetic'],
		format: '9:16 Reel',
	},
	{
		id: 'before-after',
		name: 'Before / After',
		description:
			'Problem-solution format with dramatic reveal transition. Great for showing transformations.',
		icon: '\u26A1',
		tags: ['Comparison', 'Demo', 'Transformation'],
		format: '9:16 Reel',
	},
	{
		id: 'carousel-slideshow',
		name: 'Carousel Slideshow',
		description:
			'Multi-slide post with swipe transitions and numbered indicators. Perfect for listicles.',
		icon: '\uD83D\uDCDA',
		tags: ['Listicle', 'Tips', 'Carousel'],
		format: '1:1 Post',
	},
	{
		id: 'quick-tips',
		name: 'Quick Tips Listicle',
		description:
			'Fast-paced numbered tips with zoom-slam numbers and quick cuts. High energy format.',
		icon: '\uD83D\uDD25',
		tags: ['Tips', 'Fast-paced', 'Engaging'],
		format: '9:16 Reel',
	},
];

export const TemplateSelect: React.FC<{
	readonly selected: TemplateType | null;
	readonly onSelect: (template: TemplateType) => void;
	readonly onNext: () => void;
}> = ({selected, onSelect, onNext}) => {
	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Choose a Template</h2>
			<p className="text-editor-muted mb-8">
				Select a video style based on the type of content you want to create.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{TEMPLATES.map((t) => (
					<button
						key={t.id}
						onClick={() => onSelect(t.id)}
						className={`
							text-left p-5 rounded-xl border-2 transition-all duration-200
							${
								selected === t.id
									? 'border-editor-accent bg-editor-accent/10 shadow-lg shadow-editor-accent/10'
									: 'border-editor-border bg-editor-surface hover:border-editor-accent/40 hover:bg-editor-surface/80'
							}
						`}
						type="button"
					>
						<div className="flex items-start justify-between mb-3">
							<span className="text-3xl">{t.icon}</span>
							<span className="text-xs font-medium px-2 py-1 rounded-full bg-editor-border text-editor-muted">
								{t.format}
							</span>
						</div>
						<h3 className="text-lg font-bold mb-2">{t.name}</h3>
						<p className="text-sm text-editor-muted leading-relaxed mb-3">
							{t.description}
						</p>
						<div className="flex flex-wrap gap-1.5">
							{t.tags.map((tag) => (
								<span
									key={tag}
									className="text-xs px-2 py-0.5 rounded bg-editor-border text-editor-muted"
								>
									{tag}
								</span>
							))}
						</div>
					</button>
				))}
			</div>

			<div className="mt-8 flex justify-end">
				<button
					onClick={onNext}
					disabled={!selected}
					className={`
						px-8 py-3 rounded-xl font-semibold text-sm transition-all
						${
							selected
								? 'bg-editor-accent hover:bg-editor-accent-hover text-white'
								: 'bg-editor-border text-editor-muted cursor-not-allowed'
						}
					`}
					type="button"
				>
					Continue
				</button>
			</div>
		</div>
	);
};
