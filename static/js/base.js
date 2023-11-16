import { GameMap } from './game_map/base.js';
import { Kyo } from './player/Kyo.js';
import { Mai } from './player/Mai.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);

        this.game_map = new GameMap(this);
        this.players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                direction: 1,
                color: 'blue',
            }),
            new Mai(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                direction: -1,
                color: 'red',
            }),

        ];
    }
}

export {
    KOF
}