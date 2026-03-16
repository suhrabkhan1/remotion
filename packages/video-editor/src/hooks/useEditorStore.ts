import {useCallback, useMemo, useState} from 'react';

export type TemplateType =
	| 'hook-tutorial'
	| 'broll-montage'
	| 'before-after'
	| 'carousel-slideshow'
	| 'quick-tips';

export interface MediaFile {
	id: string;
	name: string;
	url: string;
	type: 'video' | 'image';
	role: 'a-roll' | 'b-roll';
	durationMs?: number;
	thumbnail?: string;
}

export type FontFamily =
	| 'Inter'
	| 'Montserrat'
	| 'Poppins'
	| 'Oswald'
	| 'Playfair Display'
	| 'Roboto Mono';

export type AnimationStyle =
	| 'spring'
	| 'fade'
	| 'slide-up'
	| 'slide-left'
	| 'zoom'
	| 'typewriter';

export type TransitionEffect =
	| 'cut'
	| 'crossfade'
	| 'slide'
	| 'zoom'
	| 'wipe';

export type HighlightStyle =
	| 'none'
	| 'underline'
	| 'boxed'
	| 'glow'
	| 'gradient';

export interface CustomizationSettings {
	fontFamily: FontFamily;
	accentColor: string;
	backgroundColor: string;
	textColor: string;
	animationStyle: AnimationStyle;
	transitionEffect: TransitionEffect;
	highlightStyle: HighlightStyle;
	showProgressBar: boolean;
	captionPosition: 'top' | 'center' | 'bottom';
	captionFontSize: number;
	dimOverlay: number;
}

export interface OpeningSettings {
	enabled: boolean;
	title: string;
	subtitle: string;
	logoUrl: string;
	durationInFrames: number;
}

export interface ClosingSettings {
	enabled: boolean;
	ctaText: string;
	ctaSubtext: string;
	handle: string;
	durationInFrames: number;
}

export interface CaptionEntry {
	id: string;
	text: string;
	startFrame: number;
	durationInFrames: number;
}

export type EditorStep =
	| 'template'
	| 'upload'
	| 'customize'
	| 'opening-closing'
	| 'captions'
	| 'preview';

export interface EditorState {
	step: EditorStep;
	template: TemplateType | null;
	mediaFiles: MediaFile[];
	customization: CustomizationSettings;
	opening: OpeningSettings;
	closing: ClosingSettings;
	captions: CaptionEntry[];
	fps: number;
	format: 'reel' | 'post';
}

const STEPS: EditorStep[] = [
	'template',
	'upload',
	'customize',
	'opening-closing',
	'captions',
	'preview',
];

const defaultCustomization: CustomizationSettings = {
	fontFamily: 'Inter',
	accentColor: '#6C5CE7',
	backgroundColor: '#111111',
	textColor: '#FFFFFF',
	animationStyle: 'spring',
	transitionEffect: 'crossfade',
	highlightStyle: 'none',
	showProgressBar: true,
	captionPosition: 'bottom',
	captionFontSize: 40,
	dimOverlay: 0.35,
};

const defaultOpening: OpeningSettings = {
	enabled: true,
	title: '',
	subtitle: '',
	logoUrl: '',
	durationInFrames: 60,
};

const defaultClosing: ClosingSettings = {
	enabled: true,
	ctaText: 'Follow for more',
	ctaSubtext: '',
	handle: '@suhrabkhan',
	durationInFrames: 75,
};

const initialState: EditorState = {
	step: 'template',
	template: null,
	mediaFiles: [],
	customization: defaultCustomization,
	opening: defaultOpening,
	closing: defaultClosing,
	captions: [],
	fps: 30,
	format: 'reel',
};

export function useEditorStore() {
	const [state, setState] = useState<EditorState>(initialState);

	const setStep = useCallback((step: EditorStep) => {
		setState((prev) => ({...prev, step}));
	}, []);

	const nextStep = useCallback(() => {
		setState((prev) => {
			const idx = STEPS.indexOf(prev.step);
			if (idx < STEPS.length - 1) {
				return {...prev, step: STEPS[idx + 1]};
			}
			return prev;
		});
	}, []);

	const prevStep = useCallback(() => {
		setState((prev) => {
			const idx = STEPS.indexOf(prev.step);
			if (idx > 0) {
				return {...prev, step: STEPS[idx - 1]};
			}
			return prev;
		});
	}, []);

	const setTemplate = useCallback((template: TemplateType) => {
		setState((prev) => ({
			...prev,
			template,
			format:
				template === 'carousel-slideshow' ? 'post' : 'reel',
		}));
	}, []);

	const addMediaFile = useCallback((file: MediaFile) => {
		setState((prev) => ({
			...prev,
			mediaFiles: [...prev.mediaFiles, file],
		}));
	}, []);

	const removeMediaFile = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			mediaFiles: prev.mediaFiles.filter((f) => f.id !== id),
		}));
	}, []);

	const updateMediaRole = useCallback(
		(id: string, role: 'a-roll' | 'b-roll') => {
			setState((prev) => ({
				...prev,
				mediaFiles: prev.mediaFiles.map((f) =>
					f.id === id ? {...f, role} : f,
				),
			}));
		},
		[],
	);

	const setCustomization = useCallback(
		(updates: Partial<CustomizationSettings>) => {
			setState((prev) => ({
				...prev,
				customization: {...prev.customization, ...updates},
			}));
		},
		[],
	);

	const setOpening = useCallback((updates: Partial<OpeningSettings>) => {
		setState((prev) => ({
			...prev,
			opening: {...prev.opening, ...updates},
		}));
	}, []);

	const setClosing = useCallback((updates: Partial<ClosingSettings>) => {
		setState((prev) => ({
			...prev,
			closing: {...prev.closing, ...updates},
		}));
	}, []);

	const addCaption = useCallback((caption: CaptionEntry) => {
		setState((prev) => ({
			...prev,
			captions: [...prev.captions, caption],
		}));
	}, []);

	const removeCaption = useCallback((id: string) => {
		setState((prev) => ({
			...prev,
			captions: prev.captions.filter((c) => c.id !== id),
		}));
	}, []);

	const updateCaption = useCallback(
		(id: string, updates: Partial<CaptionEntry>) => {
			setState((prev) => ({
				...prev,
				captions: prev.captions.map((c) =>
					c.id === id ? {...c, ...updates} : c,
				),
			}));
		},
		[],
	);

	const stepIndex = STEPS.indexOf(state.step);

	const aRolls = useMemo(
		() => state.mediaFiles.filter((f) => f.role === 'a-roll'),
		[state.mediaFiles],
	);
	const bRolls = useMemo(
		() => state.mediaFiles.filter((f) => f.role === 'b-roll'),
		[state.mediaFiles],
	);

	const totalDuration = useMemo(() => {
		let frames = 0;
		if (state.opening.enabled) frames += state.opening.durationInFrames;
		// Estimate 3 seconds per media file if no duration set
		frames += state.mediaFiles.length * 90;
		if (state.closing.enabled) frames += state.closing.durationInFrames;
		return Math.max(frames, 150);
	}, [state.mediaFiles, state.opening, state.closing]);

	return {
		state,
		stepIndex,
		totalSteps: STEPS.length,
		steps: STEPS,
		aRolls,
		bRolls,
		totalDuration,
		setStep,
		nextStep,
		prevStep,
		setTemplate,
		addMediaFile,
		removeMediaFile,
		updateMediaRole,
		setCustomization,
		setOpening,
		setClosing,
		addCaption,
		removeCaption,
		updateCaption,
	};
}

export type EditorStore = ReturnType<typeof useEditorStore>;
