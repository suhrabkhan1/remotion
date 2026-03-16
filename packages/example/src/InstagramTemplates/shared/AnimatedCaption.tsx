import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const AnimatedCaption: React.FC<{
	readonly text: string;
	readonly fontSize?: number;
	readonly color?: string;
	readonly backgroundColor?: string;
	readonly position?: 'top' | 'center' | 'bottom';
	readonly style?: 'bold' | 'outline' | 'boxed';
}> = ({
	text,
	fontSize = 48,
	color = '#FFFFFF',
	backgroundColor,
	position = 'bottom',
	style = 'bold',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const entrance = spring({
		frame,
		fps,
		config: {damping: 12, mass: 0.5, stiffness: 200},
	});

	const positionStyles: React.CSSProperties =
		position === 'top'
			? {top: 120}
			: position === 'center'
				? {top: '50%', transform: `translateY(-50%) scale(${entrance})`}
				: {bottom: 200};

	const textShadow =
		style === 'outline'
			? '2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000'
			: '0 4px 12px rgba(0,0,0,0.8)';

	return (
		<div
			style={{
				position: 'absolute',
				left: 40,
				right: 40,
				display: 'flex',
				justifyContent: 'center',
				opacity: interpolate(entrance, [0, 1], [0, 1]),
				transform:
					position !== 'center'
						? `translateY(${interpolate(entrance, [0, 1], [30, 0])}px)`
						: undefined,
				...positionStyles,
			}}
		>
			<div
				style={{
					fontSize,
					fontWeight: 800,
					fontFamily: 'Inter, Arial, sans-serif',
					color,
					textAlign: 'center',
					lineHeight: 1.3,
					textShadow,
					...(style === 'boxed'
						? {
								backgroundColor: backgroundColor || 'rgba(0,0,0,0.75)',
								padding: '16px 32px',
								borderRadius: 12,
							}
						: {}),
				}}
			>
				{text}
			</div>
		</div>
	);
};
