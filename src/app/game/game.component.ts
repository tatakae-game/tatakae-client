import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

interface TileSettings {
  texture?: string[];
  textures?: string[][];
}

const TILES: { [key: string]: TileSettings } = {
  'grass': {
    texture: [
      '/assets/tiles/grass.png',
    ],
  },
  'tree': {
    textures: [
      [
        '/assets/tiles/tree/tree1.png',
        '/assets/tiles/tree/tree2.png',
        '/assets/tiles/tree/tree3.png',
        '/assets/tiles/tree/tree4.png',
        '/assets/tiles/tree/tree5.png',
      ],
    ],
  },
}

interface Tilemap {
  tiles: string[];
}

class Terrain {
  constructor(public width: number, public height: number, public tilemaps: Tilemap[] = []) { }

  get(tilemap: Tilemap, x: number, y: number) {
    return tilemap.tiles[x + (y * this.width)];
  }
}

@Component({
  selector: 'app-game',
  template: '',
})
export class GameComponent implements OnInit {
  public app: PIXI.Application;

  public terrain = new Terrain(8, 8, [
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
  ]);

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

      const unique_tiles = new Set<string>(unique_tilemaps_tiles);
      [...unique_tiles].filter(tile => !!tile).forEach(tile => {
        const tile_settings = TILES[tile];

        if (tile_settings) {
          loader.add(tile_settings.textures || tile_settings.texture)
        }
      });

      loader.load(() => {
        this.loadGame();
      });
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
        const tile = this.terrain.get(tilemap, x, y);

        if (!tile) continue;

        const tile_settings = TILES[tile];
        const sprite = this.generateSprite(tile_settings);

        const sprite_x_scale = scale / sprite.texture.orig.width;
        const sprite_y_scale = scale / sprite.texture.orig.height;

        sprite.scale.set(sprite_x_scale, sprite_y_scale);
        sprite.anchor.set(0.5, 0.5);

        sprite.x = (x + 0.5) * scale;
        sprite.y = (y + 0.5) * scale;

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

  /**
   * @param {TileSettings} tile_settings 
   */
  generateSprite(tile_settings) {
    if (tile_settings.textures) {
      const alternatives = tile_settings.textures[Math.floor(Math.random() * tile_settings.textures.length)];
      const textures = alternatives.map(path => {
        const texture = PIXI.Texture.from(path);
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

        return texture
      });

      const sprite = new PIXI.AnimatedSprite(textures)
      sprite.animationSpeed = 0.075;
      sprite.play();

      return sprite;
    } else {
      const alternative = tile_settings.texture[Math.floor(Math.random() * tile_settings.texture.length)];
      const texture = PIXI.Texture.from(alternative);
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

      return new PIXI.Sprite(texture)
    }
  }
}
