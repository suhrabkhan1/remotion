import React, {useCallback, useRef} from 'react';
import type {MediaFile} from '../hooks/useEditorStore';

let fileCounter = 0;
const generateId = () => `media-${Date.now()}-${++fileCounter}`;

const createThumbnail = (file: File): Promise<string> => {
	return new Promise((resolve) => {
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.readAsDataURL(file);
			return;
		}

		const video = document.createElement('video');
		video.preload = 'metadata';
		video.muted = true;
		video.playsInline = true;

		video.onloadeddata = () => {
			video.currentTime = 1;
		};

		video.onseeked = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 160;
			canvas.height = 90;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(video, 0, 0, 160, 90);
				resolve(canvas.toDataURL('image/jpeg', 0.7));
			} else {
				resolve('');
			}
			URL.revokeObjectURL(video.src);
		};

		video.src = URL.createObjectURL(file);
	});
};

export const MediaUpload: React.FC<{
	readonly mediaFiles: MediaFile[];
	readonly onAddMedia: (file: MediaFile) => void;
	readonly onRemoveMedia: (id: string) => void;
	readonly onUpdateRole: (id: string, role: 'a-roll' | 'b-roll') => void;
	readonly onNext: () => void;
	readonly onPrev: () => void;
}> = ({mediaFiles, onAddMedia, onRemoveMedia, onUpdateRole, onNext, onPrev}) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const dropZoneRef = useRef<HTMLDivElement>(null);

	const processFiles = useCallback(
		async (files: FileList) => {
			for (const file of Array.from(files)) {
				const isVideo = file.type.startsWith('video/');
				const isImage = file.type.startsWith('image/');
				if (!isVideo && !isImage) continue;

				const url = URL.createObjectURL(file);
				const thumbnail = await createThumbnail(file);

				const mediaFile: MediaFile = {
					id: generateId(),
					name: file.name,
					url,
					type: isVideo ? 'video' : 'image',
					role: 'a-roll',
					thumbnail,
				};
				onAddMedia(mediaFile);
			}
		},
		[onAddMedia],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			dropZoneRef.current?.classList.remove('border-editor-accent');
			if (e.dataTransfer.files.length > 0) {
				processFiles(e.dataTransfer.files);
			}
		},
		[processFiles],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		dropZoneRef.current?.classList.add('border-editor-accent');
	}, []);

	const handleDragLeave = useCallback(() => {
		dropZoneRef.current?.classList.remove('border-editor-accent');
	}, []);

	const aRolls = mediaFiles.filter((f) => f.role === 'a-roll');
	const bRolls = mediaFiles.filter((f) => f.role === 'b-roll');

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h2 className="text-2xl font-bold mb-2">Upload Media</h2>
			<p className="text-editor-muted mb-6">
				Drag and drop your videos and images. Assign them as A-roll (main
				footage) or B-roll (overlay/cutaway).
			</p>

			{/* Drop Zone */}
			<div
				ref={dropZoneRef}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onClick={() => fileInputRef.current?.click()}
				className="border-2 border-dashed border-editor-border rounded-xl p-12 text-center cursor-pointer
					hover:border-editor-accent/50 hover:bg-editor-accent/5 transition-all duration-200 mb-8"
			>
				<div className="text-4xl mb-4">\u2B06\uFE0F</div>
				<p className="text-lg font-semibold mb-2">
					Drop files here or click to browse
				</p>
				<p className="text-sm text-editor-muted">
					Supports MP4, MOV, WebM, JPG, PNG, WebP
				</p>
				<input
					ref={fileInputRef}
					type="file"
					accept="video/*,image/*"
					multiple
					onChange={(e) =>
						e.target.files && processFiles(e.target.files)
					}
				/>
			</div>

			{/* Media Library */}
			{mediaFiles.length > 0 ? (
				<div className="space-y-6">
					{/* A-Rolls */}
					<div>
						<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-blue-500" />
							A-Roll ({aRolls.length})
							<span className="text-xs text-editor-muted font-normal">
								Main footage shown in sequence
							</span>
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{aRolls.map((file) => (
								<MediaCard
									key={file.id}
									file={file}
									onRemove={() => onRemoveMedia(file.id)}
									onToggleRole={() => onUpdateRole(file.id, 'b-roll')}
									roleLabel="Move to B-Roll"
								/>
							))}
						</div>
					</div>

					{/* B-Rolls */}
					<div>
						<h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
							<span className="w-3 h-3 rounded-full bg-green-500" />
							B-Roll ({bRolls.length})
							<span className="text-xs text-editor-muted font-normal">
								Overlay/cutaway footage
							</span>
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{bRolls.map((file) => (
								<MediaCard
									key={file.id}
									file={file}
									onRemove={() => onRemoveMedia(file.id)}
									onToggleRole={() => onUpdateRole(file.id, 'a-roll')}
									roleLabel="Move to A-Roll"
								/>
							))}
						</div>
						{bRolls.length === 0 ? (
							<p className="text-sm text-editor-muted italic">
								Click &quot;Move to B-Roll&quot; on any A-roll clip to add it here.
							</p>
						) : null}
					</div>
				</div>
			) : null}

			{/* Navigation */}
			<div className="mt-8 flex justify-between">
				<button
					onClick={onPrev}
					className="px-6 py-3 rounded-xl font-semibold text-sm bg-editor-border text-editor-text hover:bg-editor-border/80 transition-all"
					type="button"
				>
					Back
				</button>
				<button
					onClick={onNext}
					disabled={mediaFiles.length === 0}
					className={`
						px-8 py-3 rounded-xl font-semibold text-sm transition-all
						${
							mediaFiles.length > 0
								? 'bg-editor-accent hover:bg-editor-accent-hover text-white'
								: 'bg-editor-border text-editor-muted cursor-not-allowed'
						}
					`}
					type="button"
				>
					Continue
				</button>
			</div>
		</div>
	);
};

const MediaCard: React.FC<{
	readonly file: MediaFile;
	readonly onRemove: () => void;
	readonly onToggleRole: () => void;
	readonly roleLabel: string;
}> = ({file, onRemove, onToggleRole, roleLabel}) => {
	return (
		<div className="relative group rounded-lg overflow-hidden bg-editor-border aspect-video">
			{file.thumbnail ? (
				<img
					src={file.thumbnail}
					alt={file.name}
					className="w-full h-full object-cover"
				/>
			) : (
				<div className="w-full h-full flex items-center justify-center text-editor-muted">
					{file.type === 'video' ? '\uD83C\uDFAC' : '\uD83D\uDDBC\uFE0F'}
				</div>
			)}

			{/* Type badge */}
			<span className="absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded bg-black/60 text-white">
				{file.type === 'video' ? 'VID' : 'IMG'}
			</span>

			{/* Hover overlay */}
			<div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
				<button
					onClick={onToggleRole}
					className="text-xs px-3 py-1.5 rounded-full bg-editor-accent text-white hover:bg-editor-accent-hover transition-colors"
					type="button"
				>
					{roleLabel}
				</button>
				<button
					onClick={onRemove}
					className="text-xs px-3 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
					type="button"
				>
					Remove
				</button>
			</div>

			{/* Filename */}
			<div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
				<p className="text-xs text-white truncate">{file.name}</p>
			</div>
		</div>
	);
};
