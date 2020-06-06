import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import * as PIXI from 'pixi.js';
import { WsService } from '../ws.service';

enum TileType {
  Floor,
  BlockingObstacle,
  Entity,
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

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

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
  'robot': {
    type: TileType.Entity,
    textures: [
      {
        frames: [
          '/assets/tiles/robot/robot.png',
        ],
      }
    ],
  },
}

interface Unit {
  hp: number;
  id: string;
  model: string;
  orientation: string;
  sprite: PIXI.AnimatedSprite;
}

interface Layers {
  addresses: { x: number, y: number }[];
  ground: string[];
  items: string[][];
  obstacles: string[];
  units: Unit[];
}

interface Tilemap {
  layers: Layers;
  square_size: number;
}

interface Action {
  name: string;
  [key: string]: any;
}

class Terrain {
  constructor(public width: number, public height: number, public tilemaps: Tilemap[] = []) { }

  // get(tilemap: Tilemap, x: number, y: number) {
  //   return tilemap.tiles[x + (y * this.width)];
  // }
}

@Component({
  selector: 'app-game',
  template: '',
})
export class GameComponent implements OnInit {
  public app: PIXI.Application;

  private socket: SocketIOClient.Socket = null;

  public canvas_size = 512;

  constructor(private wsService: WsService, private elementRef: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.app = new PIXI.Application({
        backgroundColor: 0x1099bb,
        width: this.canvas_size,
        height: this.canvas_size,
        antialias: false,
      });

      const loader = new PIXI.Loader();

      for (const name in TILES) {
        const tile = TILES[name];

        const textures = tile.textures.reduce((acc, textures) => {
          return acc.concat(textures.frames)
        }, []);

        loader.add(textures);
      }

      loader.load();
    });

    this.elementRef.nativeElement.appendChild(this.app.view);
  }

  loadGame(terrain: Tilemap) {
    this.app.stage.removeChildren();

    // this.terrain.tilemaps.forEach((tilemap, i) => this.generateTilemap(tilemap));
    this.generateGroundTilemap(terrain);
  }

  generateGroundTilemap(terrain: Tilemap) {
    const ground = terrain.layers.ground;

    const scale = this.canvas_size / terrain.square_size
    const container = new PIXI.Container();

    this.app.stage.addChild(container);

    for (let y = 0; y < terrain.square_size; y++) {
      for (let x = 0; x < terrain.square_size; x++) {
        const tile = ground[x + (y * terrain.square_size)];

        if (!tile) continue;

        const sprite = this.renderSprite(TILES[tile], scale, x, y)

        container.addChild(sprite);
      }
    }
  }

  spawnUnit(terrain: Tilemap, unit: Unit, x: number, y: number): Unit {
    const scale = this.canvas_size / terrain.square_size;
    const sprite = this.renderSprite(TILES['robot'], scale, x, y);

    if (unit.orientation == 'up') {
      sprite.angle = 0;
    } else if (unit.orientation == 'right') {
      sprite.angle = 90;
    } else if (unit.orientation == 'down') {
      sprite.angle = 180;
    } else if (unit.orientation == 'left') {
      sprite.angle = 270;
    }

    this.app.stage.addChild(sprite);

    unit.sprite = sprite;

    return unit;
  }

  renderSprite(tile_settings: TileSettings, scale: number, x: number, y: number): PIXI.AnimatedSprite {
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

    return sprite;
  }

  moveSprite(sprite: PIXI.AnimatedSprite, scale: number, x: number, y: number) {
    sprite.x = (x + 0.5) * scale;
    sprite.y = (y + 0.5) * scale;
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

  public run(code: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = this.wsService.connect('/matchmaking', { test: "true", code, }, {
      reconnection: false,
    })

    let map: Tilemap = null;

    this.socket.on('match found', (data: { map: Tilemap, opponent_username: string, username: string }) => {
      map = data.map;
      map.layers.units = Array(map.square_size ** 2).fill(null);

      this.loadGame(map);

      console.log(map)

      this.socket.on('spawn', (data) => {
        console.log('spawn:', data)

        this.handleActions(map, data.actions)
      });

      this.socket.on('round actions', (data) => {
        console.log('round:', data)

        this.handleActions(map, data.actions)
      });

      this.socket.on('end test phase', (data) => {
        console.log("test ended")
      });
    });
  }

  async handleActions(map: Tilemap, actions: Action[]) {
    for (const action of actions) {
      await this.handleAction(map, action);
    }
  }

  async handleAction(map: Tilemap, action: Action) {
    const { name } = action

    if (name == 'spawn') {
      const unit: Unit = {
        hp: action.unit.hp,
        id: action.unit.id,
        model: action.unit.model,
        orientation: action.unit.orientation,
        sprite: null,
      }

      const { position } = action.unit

      map.layers.units[position.x + (position.y * map.square_size)] = unit

      this.spawnUnit(map, unit, position.x, position.y);
    } else if (name == 'walk') {
      const { unit, position } = this.findUnit(map, action.robot_id);

      map.layers.units[action.new_position.x + (action.new_position.y * map.square_size)] = unit
      map.layers.units[position.x + (position.y * map.square_size)] = null

      const scale = this.canvas_size / map.square_size;
      this.moveSprite(unit.sprite, scale, position.x, position.y);
    }

    await sleep(500);
  }

  findUnit(map: Tilemap, id: string): { unit: Unit, position: { x: number, y: number } } {
    const position = { x: 0, y: 0 };
    let unit: Unit = null;

    for (let i = 0; i < map.layers.units.length; i++) {
      unit = map.layers.units[i]

      if (!unit || (unit.id !== id)) {
        continue;
      }

      position.x = i % map.square_size;
      position.y = Math.floor(i / map.square_size);

      break;
    }

    if (!unit) {
      console.log(`Unit ${id} not found.`)
    }

    return { unit, position };
  }
}
