import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	OffthreadVideo,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {
	AnimationStyle,
	CaptionEntry,
	ClosingSettings,
	CustomizationSettings,
	HighlightStyle,
	MediaFile,
	OpeningSettings,
	TransitionEffect,
} from '../hooks/useEditorStore';

export interface VideoCompositionProps {
	mediaFiles: MediaFile[];
	customization: CustomizationSettings;
	opening: OpeningSettings;
	closing: ClosingSettings;
	captions: CaptionEntry[];
}

// ─── Opening Section ─────────────────────────────────────────────

const OpeningSection: React.FC<{
	readonly settings: OpeningSettings;
	readonly customization: CustomizationSettings;
}> = ({settings, customization}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleIn = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.5, stiffness: 180},
	});

	const subtitleIn = spring({
		frame: Math.max(0, frame - 12),
		fps,
		config: {damping: 14, mass: 0.4, stiffness: 200},
	});

	const logoIn = spring({
		frame: Math.max(0, frame - 6),
		fps,
		config: {damping: 10, mass: 0.3, stiffness: 200},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: customization.backgroundColor,
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60,
			}}
		>
			{/* Decorative gradient accent */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: 6,
					background: `linear-gradient(90deg, ${customization.accentColor}, transparent)`,
				}}
			/>

			{settings.logoUrl ? (
				<div
					style={{
						marginBottom: 40,
						transform: `scale(${logoIn})`,
						opacity: logoIn,
					}}
				>
					<Img
						src={settings.logoUrl}
						style={{
							width: 120,
							height: 120,
							borderRadius: 24,
							objectFit: 'cover',
						}}
					/>
				</div>
			) : null}

			<div
				style={{
					fontSize: 56,
					fontWeight: 900,
					fontFamily: `${customization.fontFamily}, sans-serif`,
					color: customization.textColor,
					textAlign: 'center',
					lineHeight: 1.2,
					opacity: titleIn,
					transform: `translateY(${interpolate(titleIn, [0, 1], [40, 0])}px)`,
				}}
			>
				{settings.title}
			</div>

			{settings.subtitle ? (
				<div
					style={{
						fontSize: 32,
						fontWeight: 500,
						fontFamily: `${customization.fontFamily}, sans-serif`,
						color: customization.accentColor,
						textAlign: 'center',
						marginTop: 20,
						opacity: subtitleIn,
						transform: `translateY(${interpolate(subtitleIn, [0, 1], [20, 0])}px)`,
					}}
				>
					{settings.subtitle}
				</div>
			) : null}
		</AbsoluteFill>
	);
};

// ─── Closing Section ─────────────────────────────────────────────

