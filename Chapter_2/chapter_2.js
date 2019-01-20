// these are only used for this scene.
let x1 = [10, -10, -10, 10, 20, -30, 5, -5];
let x2 = [10, 20, -10, 30, 5, 10, -20, -5];
let y = [20, 15, 0, 10, 10, -5, -15, 10];

// the plane used to show multiple regression on 2 independent variables
// reference: https://www.socscistatistics.com/tests/multipleregression/Default.aspx
class MR_Plane extends Axes3D {
    constructor(ctx, args) {
        super(ctx, args);
        this.n = x1.length;
        this.step = 10;

        let ax1 = this.avg(x1);
        let ax2 = this.avg(x2);
        let ay = this.avg(y);

        let ssx1 = this.dot(x1, x1, ax1, ax1);
        let ssx2 = this.dot(x2, x2, ax2, ax2);
        let spx1y = this.dot(x1, y, ax1, ay);
        let spx2y = this.dot(x2, y, ax2, ay);
        let spx1x2 = this.dot(x1, x2, ax1, ax2);
        let denom = (ssx1 * ssx2 - spx1x2 * spx1x2);
        let b1 = (spx1y * ssx2 - spx1x2 * spx2y) / denom;
        let b2 = (spx2y * ssx1 - spx1x2 * spx1y) / denom;
        let b0 = ay - b1 * ax1 - b2 * ax2;
        //console.log(ax1, ax2, ay, ssx1, ssx2, spx1y, spx2y, spx1x2, b1, b2, b0, denom);

        this.plane = new Plane3D(this.s, {
            mat: [1, 1, 1, b1, b2, b0 * this.step],
            color: this.s.color(27, 157, 237, 167)
        })
    }

    avg(x) { // I know method can be static... (MR_Plane.dot(...))
        let s = 0;
        for (let i = 0; i < x.length; i++)
            s += x[i];
        return s / x.length;
    }

    dot(x, y, avgX, avgY) {
        let s = 0;
        for (let i = 0; i < x.length; i++) {
            s += (x[i] - avgX) * (y[i] - avgY);
        }
        return s;
    }

    showPlane(g) {
        this.show(g);
        // show the points
        for (let i = 0; i < this.n; i++) {
            g.push();
            g.translate(x1[i] * this.step, -y[i] * this.step, x2[i] * this.step);
            g.stroke(247, 77, 7);
            g.strokeWeight(2);
            g.fill(197, 197, 17);
            g.rotateX(this.s.frameCount / 17);
            g.rotateY(this.s.frameCount / 27);
            g.box(27);
            g.pop();
        }
        this.plane.showPlane(g);
    }
}

function Chap2(s) {
    let axes;
    let obj;
    let kat;

    s.preload = function () {
        obj = s.loadModel('../lib/obj/axes.obj');
    };

    s.setup = function () {
        s.frameRate(fr);

        s.pixelDensity(1);
        s.createCanvas(cvw, cvh);
        g3 = s.createGraphics(cvw * 2, cvh * 2, s.WEBGL);  // a square to be displayed to the left
        g2 = s.createGraphics(100, 10);

        axes = new MR_Plane(s, {
            model: obj,
            angle: 1.7
        });
        kat = new KatexTxt(s, {
            text: "\\hat{y} = \\hat{\\beta_0} + \\hat{\\beta_1}x_1 + \\hat{\\beta_2}x_2",
            x: 50,
            y: 20
        })
    };

    s.draw = function () {
        s.background(0);
        axes.showPlane(g3);
        s.image(g3, 0, 0, cvw, cvh);
        //showFR(g2);
        kat.show();
    }
}

new p5(Chap2);
