class Star {
    constructor() {
        this.type = 'star';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 5;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var outerRadius = size / 200.0;
        var innerRadius = outerRadius / 2.5;

        let angleStep = Math.PI / this.segments;
        for (var angle = 0; angle < Math.PI * 2; angle += angleStep) {
            let centerPt = [xy[0], xy[1]];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius];
            let vec2 = [Math.cos(angle2) * outerRadius, Math.sin(angle2) * outerRadius];
            let pt1 = [centerPt[0] + vec1[0], centerPt[1] + vec1[1]];
            let pt2 = [centerPt[0] + vec2[0], centerPt[1] + vec2[1]];

            let midAngle = (angle1 + angle2) / 2;
            let midVec = [Math.cos(midAngle) * innerRadius, Math.sin(midAngle) * innerRadius];
            let midPt = [centerPt[0] + midVec[0], centerPt[1] + midVec[1]];

            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], midPt[0], midPt[1]]);
            drawTriangle([xy[0], xy[1], midPt[0], midPt[1], pt2[0], pt2[1]]);
        }
    }
}