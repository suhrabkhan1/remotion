import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const ProgressBar: React.FC<{
	readonly color?: string;
	readonly height?: number;
	readonly position?: 'top' | 'bottom';
}> = ({color = '#FFFFFF', height = 4, position = 'top'}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 100], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				[position]: 0,
				height,
				backgroundColor: 'rgba(255,255,255,0.2)',
				zIndex: 100,
			}}
		>
			<div
				style={{
					width: `${progress}%`,
					height: '100%',
					backgroundColor: color,
					borderRadius: position === 'bottom' ? '0 2px 0 0' : '0 0 2px 0',
				}}
			/>
		</div>
	);
};
