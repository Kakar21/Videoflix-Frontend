export interface VideoData {
  id: number;
  title: string;
  description: string;
  video_120p?: string;
  video_360p?: string;
  video_720p?: string;
  video_1080p?: string;
  thumbnail: string;
  category: string;
  created_at: string;
  new: boolean;
}
