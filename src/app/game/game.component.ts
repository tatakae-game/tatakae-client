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
  textures?: TileTexture[];
}

const sleep = (ms: number) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

const TILES: { [key: string]: TileSettings } = {
  'grass': {
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
        chance: 90,
        randomize_angle: false,
        frames: ['/assets/tiles/grass/2/grass.png'],
      },
    ],
  },
  'rock': {
    textures: [
      {
        frames: ['/assets/tiles/rock/1/rock.png'],
      },
    ],
  },
  'robot': {
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

type QueueCallback = () => any;

class AnimationQueue {
  private stack: QueueCallback[] = [];
  private isActive = false;
  private kill = false;

  private started = false;
  private errored = false;

  private running: any = null;

  add(cb: QueueCallback) {
    if (!this.errored) {
      this.stack.push(cb);
    }

    if (this.started && !this.errored) {
      this.wake();
    }
  }

  async next() {
    try {
      if (this.stack.length > 0) {
        this.isActive = true;
        const cb = this.stack.shift();
        this.running = cb();

        await this.running;
        this.running = null;

        if (!this.kill) {
          this.next();
        }
      } else {
        this.isActive = false;
      }
    } catch (e) {
      console.error(e)
      this.errored = true;

      this.running = null;
      this.isActive = false;
    }
  }

  wake() {
    if (!this.isActive) {
      this.next();
    }
  }

  start() {
    this.started = true;
    this.wake();
  }

  async stop() {
    this.kill = true;

    if (this.running) {
      await this.running;
    }

    this.started = false;
    this.isActive = false;
    this.kill = false;
  }

  async clear() {
    await this.stop();

    this.stack = [];
    this.errored = false;
  }
}

@Component({
  selector: 'app-game',
  template: '',
})
export class GameComponent implements OnInit {
  public app: PIXI.Application;

  private socket: SocketIOClient.Socket = null;

  public canvas_size = 512;

  private queue: AnimationQueue = new AnimationQueue();

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

  async loadGame(terrain: Tilemap) {
    this.app.stage.removeChildren();

    this.generateGroundTilemap(terrain);
    this.generateObstaclesTilemap(terrain);
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
        sprite.zIndex = 1

        container.addChild(sprite);
      }
    }
  }

  generateObstaclesTilemap(terrain: Tilemap) {
    const obstacles = terrain.layers.obstacles;

    const scale = this.canvas_size / terrain.square_size
    const container = new PIXI.Container();

    this.app.stage.addChild(container);

    for (let y = 0; y < terrain.square_size; y++) {
      for (let x = 0; x < terrain.square_size; x++) {
        const tile = obstacles[x + (y * terrain.square_size)];

        if (!tile) continue;

        console.log(TILES[tile])

        const sprite = this.renderSprite(TILES[tile], scale, x, y)
        sprite.zIndex = 2

        container.addChild(sprite);
      }
    }
  }

  spawnUnit(terrain: Tilemap, unit: Unit, x: number, y: number): Unit {
    const scale = this.canvas_size / terrain.square_size;
    const sprite = this.renderSprite(TILES['robot'], scale, x, y);
    sprite.zIndex = 10;

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

  moveSprite(sprite: PIXI.AnimatedSprite, scale: number, x: number, y: number, is_jump: boolean = false) {
    return new Promise((resolve) => {
      const destination = {
        x: (x + 0.5) * scale,
        y: (y + 0.5) * scale,
      }

      // Shallow copy original scale
      const original_scale = { x: sprite.scale.x, y: sprite.scale.y }
      const distance = { x: Math.abs(sprite.x - destination.x), y: Math.abs(sprite.y - destination.y) }

      const speed = 0.05 * scale;

      const event = (delta: number) => {
        const move = speed * delta

        if (sprite.x > destination.x) {
          sprite.x = Math.max(sprite.x - move, destination.x)
        } else if (sprite.x < destination.x) {
          sprite.x = Math.min(sprite.x + move, destination.x)
        }

        if (sprite.y > destination.y) {
          sprite.y = Math.max(sprite.y - move, destination.y)
        } else if (sprite.y < destination.y) {
          sprite.y = Math.min(sprite.y + move, destination.y)
        }

        if (is_jump) {
          sprite.scale.x = original_scale.x + Math.abs(Math.abs((distance.x / 2) / scale - Math.abs(sprite.x - destination.x) / scale))
          sprite.scale.y = original_scale.y + Math.abs(Math.abs((distance.y / 2) / scale - Math.abs(sprite.y - destination.y) / scale))
        }

        if (sprite.x == destination.x && sprite.y == destination.y) {
          sprite.scale.x = original_scale.x
          sprite.scale.y = original_scale.y

          resolve();
          this.app.ticker.remove(event);
        }
      }

      this.app.ticker.add(event);
    });
  }

  generateSprite(tile_settings: TileSettings) {
    const alternative = this.chooseAlternative(tile_settings.textures);
    const textures = alternative.frames.map(path => {
      const texture = PIXI.Texture.from(path);
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST

      return texture
    });

    const sprite = new PIXI.AnimatedSprite(textures)

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

  public async run(code: string) {
    if (this.socket) {
      this.socket.disconnect();
    }

    await this.queue.clear();

    this.socket = this.wsService.connect('/matchmaking', { test: "true", code, language: 'js' }, {
      reconnection: false,
    })

    let map: Tilemap = null;

    this.socket.on('match found', async (data: { map: Tilemap, opponent_username: string, username: string }) => {
      map = data.map;
      map.layers.units = Array(map.square_size ** 2).fill(null);

      console.log(map)

      await this.loadGame(map);
      this.queue.start();
    });

    this.socket.on('spawn', (data) => {
      console.log('spawn:', data)

      this.queue.add(async () => {
        await this.handleActions(map, data.actions)
      });
    });

    this.socket.on('round actions', (data) => {
      console.log('round:', data)

      this.queue.add(async () => {
        await this.handleActions(map, data.actions)
      });
    });

    this.socket.on('end test phase', (data) => {
      console.log("test ended")
    });
  }

  async handleActions(map: Tilemap, actions: Action[]) {
    for (const action of actions) {
      await this.handleAction(map, action);
    }
  }

  async handleAction(map: Tilemap, action: Action) {
    const { name } = action

    await this.handleEvents(map, action);

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

      const origin = position.x + (position.y * map.square_size);
      const destination = action.new_position.x + (action.new_position.y * map.square_size);

      map.layers.units[destination] = unit

      if (destination !== origin) {
        map.layers.units[origin] = null
      }

      const scale = this.canvas_size / map.square_size;
      await this.moveSprite(unit.sprite, scale, position.x, position.y);
    } else if (name == 'jump') {
      const { unit, position } = this.findUnit(map, action.robot_id);

      const origin = position.x + (position.y * map.square_size);
      const destination = action.new_position.x + (action.new_position.y * map.square_size);

      map.layers.units[destination] = unit

      if (destination !== origin) {
        map.layers.units[origin] = null
      }

      const scale = this.canvas_size / map.square_size;
      await this.moveSprite(unit.sprite, scale, position.x, position.y, true);
    } else if (name === 'turn-right' || name === 'turn-left') {
      const { unit } = this.findUnit(map, action.robot_id);

      switch (action.new_orientation) {
        case "up":
          unit.sprite.angle = 270;
          break;
        case "right":
          unit.sprite.angle = 0;
          break;
        case "down":
          unit.sprite.angle = 90;
          break;
        case "left":
          unit.sprite.angle = 180;
          break;
      }
    }

    await sleep(500)
  }

  async handleEvents(map: Tilemap, action: Action) {
    if (action.events) {
      for (const event of action.events) {
        if (event.name === 'bumped') {
          console.log('BUMPED')
        }
      }
    }
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

    return { unit, position };
  }
}
