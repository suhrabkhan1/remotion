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
	AnimatedCaption,
	BRollPlayer,
	CallToAction,
	GradientOverlay,
	ProgressBar,
	bRollClipSchema,
} from '../shared';

// ─── Schema ──────────────────────────────────────────────────────
// Template 1: Hook → Tutorial → CTA
// Inspired by tech/AI tutorial reels with bold hook text,
// screen recording segments, and step-by-step walkthrough.
// ──────────────────────────────────────────────────────────────────

const stepSchema = z.object({
	label: z.string(),
	description: z.string(),
	durationInFrames: z.number(),
});

export const hookTutorialSchema = z.object({
	hookText: z.string().describe('Bold opening hook line'),
	hookSubtext: z.string().optional().describe('Secondary hook text'),
	steps: z.array(stepSchema).describe('Tutorial steps to show'),
	bRollClips: z.array(bRollClipSchema).describe('Background video/image clips'),
	ctaText: z.string().describe('Call to action text'),
	ctaSubtext: z.string().optional(),
	accentColor: z.string().describe('Primary accent color'),
	hookDurationInFrames: z.number().describe('Duration of hook section'),
	ctaDurationInFrames: z.number().describe('Duration of CTA section'),
});

type Props = z.infer<typeof hookTutorialSchema>;

const StepIndicator: React.FC<{
	readonly stepNumber: number;
	readonly totalSteps: number;
	readonly label: string;
	readonly description: string;
	readonly accentColor: string;
}> = ({stepNumber, totalSteps, label, description, accentColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const slideIn = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.5, stiffness: 180},
	});

	const labelEntrance = spring({
		frame: Math.max(0, frame - 8),
		fps,
		config: {damping: 14, mass: 0.4, stiffness: 200},
	});

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 280,
				left: 40,
				right: 40,
				opacity: interpolate(slideIn, [0, 1], [0, 1]),
				transform: `translateX(${interpolate(slideIn, [0, 1], [-60, 0])}px)`,
			}}
		>
			<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
				<div
					style={{
						width: 64,
						height: 64,
						borderRadius: 32,
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
					{stepNumber}
				</div>
				<div
					style={{
						fontSize: 20,
						fontFamily: 'Inter, Arial, sans-serif',
						color: 'rgba(255,255,255,0.6)',
					}}
				>
					Step {stepNumber} of {totalSteps}
				</div>
			</div>
			<div
				style={{
					marginTop: 16,
					opacity: interpolate(labelEntrance, [0, 1], [0, 1]),
					transform: `translateY(${interpolate(labelEntrance, [0, 1], [20, 0])}px)`,
				}}
			>
				<div
					style={{
						fontSize: 42,
						fontWeight: 800,
						fontFamily: 'Inter, Arial, sans-serif',
						color: '#FFFFFF',
						lineHeight: 1.2,
					}}
				>
					{label}
				</div>
				<div
					style={{
						fontSize: 28,
						fontFamily: 'Inter, Arial, sans-serif',
						color: 'rgba(255,255,255,0.75)',
						marginTop: 8,
						lineHeight: 1.4,
					}}
				>
					{description}
				</div>
			</div>
		</div>
	);
};

export const HookTutorialReel: React.FC<Props> = ({
	hookText,
	hookSubtext,
	steps,
	bRollClips,
	ctaText,
	ctaSubtext,
	accentColor,
	hookDurationInFrames,
	ctaDurationInFrames,
}) => {
	let currentFrame = 0;

	const hookStart = currentFrame;
	currentFrame += hookDurationInFrames;

	const stepFrames = steps.map((step) => {
		const start = currentFrame;
		currentFrame += step.durationInFrames;
		return {start, ...step};
	});

	const ctaStart = currentFrame;

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* Background B-Roll */}
			<BRollPlayer clips={bRollClips} dimOverlay={0.4} />

			{/* Progress Bar */}
			<ProgressBar color={accentColor} />

			{/* Gradient Overlays */}
			<GradientOverlay direction="both" opacity={0.6} />

			{/* HOOK Section */}
			<Sequence from={hookStart} durationInFrames={hookDurationInFrames}>
				<AnimatedCaption
					text={hookText}
					fontSize={56}
					position="center"
					style="bold"
				/>
				{hookSubtext ? (
					<Sequence from={15}>
						<AnimatedCaption
							text={hookSubtext}
							fontSize={32}
							position="bottom"
							style="boxed"
						/>
					</Sequence>
				) : null}
			</Sequence>

			{/* TUTORIAL Steps */}
			{stepFrames.map((step, i) => (
				<Sequence
					key={step.label}
					from={step.start}
					durationInFrames={step.durationInFrames}
				>
					<StepIndicator
						stepNumber={i + 1}
						totalSteps={steps.length}
						label={step.label}
						description={step.description}
						accentColor={accentColor}
					/>
				</Sequence>
			))}

			{/* CTA Section */}
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

export const hookTutorialDefaultProps: Props = {
	hookText: 'Stop scrolling. This AI trick\nwill blow your mind.',
	hookSubtext: 'Here is how to automate anything with Claude',
	steps: [
		{
			label: 'Open Claude',
			description: 'Head to claude.ai and start a new conversation',
			durationInFrames: 90,
		},
		{
			label: 'Write your prompt',
			description: 'Be specific about what you want to build',
			durationInFrames: 90,
		},
		{
			label: 'Iterate & refine',
			description: 'Ask follow-up questions to polish the output',
			durationInFrames: 90,
		},
	],
	bRollClips: [],
	ctaText: 'Follow for more',
	ctaSubtext: 'Comment CLAUDE to get the full guide',
	accentColor: '#6C5CE7',
	hookDurationInFrames: 75,
	ctaDurationInFrames: 75,
};
