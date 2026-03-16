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
	CallToAction,
	GradientOverlay,
	ProgressBar,
	bRollClipSchema,
} from '../shared';

// ─── Schema ──────────────────────────────────────────────────────
// Template 3: Before/After Demo
// Inspired by problem → solution reels with split-screen reveal,
// showing the "old way" vs the "new way" of doing something.
// ──────────────────────────────────────────────────────────────────

export const beforeAfterSchema = z.object({
	problemTitle: z.string().describe('The problem headline'),
	problemPoints: z.array(z.string()).describe('Pain points to show'),
	solutionTitle: z.string().describe('The solution headline'),
	solutionPoints: z.array(z.string()).describe('Solution benefits'),
	transitionText: z.string().describe('Text shown during the reveal'),
	ctaText: z.string(),
	ctaSubtext: z.string().optional(),
	beforeColor: z.string().describe('Color theme for before section'),
	afterColor: z.string().describe('Color theme for after section'),
	problemDurationInFrames: z.number(),
	transitionDurationInFrames: z.number(),
	solutionDurationInFrames: z.number(),
	ctaDurationInFrames: z.number(),
});

type Props = z.infer<typeof beforeAfterSchema>;

const ProblemCard: React.FC<{
	readonly title: string;
	readonly points: string[];
	readonly color: string;
}> = ({title, points, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleSpring = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.5, stiffness: 180},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60,
			}}
		>
			{/* Red-ish gradient background */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
				}}
			/>

			<div style={{textAlign: 'center', zIndex: 1}}>
				{/* Big X icon */}
				<div
					style={{
						fontSize: 100,
						marginBottom: 24,
						opacity: titleSpring,
						transform: `scale(${titleSpring})`,
					}}
				>
					&#10060;
				</div>
				<div
					style={{
						fontSize: 48,
						fontWeight: 900,
						fontFamily: 'Inter, Arial, sans-serif',
						color: color,
						marginBottom: 40,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
					}}
				>
					{title}
				</div>
				{points.map((point, i) => {
					const pointSpring = spring({
						frame: Math.max(0, frame - 15 - i * 10),
						fps,
						config: {damping: 14, mass: 0.4, stiffness: 200},
					});

					return (
						<div
							key={point}
							style={{
								fontSize: 32,
								fontFamily: 'Inter, Arial, sans-serif',
								color: '#FFFFFF',
								marginBottom: 20,
								opacity: pointSpring,
								transform: `translateX(${interpolate(pointSpring, [0, 1], [-40, 0])}px)`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<span style={{color, fontWeight: 700}}>&#8226;</span>
							{point}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const SolutionCard: React.FC<{
	readonly title: string;
	readonly points: string[];
	readonly color: string;
}> = ({title, points, color}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const titleSpring = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.5, stiffness: 180},
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				padding: 60,
			}}
		>
			<AbsoluteFill
				style={{
					background: `linear-gradient(135deg, ${color}22 0%, ${color}44 100%)`,
				}}
			/>

			<div style={{textAlign: 'center', zIndex: 1}}>
				<div
					style={{
						fontSize: 100,
						marginBottom: 24,
						opacity: titleSpring,
						transform: `scale(${titleSpring})`,
					}}
				>
					&#10004;&#65039;
				</div>
				<div
					style={{
						fontSize: 48,
						fontWeight: 900,
						fontFamily: 'Inter, Arial, sans-serif',
						color: color,
						marginBottom: 40,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
					}}
				>
					{title}
				</div>
				{points.map((point, i) => {
					const pointSpring = spring({
						frame: Math.max(0, frame - 15 - i * 10),
						fps,
						config: {damping: 14, mass: 0.4, stiffness: 200},
					});

					return (
						<div
							key={point}
							style={{
								fontSize: 32,
								fontFamily: 'Inter, Arial, sans-serif',
								color: '#FFFFFF',
								marginBottom: 20,
								opacity: pointSpring,
								transform: `translateX(${interpolate(pointSpring, [0, 1], [40, 0])}px)`,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 12,
							}}
						>
							<span style={{color, fontWeight: 700}}>&#10003;</span>
							{point}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

const TransitionReveal: React.FC<{
	readonly text: string;
}> = ({text}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: {damping: 8, mass: 0.3, stiffness: 200},
	});

	const flash = interpolate(frame, [0, 8, 16], [0, 1, 0], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: `rgba(255,255,255,${flash * 0.4})`,
			}}
		>
			<div
				style={{
					fontSize: 56,
					fontWeight: 900,
					fontFamily: 'Inter, Arial, sans-serif',
					color: '#FFFFFF',
					textShadow: '0 4px 20px rgba(0,0,0,0.8)',
					transform: `scale(${scale})`,
					textAlign: 'center',
					padding: '0 40px',
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

export const BeforeAfterDemoReel: React.FC<Props> = ({
	problemTitle,
	problemPoints,
	solutionTitle,
	solutionPoints,
	transitionText,
	ctaText,
	ctaSubtext,
	beforeColor,
	afterColor,
	problemDurationInFrames,
	transitionDurationInFrames,
	solutionDurationInFrames,
	ctaDurationInFrames,
}) => {
	const transStart = problemDurationInFrames;
	const solutionStart = transStart + transitionDurationInFrames;
	const ctaStart = solutionStart + solutionDurationInFrames;

	return (
		<AbsoluteFill style={{backgroundColor: '#111'}}>
			<ProgressBar color={afterColor} />

			{/* BEFORE / Problem */}
			<Sequence from={0} durationInFrames={problemDurationInFrames}>
				<ProblemCard
					title={problemTitle}
					points={problemPoints}
					color={beforeColor}
				/>
			</Sequence>

			{/* Transition */}
			<Sequence
				from={transStart}
				durationInFrames={transitionDurationInFrames}
			>
				<TransitionReveal text={transitionText} />
			</Sequence>

			{/* AFTER / Solution */}
			<Sequence from={solutionStart} durationInFrames={solutionDurationInFrames}>
				<SolutionCard
					title={solutionTitle}
					points={solutionPoints}
					color={afterColor}
				/>
			</Sequence>

			{/* CTA */}
			<Sequence from={ctaStart} durationInFrames={ctaDurationInFrames}>
				<GradientOverlay direction="bottom" opacity={0.8} />
				<CallToAction
					text={ctaText}
					subtext={ctaSubtext}
					backgroundColor={afterColor}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};

export const beforeAfterDefaultProps: Props = {
	problemTitle: 'The Old Way',
	problemPoints: [
		'Manual copy-paste coding',
		'Hours debugging simple bugs',
		'Repetitive boilerplate setup',
	],
	solutionTitle: 'The AI Way',
	solutionPoints: [
		'AI writes code in seconds',
		'Instant debugging with context',
		'Full projects scaffolded instantly',
	],
	transitionText: 'But what if there was\na better way?',
	ctaText: 'Try it yourself',
	ctaSubtext: 'Link in bio',
	beforeColor: '#FF6B6B',
	afterColor: '#00B894',
	problemDurationInFrames: 120,
	transitionDurationInFrames: 45,
	solutionDurationInFrames: 120,
	ctaDurationInFrames: 75,
};
