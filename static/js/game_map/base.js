import { GameObject } from '../game_object/base.js';
import { Controller } from '../controller/base.js';

export class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));

        this.root.$kof.append($(`<div class="kof-gameover" id="go">
        <div>GameOver</div>
    </div>`));


        this.timeleft = 60000;
        this.$timer = this.root.$kof.find('.kof-head-timer');
        this.$gameover = this.root.$kof.find('.kof-gameover>div');
    }

    start() {

    }

    update() {
        let [a, b] = this.root.players;

        if (a.staus !== 6 && b.staus !== 6)
            this.timeleft -= this.timedelta;

        if (this.timeleft < 0) {
            this.timeleft = 0;


            if (a.staus !== 6 && b.staus !== 6) {
                a.staus = 6;
                b.staus = 6;
                a.frame_current_cnt = 0;
                b.frame_current_cnt = 0;
            }
        }

        if (a.staus === 6 || b.staus === 6) {
            document.getElementById("go").style.color = "white";
        }

        this.$timer.text(parseInt(this.timeleft / 1000));

        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.$canvas.width(), this.$canvas.height());
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }

}