const ClosingSection: React.FC<{
	readonly settings: ClosingSettings;
	readonly customization: CustomizationSettings;
}> = ({settings, customization}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 10, mass: 0.4, stiffness: 180},
	});

	const pulse = 1 + Math.sin(frame * 0.12) * 0.025;

	return (
		<AbsoluteFill
			style={{
				backgroundColor: customization.backgroundColor,
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60,
			}}
		>
			{/* CTA Button */}
			<div
				style={{
					opacity: entrance,
					transform: `scale(${entrance * pulse})`,
					textAlign: 'center',
				}}
			>
				<div
					style={{
						backgroundColor: customization.accentColor,
						color: '#FFFFFF',
						fontSize: 40,
						fontWeight: 800,
						fontFamily: `${customization.fontFamily}, sans-serif`,
						padding: '24px 56px',
						borderRadius: 50,
						display: 'inline-block',
					}}
				>
					{settings.ctaText}
				</div>

				{settings.ctaSubtext ? (
					<div
						style={{
							fontSize: 28,
							fontFamily: `${customization.fontFamily}, sans-serif`,
							color: 'rgba(255,255,255,0.7)',
							marginTop: 24,
						}}
					>
						{settings.ctaSubtext}
					</div>
				) : null}

				{settings.handle ? (
					<div
						style={{
							fontSize: 32,
							fontWeight: 700,
							fontFamily: `${customization.fontFamily}, sans-serif`,
							color: customization.accentColor,
							marginTop: 32,
						}}
					>
						{settings.handle}
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};

// ─── Media Clip with transition ──────────────────────────────────

const MediaClip: React.FC<{
	readonly file: MediaFile;
	readonly transition: TransitionEffect;
	readonly dimOverlay: number;
}> = ({file, transition, dimOverlay}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.5, stiffness: 180},
	});

	const exitStart = durationInFrames - 8;
	const exitProgress =
		frame > exitStart
			? interpolate(frame, [exitStart, durationInFrames], [0, 1], {
					extrapolateRight: 'clamp',
				})
			: 0;

	const getStyle = (): React.CSSProperties => {
		switch (transition) {
			case 'slide':
				return {
					transform: `translateX(${interpolate(entrance, [0, 1], [100, 0])}%)`,
				};
			case 'zoom':
				return {
					transform: `scale(${interpolate(entrance, [0, 1], [1.3, 1])})`,
					opacity: entrance,
				};
			case 'wipe':
				return {
					clipPath: `inset(0 ${interpolate(entrance, [0, 1], [100, 0])}% 0 0)`,
				};
			case 'crossfade':
				return {opacity: entrance * (1 - exitProgress)};
			case 'cut':
			default:
				return {};
		}
	};

	// Ken Burns for images
	const kenBurnsScale =
		file.type === 'image'
			? interpolate(frame, [0, durationInFrames], [1, 1.12], {
					extrapolateRight: 'clamp',
				})
			: 1;

	return (
		<AbsoluteFill style={getStyle()}>
			{file.type === 'video' ? (
				<OffthreadVideo
					src={file.url}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
					}}
				/>
			) : (
				<Img
					src={file.url}
					style={{
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						transform: `scale(${kenBurnsScale})`,
					}}
				/>
			)}
			{dimOverlay > 0 ? (
				<AbsoluteFill
					style={{backgroundColor: `rgba(0,0,0,${dimOverlay})`}}
				/>
			) : null}
		</AbsoluteFill>
	);
};

// ─── Caption Overlay ─────────────────────────────────────────────

const CaptionOverlay: React.FC<{
	readonly text: string;
	readonly customization: CustomizationSettings;
}> = ({text, customization}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.4, stiffness: 200},
	});

	const positionStyles: React.CSSProperties =
		customization.captionPosition === 'top'
			? {top: 120}
			: customization.captionPosition === 'center'
				? {top: '50%', marginTop: -40}
				: {bottom: 200};

	const getHighlightStyle = (
		style: HighlightStyle,
	): React.CSSProperties => {
		switch (style) {
			case 'underline':
				return {
					borderBottom: `4px solid ${customization.accentColor}`,
					paddingBottom: 4,
				};
			case 'boxed':
				return {
					backgroundColor: 'rgba(0,0,0,0.75)',
					padding: '12px 24px',
					borderRadius: 8,
				};
			case 'glow':
				return {
					textShadow: `0 0 20px ${customization.accentColor}, 0 0 40px ${customization.accentColor}66`,
				};
			case 'gradient':
				return {
					background: `linear-gradient(90deg, ${customization.accentColor}, #FF6348)`,
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
				};
			default:
				return {};
		}
	};

	const words = text.split(' ');

	const animateWord = (word: string, i: number) => {
		const delay = i * 3;
		const animStyle = customization.animationStyle;

		if (animStyle === 'typewriter') {
			const visible = frame >= delay;
			return (
				<span
					key={`${word}-${i}`}
					style={{
						display: 'inline-block',
						marginRight: 10,
						opacity: visible ? 1 : 0,
					}}
				>
					{word}
				</span>
			);
		}

		const wordSpring = spring({
			frame: Math.max(0, frame - delay),
			fps,
			config: {damping: 12, mass: 0.3, stiffness: 200},
		});

		const getWordTransform = () => {
			switch (animStyle) {
				case 'slide-up':
					return `translateY(${interpolate(wordSpring, [0, 1], [20, 0])}px)`;
				case 'slide-left':
					return `translateX(${interpolate(wordSpring, [0, 1], [-30, 0])}px)`;
				case 'zoom':
					return `scale(${interpolate(wordSpring, [0, 1], [0.5, 1])})`;
				case 'fade':
				case 'spring':
				default:
					return `translateY(${interpolate(wordSpring, [0, 1], [10, 0])}px)`;
			}
		};

		return (
			<span
				key={`${word}-${i}`}
				style={{
					display: 'inline-block',
					marginRight: 10,
					opacity: wordSpring,
					transform: getWordTransform(),
				}}
			>
				{word}
			</span>
		);
	};

	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				right: 40,
				textAlign: 'center',
				opacity: interpolate(entrance, [0, 1], [0, 1]),
				...positionStyles,
			}}
		>
			<div
				style={{
					fontSize: customization.captionFontSize,
					fontWeight: 700,
					fontFamily: `${customization.fontFamily}, sans-serif`,
					color: customization.textColor,
					lineHeight: 1.4,
					textShadow: '0 2px 8px rgba(0,0,0,0.8)',
					...getHighlightStyle(customization.highlightStyle),
				}}
			>
				{words.map((word, i) => animateWord(word, i))}
			</div>
		</div>
	);
};

