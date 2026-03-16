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
	tipSchema,
} from '../shared';

// ─── Schema ──────────────────────────────────────────────────────
// Template 5: Quick Tips Listicle Reel
// Inspired by fast-paced, number-counted tips reels with
// zoom cuts, bold numbers, and quick transitions. Great for
// "5 things you didn't know about..." style content.
// ──────────────────────────────────────────────────────────────────

export const quickTipsSchema = z.object({
	title: z.string().describe('Opening title (e.g. "5 AI Hacks")'),
	tips: z.array(tipSchema).describe('Tips to show'),
	bRollClips: z.array(bRollClipSchema).describe('Background footage'),
	ctaText: z.string(),
	ctaSubtext: z.string().optional(),
	accentColor: z.string(),
	titleDurationInFrames: z.number(),
	framesPerTip: z.number(),
	ctaDurationInFrames: z.number(),
});

type Props = z.infer<typeof quickTipsSchema>;

const NumberReveal: React.FC<{
	readonly number: number;
	readonly accentColor: string;
}> = ({number, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const slam = spring({
		frame,
		fps,
		config: {damping: 6, mass: 0.8, stiffness: 300},
	});

	const shake =
		frame < 10 ? Math.sin(frame * 3) * interpolate(frame, [0, 10], [8, 0]) : 0;

	return (
		<div
			style={{
				fontSize: 200,
				fontWeight: 900,
				fontFamily: 'Inter, Arial, sans-serif',
				color: accentColor,
				textShadow: `0 0 60px ${accentColor}66, 0 8px 30px rgba(0,0,0,0.5)`,
				transform: `scale(${slam}) translateX(${shake}px)`,
				textAlign: 'center',
				lineHeight: 1,
			}}
		>
			{number}
		</div>
	);
};

const TipCard: React.FC<{
	readonly number: number;
	readonly title: string;
	readonly description: string;
	readonly accentColor: string;
}> = ({number, title, description, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const numberDuration = 20;
	const showContent = frame >= numberDuration;

	const contentEntrance = showContent
		? spring({
				frame: frame - numberDuration,
				fps,
				config: {damping: 12, mass: 0.5, stiffness: 180},
			})
		: 0;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 48,
			}}
		>
			{/* Big number flash */}
			{!showContent ? (
				<NumberReveal number={number} accentColor={accentColor} />
			) : null}

			{/* Tip content */}
			{showContent ? (
				<div
					style={{
						opacity: contentEntrance,
						transform: `translateY(${interpolate(contentEntrance, [0, 1], [40, 0])}px)`,
						textAlign: 'center',
					}}
				>
					{/* Small number badge */}
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 16,
							marginBottom: 28,
						}}
					>
						<div
							style={{
								width: 56,
								height: 56,
								borderRadius: 28,
								backgroundColor: accentColor,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 28,
								fontWeight: 900,
								fontFamily: 'Inter, Arial, sans-serif',
								color: '#FFF',
								flexShrink: 0,
							}}
						>
							{number}
						</div>
						<div
							style={{
								height: 3,
								width: 60,
								backgroundColor: accentColor,
								borderRadius: 2,
							}}
						/>
					</div>

					<div
						style={{
							fontSize: 48,
							fontWeight: 900,
							fontFamily: 'Inter, Arial, sans-serif',
							color: '#FFFFFF',
							lineHeight: 1.2,
							marginBottom: 20,
							textShadow: '0 4px 16px rgba(0,0,0,0.6)',
						}}
					>
						{title}
					</div>

					<div
						style={{
							fontSize: 30,
							fontFamily: 'Inter, Arial, sans-serif',
							color: 'rgba(255,255,255,0.8)',
							lineHeight: 1.5,
							textShadow: '0 2px 8px rgba(0,0,0,0.5)',
						}}
					>
						{description}
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

const TitleSlide: React.FC<{
	readonly text: string;
	readonly accentColor: string;
}> = ({text, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: {damping: 8, mass: 0.4, stiffness: 200},
	});

	const pulse = 1 + Math.sin(frame * 0.1) * 0.02;

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div
				style={{
					fontSize: 64,
					fontWeight: 900,
					fontFamily: 'Inter, Arial, sans-serif',
					color: '#FFFFFF',
					textAlign: 'center',
					padding: '0 60px',
					lineHeight: 1.3,
					textShadow: `0 0 40px ${accentColor}44, 0 4px 16px rgba(0,0,0,0.6)`,
					transform: `scale(${scale * pulse})`,
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

export const QuickTipsListicleReel: React.FC<Props> = ({
	title,
	tips,
	bRollClips,
	ctaText,
	ctaSubtext,
	accentColor,
	titleDurationInFrames,
	framesPerTip,
	ctaDurationInFrames,
}) => {
	let currentFrame = 0;

	const titleStart = currentFrame;
	currentFrame += titleDurationInFrames;

	const tipFrames = tips.map((tip) => {
		const start = currentFrame;
		currentFrame += framesPerTip;
		return {start, ...tip};
	});

	const ctaStart = currentFrame;

	return (
		<AbsoluteFill style={{backgroundColor: '#111'}}>
			{/* B-Roll Background */}
			<BRollPlayer clips={bRollClips} dimOverlay={0.5} />
			<GradientOverlay direction="both" opacity={0.5} />

			{/* Progress */}
			<ProgressBar color={accentColor} />

			{/* Title */}
			<Sequence from={titleStart} durationInFrames={titleDurationInFrames}>
				<TitleSlide text={title} accentColor={accentColor} />
			</Sequence>

			{/* Tips */}
			{tipFrames.map((tip) => (
				<Sequence
					key={`tip-${tip.number}`}
					from={tip.start}
					durationInFrames={framesPerTip}
				>
					<TipCard
						number={tip.number}
						title={tip.title}
						description={tip.description}
						accentColor={accentColor}
					/>
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

export const quickTipsDefaultProps: Props = {
	title: '5 AI Hacks You Need\nto Know Right Now',
	tips: [
		{
			number: 1,
			title: 'Use Claude for Code Reviews',
			description: 'Paste your PR diff and get instant feedback on bugs and style',
		},
		{
			number: 2,
			title: 'Automate with n8n + AI',
			description: 'Connect any API to AI agents for hands-free workflows',
		},
		{
			number: 3,
			title: 'Voice-to-App in Minutes',
			description: 'Describe your app idea by voice and let AI build the MVP',
		},
		{
			number: 4,
			title: 'AI-Powered Video Editing',
			description: 'Use Remotion to programmatically generate social videos',
		},
		{
			number: 5,
			title: 'Smart Prompt Chaining',
			description: 'Break complex tasks into smaller prompts for better results',
		},
	],
	bRollClips: [],
	ctaText: 'Follow for daily tips',
	ctaSubtext: 'Save this reel!',
	accentColor: '#FF6348',
	titleDurationInFrames: 60,
	framesPerTip: 75,
	ctaDurationInFrames: 60,
};
