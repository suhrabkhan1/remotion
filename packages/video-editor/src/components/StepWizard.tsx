import React from 'react';
import type {EditorStep} from '../hooks/useEditorStore';

const STEP_LABELS: Record<EditorStep, string> = {
	template: 'Template',
	upload: 'Media',
	customize: 'Style',
	'opening-closing': 'Intro/Outro',
	captions: 'Captions',
	preview: 'Preview',
};

const STEP_ICONS: Record<EditorStep, string> = {
	template: '1',
	upload: '2',
	customize: '3',
	'opening-closing': '4',
	captions: '5',
	preview: '6',
};

export const StepWizard: React.FC<{
	readonly currentStep: EditorStep;
	readonly stepIndex: number;
	readonly steps: EditorStep[];
	readonly onStepClick: (step: EditorStep) => void;
}> = ({currentStep, stepIndex, steps, onStepClick}) => {
	return (
		<div className="flex items-center gap-1 px-6 py-4 bg-editor-surface border-b border-editor-border overflow-x-auto">
			{steps.map((step, i) => {
				const isActive = step === currentStep;
				const isCompleted = i < stepIndex;
				const isClickable = i <= stepIndex;

				return (
					<React.Fragment key={step}>
						<button
							onClick={() => isClickable && onStepClick(step)}
							className={`
								flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
								transition-all duration-200 whitespace-nowrap
								${isActive ? 'bg-editor-accent text-white' : ''}
								${isCompleted ? 'bg-editor-accent/20 text-editor-accent cursor-pointer' : ''}
								${!isActive && !isCompleted ? 'text-editor-muted' : ''}
								${isClickable && !isActive ? 'hover:bg-editor-border cursor-pointer' : ''}
								${!isClickable ? 'cursor-default opacity-50' : ''}
							`}
							type="button"
						>
							<span
								className={`
								w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
								${isActive ? 'bg-white/20' : ''}
								${isCompleted ? 'bg-editor-accent text-white' : 'bg-editor-border'}
							`}
							>
								{isCompleted ? '\u2713' : STEP_ICONS[step]}
							</span>
							{STEP_LABELS[step]}
						</button>
						{i < steps.length - 1 ? (
							<div
								className={`w-8 h-0.5 flex-shrink-0 ${
									i < stepIndex ? 'bg-editor-accent' : 'bg-editor-border'
								}`}
							/>
						) : null}
					</React.Fragment>
				);
			})}
		</div>
	);
};
