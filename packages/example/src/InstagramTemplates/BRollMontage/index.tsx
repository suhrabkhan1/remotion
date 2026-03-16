import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {
	BRollPlayer,
	CallToAction,
	GradientOverlay,
	ProgressBar,
	bRollClipSchema,
	captionStyleSchema,
} from '../shared';

// ─── Schema ──────────────────────────────────────────────────────
// Template 2: Cinematic B-Roll Montage with Voiceover Captions
// Inspired by aesthetic tech/AI reels that layer cinematic footage
// with animated subtitles/captions and a strong narrative arc.
// ──────────────────────────────────────────────────────────────────

export const bRollMontageSchema = z.object({
	title: z.string().describe('Opening title shown briefly'),
	captions: z.array(captionStyleSchema).describe('Timed caption overlays'),
	bRollClips: z.array(bRollClipSchema).describe('Background video/image clips'),
	ctaText: z.string(),
	ctaSubtext: z.string().optional(),
	accentColor: z.string(),
	showProgressBar: z.boolean(),
	titleDurationInFrames: z.number(),
	ctaDurationInFrames: z.number(),
	totalDurationInFrames: z.number(),
});

type Props = z.infer<typeof bRollMontageSchema>;

const TypewriterCaption: React.FC<{
	readonly text: string;
	readonly fontSize?: number;
}> = ({text, fontSize = 40}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const words = text.split(' ');
	const framesPerWord = 4;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 280,
				left: 48,
				right: 48,
				textAlign: 'center',
			}}
		>
			<div
				style={{
					display: 'inline',
					fontSize,
					fontWeight: 700,
					fontFamily: 'Inter, Arial, sans-serif',
					lineHeight: 1.5,
				}}
			>
				{words.map((word, i) => {
					const wordFrame = i * framesPerWord;
					const isVisible = frame >= wordFrame;
					const wordSpring = isVisible
						? spring({
								frame: frame - wordFrame,
								fps,
								config: {damping: 15, mass: 0.3, stiffness: 200},
							})
						: 0;

					const isCurrentWord =
						frame >= wordFrame && frame < wordFrame + framesPerWord * 2;

					return (
						<span
							key={`${word}-${i}`}
							style={{
								display: 'inline-block',
								marginRight: 12,
								opacity: wordSpring,
								transform: `translateY(${interpolate(wordSpring, [0, 1], [15, 0])}px)`,
								color: isCurrentWord ? '#FFFFFF' : 'rgba(255,255,255,0.8)',
								textShadow: '0 2px 8px rgba(0,0,0,0.9)',
							}}
						>
							{word}
						</span>
					);
				})}
			</div>
		</div>
	);
};

const OpeningTitle: React.FC<{
	readonly text: string;
	readonly accentColor: string;
}> = ({text, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: {damping: 10, mass: 0.4, stiffness: 150},
	});

	const lines = text.split('\n');

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					transform: `scale(${scale})`,
					textAlign: 'center',
					padding: '0 60px',
				}}
			>
				{lines.map((line, i) => (
					<div
						key={line}
						style={{
							fontSize: i === 0 ? 64 : 48,
							fontWeight: 900,
							fontFamily: 'Inter, Arial, sans-serif',
							color: i === 0 ? accentColor : '#FFFFFF',
							lineHeight: 1.3,
							textShadow: '0 4px 20px rgba(0,0,0,0.8)',
						}}
					>
						{line}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

export const BRollMontageReel: React.FC<Props> = ({
	title,
	captions,
	bRollClips,
	ctaText,
	ctaSubtext,
	accentColor,
	showProgressBar,
	titleDurationInFrames,
	ctaDurationInFrames,
	totalDurationInFrames,
}) => {
	const ctaStart = totalDurationInFrames - ctaDurationInFrames;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* B-Roll Background */}
			<BRollPlayer clips={bRollClips} dimOverlay={0.25} />

			{/* Gradient for text readability */}
			<GradientOverlay direction="both" opacity={0.5} />

			{/* Progress bar */}
			{showProgressBar ? <ProgressBar color={accentColor} /> : null}

			{/* Opening title */}
			<Sequence from={0} durationInFrames={titleDurationInFrames}>
				<OpeningTitle text={title} accentColor={accentColor} />
			</Sequence>

			{/* Animated captions */}
			{captions.map((caption) => (
				<Sequence
					key={`${caption.text}-${caption.startFrame}`}
					from={caption.startFrame}
					durationInFrames={caption.durationInFrames}
				>
					<TypewriterCaption text={caption.text} />
				</Sequence>
			))}

			{/* CTA */}
			<Sequence from={ctaStart} durationInFrames={ctaDurationInFrames}>
				<CallToAction
					text={ctaText}
					subtext={ctaSubtext}
					backgroundColor={accentColor}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};

export const bRollMontageDefaultProps: Props = {
	title: 'The Future of AI\nis Already Here',
	captions: [
		{
			text: 'AI agents are changing how we build software',
			startFrame: 60,
			durationInFrames: 75,
		},
		{
			text: 'They can write code review PRs and ship features',
			startFrame: 150,
			durationInFrames: 75,
		},
		{
			text: 'All you need is the right tools and workflow',
			startFrame: 240,
			durationInFrames: 75,
		},
	],
	bRollClips: [],
	ctaText: 'Save this for later',
	ctaSubtext: 'Share with a friend who needs this',
	accentColor: '#00B894',
	showProgressBar: true,
	titleDurationInFrames: 60,
	ctaDurationInFrames: 75,
	totalDurationInFrames: 390,
};
