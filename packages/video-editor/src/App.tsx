import React from 'react';
import {CaptionsEditor} from './components/CaptionsEditor';
import {CustomizePanel} from './components/CustomizePanel';
import {MediaUpload} from './components/MediaUpload';
import {OpeningClosingEditor} from './components/OpeningClosingEditor';
import {PreviewExport} from './components/PreviewExport';
import {StepWizard} from './components/StepWizard';
import {TemplateSelect} from './components/TemplateSelect';
import {useEditorStore} from './hooks/useEditorStore';

export const App: React.FC = () => {
	const store = useEditorStore();
	const {state} = store;

	return (
		<div className="min-h-screen bg-editor-bg text-editor-text flex flex-col">
			{/* Header */}
			<header className="px-6 py-4 border-b border-editor-border flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-editor-accent flex items-center justify-center text-white font-bold text-sm">
						R
					</div>
					<h1 className="text-lg font-bold">Remotion Video Editor</h1>
				</div>
				<div className="text-sm text-editor-muted">
					{state.template ? (
						<span className="px-2 py-1 rounded bg-editor-surface text-editor-accent text-xs font-medium">
							{state.template}
						</span>
					) : null}
				</div>
			</header>

			{/* Step Wizard */}
			<StepWizard
				currentStep={state.step}
				stepIndex={store.stepIndex}
				steps={store.steps}
				onStepClick={store.setStep}
			/>

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto">
				{state.step === 'template' ? (
					<TemplateSelect
						selected={state.template}
						onSelect={store.setTemplate}
						onNext={store.nextStep}
					/>
				) : null}

				{state.step === 'upload' ? (
					<MediaUpload
						mediaFiles={state.mediaFiles}
						onAddMedia={store.addMediaFile}
						onRemoveMedia={store.removeMediaFile}
						onUpdateRole={store.updateMediaRole}
						onNext={store.nextStep}
						onPrev={store.prevStep}
					/>
				) : null}

				{state.step === 'customize' ? (
					<CustomizePanel
						settings={state.customization}
						onChange={store.setCustomization}
						onNext={store.nextStep}
						onPrev={store.prevStep}
					/>
				) : null}

				{state.step === 'opening-closing' ? (
					<OpeningClosingEditor
						opening={state.opening}
						closing={state.closing}
						onOpeningChange={store.setOpening}
						onClosingChange={store.setClosing}
						fps={state.fps}
						onNext={store.nextStep}
						onPrev={store.prevStep}
					/>
				) : null}

				{state.step === 'captions' ? (
					<CaptionsEditor
						captions={state.captions}
						totalDuration={store.totalDuration}
						fps={state.fps}
						onAdd={store.addCaption}
						onRemove={store.removeCaption}
						onUpdate={store.updateCaption}
						onNext={store.nextStep}
						onPrev={store.prevStep}
					/>
				) : null}

				{state.step === 'preview' ? (
					<PreviewExport
						state={state}
						totalDuration={store.totalDuration}
						onPrev={store.prevStep}
					/>
				) : null}
			</main>

			{/* Footer */}
			<footer className="px-6 py-3 border-t border-editor-border text-xs text-editor-muted text-center">
				Built with Remotion &middot; Upload media, customize style, preview and
				export
			</footer>
		</div>
	);
};
