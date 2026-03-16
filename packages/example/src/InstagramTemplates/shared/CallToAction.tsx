import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const CallToAction: React.FC<{
	readonly text?: string;
	readonly subtext?: string;
	readonly backgroundColor?: string;
	readonly textColor?: string;
}> = ({
	text = 'Follow for more',
	subtext,
	backgroundColor = '#E1306C',
	textColor = '#FFFFFF',
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const scale = spring({
		frame,
		fps,
		config: {damping: 8, mass: 0.4, stiffness: 180},
	});

	const pulse = Math.sin(frame * 0.15) * 0.03 + 1;

	return (
		<div
			style={{
				position: 'absolute',
				bottom: 100,
				left: 40,
				right: 40,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 12,
				opacity: interpolate(scale, [0, 1], [0, 1]),
				transform: `scale(${scale * pulse})`,
			}}
		>
			<div
				style={{
					backgroundColor,
					color: textColor,
					fontSize: 36,
					fontWeight: 800,
					fontFamily: 'Inter, Arial, sans-serif',
					padding: '20px 48px',
					borderRadius: 50,
					textAlign: 'center',
				}}
			>
				{text}
			</div>
			{subtext ? (
				<div
					style={{
						color: 'rgba(255,255,255,0.8)',
						fontSize: 24,
						fontFamily: 'Inter, Arial, sans-serif',
						textAlign: 'center',
					}}
				>
					{subtext}
				</div>
			) : null}
		</div>
	);
};
