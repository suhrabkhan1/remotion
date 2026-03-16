import React from 'react';
import {AbsoluteFill} from 'remotion';

export const GradientOverlay: React.FC<{
	readonly direction?: 'top' | 'bottom' | 'both';
	readonly color?: string;
	readonly opacity?: number;
}> = ({direction = 'bottom', color = '0,0,0', opacity = 0.7}) => {
	const gradients: string[] = [];

	if (direction === 'bottom' || direction === 'both') {
		gradients.push(
			`linear-gradient(to top, rgba(${color},${opacity}) 0%, rgba(${color},0) 50%)`,
		);
	}

	if (direction === 'top' || direction === 'both') {
		gradients.push(
			`linear-gradient(to bottom, rgba(${color},${opacity}) 0%, rgba(${color},0) 40%)`,
		);
	}

	return (
		<>
			{gradients.map((gradient) => (
				<AbsoluteFill
					key={gradient}
					style={{
						background: gradient,
					}}
				/>
			))}
		</>
	);
};
