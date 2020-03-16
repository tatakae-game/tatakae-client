import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

interface Tilemap {
  tiles: string[];
}

interface Terrain {
  width: number;
  height: number;

  tilemaps: Tilemap[];
}

@Component({
  selector: 'app-game',
  template: '',
})
export class GameComponent implements OnInit {
  public app: PIXI.Application;

  public terrain: Terrain = {
    width: 8,
    height: 8,

    tilemaps: [
      {
        tiles: [
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
          'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        ],
      },
      {
        tiles: [
          'tree', null, null, null, 'tree', null, null, null,
          null, null, null, null, null, null, null, null,
          null, null, null, 'tree', null, null, null, null,
          null, null, null, null, null, null, null, null,
          null, 'tree', null, null, null, null, null, null,
          null, null, null, null, null, 'tree', null, null,
          null, null, null, null, null, null, null, null,
          null, null, null, null, null, null, null, null,
        ],
      },
    ],
  };

  public canvas_size = 512;

  constructor(private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        backgroundColor: 0x1099bb,
        width: this.canvas_size,
        height: this.canvas_size,
      });

      let loader = new PIXI.Loader();

      const unique_tilemaps_tiles = this.terrain.tilemaps
        .map(tilemap => new Set(tilemap.tiles))
        .reduce((a, v) => a.concat(...v), [])

      const unique_tiles = new Set(unique_tilemaps_tiles)

      loader.add([...unique_tiles].map(tile => `/assets/tiles/${tile}.png`));

      loader.on('complete', () => {
        this.loadGame();
      });

      loader.load();
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  loadGame() {
    this.terrain.tilemaps.forEach((tilemap, i) => this.generateTilemap(tilemap, i));
  }

  generateTilemap(tilemap: Tilemap, index: number) {
    const scale = this.canvas_size / this.terrain.height
    const container = new PIXI.Container();

    this.app.stage.addChild(container);

    for (let y = 0; y < this.terrain.height; y++) {
      for (let x = 0; x < this.terrain.width; x++) {
        const tile = tilemap.tiles[(y * this.terrain.width) + x];

        if (!tile) continue;

        const texture = PIXI.Texture.from(`/assets/tiles/${tile}.png`);
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        const sprite = new PIXI.Sprite(texture);
        const sprite_x_scale = scale / texture.orig.width;
        const sprite_y_scale = scale / texture.orig.height;

        sprite.scale.set(sprite_x_scale, sprite_y_scale);
        sprite.anchor.set(0.5, 0.5);

        sprite.x = (x + 0.5) * scale;
        sprite.y = (y + 0.5) * scale;

        console.log(sprite.x, sprite.y)

        if (index === 0) {
          sprite.angle = Math.floor(Math.random() * 3) * 90;
        }

        container.addChild(sprite);
      }
    }

    // Move container to the center
    container.x = 0;
    container.y = 0;

    // Center bunny sprite in local container coordinates
    container.pivot.x = 0;
    container.pivot.y = 0;
  }
}
