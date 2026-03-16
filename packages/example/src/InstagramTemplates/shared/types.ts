import {z} from 'zod';

// Instagram Reel dimensions: 1080x1920 (9:16 vertical)
export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;
export const REEL_FPS = 30;

// Instagram Post dimensions: 1080x1080 (1:1 square)
export const POST_WIDTH = 1080;
export const POST_HEIGHT = 1080;

export const captionStyleSchema = z.object({
	text: z.string(),
	startFrame: z.number(),
	durationInFrames: z.number(),
});

export type CaptionStyle = z.infer<typeof captionStyleSchema>;

export const bRollClipSchema = z.object({
	src: z.string().describe('URL or staticFile path to video/image'),
	startFrame: z.number(),
	durationInFrames: z.number(),
	type: z.enum(['video', 'image']),
});

export type BRollClip = z.infer<typeof bRollClipSchema>;

export const slideSchema = z.object({
	heading: z.string(),
	body: z.string(),
	backgroundSrc: z.string().optional(),
	backgroundColor: z.string().optional(),
});

export type Slide = z.infer<typeof slideSchema>;

export const tipSchema = z.object({
	number: z.number(),
	title: z.string(),
	description: z.string(),
	iconEmoji: z.string().optional(),
});

export type Tip = z.infer<typeof tipSchema>;
