import { GameObject } from "../game_object/base.js";

export class Player extends GameObject {
    constructor(root, info) {
        super();

        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = info.direction;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; // 水平初速度
        this.speedy = -1000; // 跳起的初速度

        this.gravity = 50;

        this.root = root;
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;


        this.staus = 3; // 0:静止不动 ， 1： 向前， 2：向后 ， 3：跳跃 ， 4：攻击 ， 5：被攻击 ， 6：死亡
    }

    start() {

    }

    update_move() {
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            this.staus = 0;
        }
    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        if (this.staus === 0 || this.staus === 1) {
            if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.staus = 3;
            } else if (d) {
                this.vx = this.speedx;
                this.staus = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.staus = 1; // 前进，后退状态合并为1
            } else {
                this.vx = 0;
                this.vy = 0;
                this.staus = 0;
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();


        this.render();
    }

    render() {
        this.ctx.clearRect(this.x, this.y, this.width, this.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}