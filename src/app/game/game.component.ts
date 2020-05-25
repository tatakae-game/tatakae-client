import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';

enum TileType {
  Floor,
  BlockingObstacle,
}

interface TileTexture {
  chance?: number,
  speed?: number;
  randomize_angle?: boolean;
  frames: string[];
}

interface TileSettings {
  type: TileType;
  textures?: TileTexture[];
}

const TILES: { [key: string]: TileSettings } = {
  'grass': {
    type: TileType.Floor,
    textures: [
      {
        chance: 10,
        speed: 0.1,
        randomize_angle: false,
        frames: [
          '/assets/tiles/grass/1/grass1.png',
          '/assets/tiles/grass/1/grass2.png',
          '/assets/tiles/grass/1/grass3.png',
          '/assets/tiles/grass/1/grass4.png',
        ],
      },
      {
        chance: 10,
        randomize_angle: false,
        frames: ['/assets/tiles/grass/2/grass.png'],
      },
      {
        chance: 80,
        randomize_angle: false,
        frames: ['/assets/tiles/grass/3/grass.png'],
      },
    ],
  },
  'sand': {
    type: TileType.Floor,
    textures: [
      {
        frames: ['/assets/tiles/sand/sand.png'],
      },
    ],
  },
  'ruins': {
    type: TileType.BlockingObstacle,
    textures: [
      {
        frames: ['/assets/tiles/ruins/ruins.png'],
      },
    ],
  },
  'desert-mountain': {
    type: TileType.BlockingObstacle,
    textures: [
      {
        frames: ['/assets/tiles/desert-mountain/desert-mountain.png'],
      },
    ],
  },
  'tree': {
    type: TileType.BlockingObstacle,
    textures: [
      {
        speed: 0.05,
        frames: [
          '/assets/tiles/tree/tree1.png',
          '/assets/tiles/tree/tree2.png',
          '/assets/tiles/tree/tree3.png',
          '/assets/tiles/tree/tree4.png',
          '/assets/tiles/tree/tree5.png',
        ],
      }
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

  public terrain = new Terrain(16, 16, [
    {
      tiles: [
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
        'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass',
      ],
    },
    {
      tiles: [
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,
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
        antialias: false,
      });

      let loader = new PIXI.Loader();

      const unique_tilemaps_tiles = this.terrain.tilemaps
        .map(tilemap => new Set(tilemap.tiles))
        .reduce((a, v) => a.concat(...v), [])

      const unique_tiles = new Set<string>(unique_tilemaps_tiles);
      [...unique_tiles].filter(tile => !!tile).forEach(tile => {
        const tile_settings = TILES[tile];

        if (tile_settings) {
          loader.add(tile_settings.textures.reduce((acc, textures) => {
            return acc.concat(textures.frames)
          }, []));
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
        const { sprite, texture } = this.generateSprite(tile_settings);

        const sprite_x_scale = scale / sprite.texture.orig.width;
        const sprite_y_scale = scale / sprite.texture.orig.height;

        sprite.scale.set(sprite_x_scale, sprite_y_scale);
        sprite.anchor.set(0.5, 0.5);

        sprite.x = (x + 0.5) * scale;
        sprite.y = (y + 0.5) * scale;

        if (texture.randomize_angle === true) {
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

  generateSprite(tile_settings: TileSettings) {
    const alternative = this.chooseAlternative(tile_settings.textures);
    const textures = alternative.frames.map(path => {
      const texture = PIXI.Texture.from(path);
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

      return texture
    });

    const sprite = new PIXI.AnimatedSprite(textures)

    console.log(this.app.ticker.FPS)
    sprite.animationSpeed = isNaN(alternative.speed) ? 1 : alternative.speed;
    sprite.play();

    return {
      sprite,
      texture: alternative,
    };
  }

  chooseAlternative(textures: TileTexture[]): TileTexture {
    const dices = Math.random() * 100;

    for (const texture of textures) {
      if (dices <= texture.chance) {
        return texture;
      }
    }

    return textures[Math.floor(Math.random() * textures.length)];
  }
}
