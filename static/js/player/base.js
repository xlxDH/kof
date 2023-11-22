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
        this.speedy = -1200; // 跳起的初速度

        this.gravity = 50;

        this.root = root;
        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;


        this.staus = 3; // 0:静止不动 ， 1： 向前， 2：向后 ， 3：跳跃 ， 4：攻击 ， 5：被攻击 ， 6：死亡
        this.animations = new Map();
        this.frame_current_cnt = 0;

        this.hp = 100;
        this.$hp1 = this.root.$kof.find(`.kof-head-hp-${this.id}>div>div`);
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
    }

    start() {

    }

    update_move() {

        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        let [a, b] = this.root.players;

        if (a !== this) [a, b] = [b, a];
        let r1 = {
            x1: a.x,
            y1: a.y,
            x2: a.x + a.width,
            y2: a.y + a.height,
        }
        let r2 = {
            x1: b.x,
            y1: b.y,
            x2: b.x + b.width,
            y2: b.y + b.height,
        }
        if (this.is_collision(r1, r2)) {
            if (a.x == 0 || a.x == 1280 - a.width || b.x == 0 || b.x === 1280 - b.width) {
                this.x -= this.vx * this.timedelta / 1000;
                this.y -= this.vy * this.timedelta / 1000;
            } else {
                b.x += this.vx * this.timedelta / 1000 / 2;
                b.y += this.vy * this.timedelta / 1000 / 2;
                a.x -= this.vx * this.timedelta / 1000 / 2;
                a.y -= this.vy * this.timedelta / 1000 / 2;
            }
            if (this.is_collision(r1, r2)) {
                this.x -= this.vx * this.timedelta / 1000;
                this.y -= this.vy * this.timedelta / 1000;
                this.vx = 0;
                this.vy = 0;
            }

            if (this.staus === 3)
                this.staus = 0;
        }

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.staus === 3)
                this.staus = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
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

        if ((this.staus === 0 || this.staus === 1) && this.y == 450) {
            if (space) {
                this.staus = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.staus = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.staus = 1;
            } else if (a) {
                this.vx = -1 * this.speedx;
                this.staus = 1; // 前进，后退状态合并为1
            } else {
                this.vx = 0;
                this.staus = 0;
            }
        }
    }

    update_direction() {
        if (this.staus === 6) return;

        let players = this.root.players;
        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {
        if (this.staus === 6) return;

        this.staus = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 10, 0);

        this.$hp1.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 500);

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);

        //this.$hp.width(this.$hp.parent().width() * this.hp / 100);

        if (this.hp <= 0) {
            this.staus = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.staus === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - this.id];
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 40,
                    x2: me.x + 120 + 100,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x + me.width - 120 - 100,
                    y1: me.y + 40,
                    x2: me.x + me.width - 120,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };

            if (this.is_collision(r1, r2)) {
                you.is_attack();
            }
        }
    }


    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();




        this.render();
    }

    render() {
        // this.ctx.clearRect(this.x, this.y, this.width, this.height);
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        let staus = this.staus;

        if (this.staus === 1 && this.direction * this.vx < 0) staus = 2;
        // if (this.staus != 0) console.log(staus);
        let obj = this.animations.get(staus);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();

            }
        }


        if (staus === 4 || staus === 5 || staus === 6) {
            if (this.frame_current_cnt == obj.frame_rate * (obj.frame_cnt - 1)) {
                if (staus === 6) {
                    this.frame_current_cnt--;
                } else {
                    this.staus = 0;
                }
            }
        }

        this.frame_current_cnt++;
    }
}