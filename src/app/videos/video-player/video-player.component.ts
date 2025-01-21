import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VgCoreModule, VgMediaElement } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VideoService } from '../../services/video.service';
import { VideoData } from '../../models/video-data';

@Component({
  selector: 'app-video-player',
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss'
})
export class VideoPlayerComponent implements OnInit {
  // @ViewChild(VgMediaElement, { static: true }) mediaElement!: VgMediaElement;  
  @ViewChild('media', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  videoPath: string | null = null;
  currentVideo: VideoData = {
    id: 1,
    title: '',
    description: '',
    video_file: '',
    thumbnail: '',
    category: '',
    created_at: '',
    new: false,
  };

  constructor(private route: ActivatedRoute, public videoService: VideoService) {}

  ngOnInit(): void {
    this.videoPath = this.route.snapshot.paramMap.get('path');
    this.route.paramMap.subscribe(params => {
      this.videoPath = params.get('path');
    });

    if (this.videoPath) {
      this.loadVideo(this.videoPath);
    }
  }

  // playVideo(): void {
  //   this.mediaElement.play();
  // }

  /**
   * Fetches video details based on the title from the URL.
   */
  loadVideo(path: string) {
    this.videoService.fetchVideoByPath(path)
      .then((videoData) => {
        this.currentVideo = videoData as VideoData;
        this.videoElement.nativeElement.src = this.currentVideo.video_file;
        this.videoElement.nativeElement.load();
      })
      .catch(() => {
        console.error('Video not found');
      });
  }
}
