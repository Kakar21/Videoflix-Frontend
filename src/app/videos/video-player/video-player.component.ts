import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VgCoreModule, VgMediaElement } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';


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
export class VideoPlayerComponent {
  // @ViewChild(VgMediaElement, { static: true }) mediaElement!: VgMediaElement;  
  videoId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(params => {
      this.videoId = params.get('id');
    });
  }

  // playVideo(): void {
  //   this.mediaElement.play();
  // }
}
