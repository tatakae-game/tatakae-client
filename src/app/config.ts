import { ENV } from 'pixi.js';
import { env } from 'process';

export default {
    api_url: env.API_URL || 'http://localhost:3000'
}
