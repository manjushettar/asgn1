class Heart {
    constructor() {
        this.type = 'heart';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 50;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var r = size / 800.0;

        let angleStep = Math.PI / this.segments;
        for (var angle = 0; angle < Math.PI * 2; angle += angleStep) {
            let theta = angle;
            let x = r * (16 * Math.pow(Math.sin(theta), 3));
            let y = r * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));

            let nextTheta = angle + angleStep;
            let nextX = r * (16 * Math.pow(Math.sin(nextTheta), 3));
            let nextY = r * (13 * Math.cos(nextTheta) - 5 * Math.cos(2 * nextTheta) - 2 * Math.cos(3 * nextTheta) - Math.cos(4 * nextTheta));

            drawTriangle([xy[0], xy[1], xy[0] + x, xy[1] + y, xy[0] + nextX, xy[1] + nextY]);
        }
    }
}