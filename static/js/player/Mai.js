import { Player } from "./base.js";
import { GIF } from "../utils/gif.js";

export class Mai extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animation();
    }

    init_animation() {
        let outer = this;
        let offset_y = [18, -4, -4, -122, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/player/mai/${i}.gif`);
            // console.log(`/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0, // 总帧数
                frame_rate: 5, // 每5帧一次
                offset_y: offset_y[i], // y方向偏移量
                loaded: false, //是否加载完成
                scale: 2, // 放大多少倍
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i === 3) {
                    obj.frame_rate = 4;
                }
            }
        }

    }

}