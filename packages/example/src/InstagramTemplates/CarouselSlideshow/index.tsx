import React from 'react';
import {
	AbsoluteFill,
	Img,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {GradientOverlay, slideSchema} from '../shared';

// ─── Schema ──────────────────────────────────────────────────────
// Template 4: Carousel / Slideshow Post
// Inspired by multi-slide Instagram posts with swipe-style
// transitions, numbered indicators, and branded styling.
// Great for "5 AI tools", "3 tips", listicle carousels.
// ──────────────────────────────────────────────────────────────────

export const carouselSchema = z.object({
	slides: z.array(slideSchema).describe('Slides for the carousel'),
	brandName: z.string().describe('Your brand/handle shown on slides'),
	accentColor: z.string(),
	slideTransition: z
		.enum(['slide', 'fade', 'zoom'])
		.describe('Transition style between slides'),
	framesPerSlide: z.number().describe('Duration per slide in frames'),
});

type Props = z.infer<typeof carouselSchema>;

const SlideContent: React.FC<{
	readonly heading: string;
	readonly body: string;
	readonly backgroundSrc?: string;
	readonly backgroundColor?: string;
	readonly slideNumber: number;
	readonly totalSlides: number;
	readonly brandName: string;
	readonly accentColor: string;
	readonly transition: 'slide' | 'fade' | 'zoom';
}> = ({
	heading,
	body,
	backgroundSrc,
	backgroundColor,
	slideNumber,
	totalSlides,
	brandName,
	accentColor,
	transition,
}) => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 14, mass: 0.5, stiffness: 180},
	});

	const exitStart = durationInFrames - 10;
	const exitProgress =
		frame > exitStart
			? interpolate(frame, [exitStart, durationInFrames], [0, 1], {
					extrapolateRight: 'clamp',
				})
			: 0;

	const getTransitionStyle = (): React.CSSProperties => {
		switch (transition) {
			case 'slide':
				return {
					transform: `translateX(${interpolate(entrance, [0, 1], [100, 0])}%) translateX(${exitProgress * -100}%)`,
				};
			case 'zoom':
				return {
					transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])}) scale(${1 - exitProgress * 0.2})`,
					opacity: entrance * (1 - exitProgress),
				};
			case 'fade':
			default:
				return {
					opacity: entrance * (1 - exitProgress),
				};
		}
	};

	return (
		<AbsoluteFill style={getTransitionStyle()}>
			{/* Background */}
			{backgroundSrc ? (
				<AbsoluteFill>
					<Img
						src={backgroundSrc}
						style={{width: '100%', height: '100%', objectFit: 'cover'}}
					/>
					<AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.55)'}} />
				</AbsoluteFill>
			) : (
				<AbsoluteFill
					style={{
						backgroundColor: backgroundColor || '#1a1a2e',
					}}
				/>
			)}

			<GradientOverlay direction="both" opacity={0.4} />

			{/* Slide Number Dots */}
			<div
				style={{
					position: 'absolute',
					top: 60,
					left: 0,
					right: 0,
					display: 'flex',
					justifyContent: 'center',
					gap: 10,
				}}
			>
				{Array.from({length: totalSlides}).map((_, i) => (
					<div
						key={`dot-${i}`}
						style={{
							width: i === slideNumber ? 32 : 10,
							height: 10,
							borderRadius: 5,
							backgroundColor:
								i === slideNumber ? accentColor : 'rgba(255,255,255,0.4)',
							transition: 'all 0.3s',
						}}
					/>
				))}
			</div>

			{/* Brand name */}
			<div
				style={{
					position: 'absolute',
					top: 100,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontSize: 24,
					fontWeight: 600,
					fontFamily: 'Inter, Arial, sans-serif',
					color: accentColor,
					letterSpacing: 2,
					textTransform: 'uppercase',
				}}
			>
				{brandName}
			</div>

			{/* Content */}
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					padding: 60,
				}}
			>
				<div style={{textAlign: 'center'}}>
					{/* Slide number badge */}
					<div
						style={{
							width: 80,
							height: 80,
							borderRadius: 40,
							backgroundColor: accentColor,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 36,
							fontWeight: 900,
							fontFamily: 'Inter, Arial, sans-serif',
							color: '#FFF',
							margin: '0 auto 32px',
							opacity: interpolate(entrance, [0, 1], [0, 1]),
							transform: `scale(${entrance})`,
						}}
					>
						{slideNumber + 1}
					</div>

					<div
						style={{
							fontSize: 52,
							fontWeight: 900,
							fontFamily: 'Inter, Arial, sans-serif',
							color: '#FFFFFF',
							lineHeight: 1.2,
							marginBottom: 24,
							opacity: interpolate(entrance, [0, 1], [0, 1]),
							transform: `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`,
						}}
					>
						{heading}
					</div>

					<div
						style={{
							fontSize: 30,
							fontFamily: 'Inter, Arial, sans-serif',
							color: 'rgba(255,255,255,0.8)',
							lineHeight: 1.6,
							opacity: interpolate(
								spring({
									frame: Math.max(0, frame - 10),
									fps,
									config: {damping: 14, mass: 0.4, stiffness: 200},
								}),
								[0, 1],
								[0, 1],
							),
						}}
					>
						{body}
					</div>
				</div>
			</AbsoluteFill>

			{/* Swipe indicator on last slide */}
			{slideNumber === totalSlides - 1 ? null : (
				<div
					style={{
						position: 'absolute',
						bottom: 80,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontSize: 22,
						fontFamily: 'Inter, Arial, sans-serif',
						color: 'rgba(255,255,255,0.5)',
						opacity: interpolate(
							frame % 40,
							[0, 20, 40],
							[0.4, 0.8, 0.4],
						),
					}}
				>
					Swipe &rarr;
				</div>
			)}
		</AbsoluteFill>
	);
};

export const CarouselSlideshowPost: React.FC<Props> = ({
	slides,
	brandName,
	accentColor,
	slideTransition,
	framesPerSlide,
}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{slides.map((slide, i) => (
				<Sequence
					key={slide.heading}
					from={i * framesPerSlide}
					durationInFrames={framesPerSlide}
				>
					<SlideContent
						heading={slide.heading}
						body={slide.body}
						backgroundSrc={slide.backgroundSrc}
						backgroundColor={slide.backgroundColor}
						slideNumber={i}
						totalSlides={slides.length}
						brandName={brandName}
						accentColor={accentColor}
						transition={slideTransition}
					/>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

export const carouselDefaultProps: Props = {
	slides: [
		{
			heading: '5 AI Tools You Need',
			body: 'These tools will 10x your productivity in 2025',
			backgroundColor: '#1a1a2e',
		},
		{
			heading: 'Claude Code',
			body: 'AI-powered coding assistant that lives in your terminal',
			backgroundColor: '#16213e',
		},
		{
			heading: 'Cursor',
			body: 'The AI-first code editor that writes code with you',
			backgroundColor: '#0f3460',
		},
		{
			heading: 'v0 by Vercel',
			body: 'Generate UI components from text descriptions instantly',
			backgroundColor: '#533483',
		},
		{
			heading: 'Follow for more!',
			body: 'Save this post and share with a developer friend',
			backgroundColor: '#e94560',
		},
	],
	brandName: '@suhrabkhan',
	accentColor: '#E1306C',
	slideTransition: 'slide',
	framesPerSlide: 90,
};