// ─── Progress Bar ────────────────────────────────────────────────

const ProgressBar: React.FC<{
	readonly color: string;
}> = ({color}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				height: 4,
				backgroundColor: 'rgba(255,255,255,0.15)',
				zIndex: 100,
			}}
		>
			<div
				style={{
					width: `${progress}%`,
					height: '100%',
					backgroundColor: color,
					borderRadius: '0 2px 2px 0',
				}}
			/>
		</div>
	);
};

// ─── Master Composition ──────────────────────────────────────────

export const VideoComposition: React.FC<VideoCompositionProps> = ({
	mediaFiles,
	customization,
	opening,
	closing,
	captions,
}) => {
	const CLIP_DURATION = 90; // 3 seconds per clip at 30fps
	let currentFrame = 0;

	// Opening
	const openingStart = currentFrame;
	if (opening.enabled && opening.title) {
		currentFrame += opening.durationInFrames;
	}

	// Media clips timeline
	const aRolls = mediaFiles.filter((f) => f.role === 'a-roll');
	const bRolls = mediaFiles.filter((f) => f.role === 'b-roll');

	const clipTimeline = aRolls.map((file) => {
		const start = currentFrame;
		currentFrame += CLIP_DURATION;
		return {file, start, duration: CLIP_DURATION};
	});

	// Interleave b-rolls between a-rolls
	const bRollTimeline = bRolls.map((file, i) => {
		const insertAfter = Math.min(i, clipTimeline.length - 1);
		const start = clipTimeline[insertAfter]
			? clipTimeline[insertAfter].start + Math.floor(CLIP_DURATION * 0.6)
			: currentFrame;
		return {file, start, duration: Math.floor(CLIP_DURATION * 0.5)};
	});

	// Closing
	const closingStart = currentFrame;
	if (closing.enabled) {
		currentFrame += closing.durationInFrames;
	}

	return (
		<AbsoluteFill style={{backgroundColor: customization.backgroundColor}}>
			{/* Progress bar */}
			{customization.showProgressBar ? (
				<ProgressBar color={customization.accentColor} />
			) : null}

			{/* Opening */}
			{opening.enabled && opening.title ? (
				<Sequence
					from={openingStart}
					durationInFrames={opening.durationInFrames}
				>
					<OpeningSection settings={opening} customization={customization} />
				</Sequence>
			) : null}

			{/* A-Roll clips */}
			{clipTimeline.map(({file, start, duration}) => (
				<Sequence key={file.id} from={start} durationInFrames={duration}>
					<MediaClip
						file={file}
						transition={customization.transitionEffect}
						dimOverlay={customization.dimOverlay}
					/>
				</Sequence>
			))}

			{/* B-Roll overlays */}
			{bRollTimeline.map(({file, start, duration}) => (
				<Sequence key={file.id} from={start} durationInFrames={duration}>
					<MediaClip
						file={file}
						transition="crossfade"
						dimOverlay={customization.dimOverlay * 0.5}
					/>
				</Sequence>
			))}

			{/* Captions */}
			{captions.map((caption) => (
				<Sequence
					key={caption.id}
					from={caption.startFrame}
					durationInFrames={caption.durationInFrames}
				>
					<CaptionOverlay
						text={caption.text}
						customization={customization}
					/>
				</Sequence>
			))}

			{/* Closing */}
			{closing.enabled ? (
				<Sequence
					from={closingStart}
					durationInFrames={closing.durationInFrames}
				>
					<ClosingSection settings={closing} customization={customization} />
				</Sequence>
			) : null}
		</AbsoluteFill>
	);
};
