import React from 'react';
import {
	AbsoluteFill,
	Img,
	OffthreadVideo,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import type {BRollClip} from './types';

const KenBurnsImage: React.FC<{
	readonly src: string;
}> = ({src}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const scale = interpolate(frame, [0, durationInFrames], [1, 1.15], {
		extrapolateRight: 'clamp',
	});

	const translateX = interpolate(frame, [0, durationInFrames], [0, -2], {
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<Img
				src={src}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					transform: `scale(${scale}) translateX(${translateX}%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

const ClipTransition: React.FC<{
	readonly children: React.ReactNode;
}> = ({children}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 15, mass: 0.5, stiffness: 200},
	});

	return (
		<AbsoluteFill
			style={{
				opacity: interpolate(entrance, [0, 1], [0, 1]),
			}}
		>
			{children}
		</AbsoluteFill>
	);
};

export const BRollPlayer: React.FC<{
	readonly clips: BRollClip[];
	readonly dimOverlay?: number;
}> = ({clips, dimOverlay = 0.3}) => {
	return (
		<AbsoluteFill>
			{clips.map((clip) => (
				<Sequence
					key={`${clip.src}-${clip.startFrame}`}
					from={clip.startFrame}
					durationInFrames={clip.durationInFrames}
				>
					<ClipTransition>
						{clip.type === 'video' ? (
							<OffthreadVideo
								src={clip.src}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
							/>
						) : (
							<KenBurnsImage src={clip.src} />
						)}
					</ClipTransition>
				</Sequence>
			))}
			{dimOverlay > 0 ? (
				<AbsoluteFill
					style={{backgroundColor: `rgba(0,0,0,${dimOverlay})`}}
				/>
			) : null}
		</AbsoluteFill>
	);
};
