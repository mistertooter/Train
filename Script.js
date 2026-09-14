const canvas =
    document.getElementById("tunnelCanvas");

const ctx =
    canvas.getContext("2d");

let W;
let H;

let centerX;
let horizonY;

let time = 0;


/* =========================================
   RESIZE
========================================= */

function resize() {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    W = rect.width;
    H = rect.height;

    centerX = W / 2;

    /*
       Vanishing point.

       Raising or lowering this value
       dramatically changes the perspective.
    */

    horizonY = H * 0.39;
}


window.addEventListener(
    "resize",
    resize
);

resize();


/* =========================================
   BACKGROUND
========================================= */

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        "#07131d"
    );

    gradient.addColorStop(
        0.38,
        "#061d2b"
    );

    gradient.addColorStop(
        0.55,
        "#08121a"
    );

    gradient.addColorStop(
        1,
        "#010305"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


/* =========================================
   TUNNEL WALL
========================================= */

function drawTunnel() {

    ctx.save();

    /*
       Tunnel interior gradient
    */

    const tunnelGradient =
        ctx.createRadialGradient(
            centerX,
            horizonY,
            10,

            centerX,
            horizonY,
            W * 0.65
        );

    tunnelGradient.addColorStop(
        0,
        "#193e4d"
    );

    tunnelGradient.addColorStop(
        0.35,
        "#09212c"
    );

    tunnelGradient.addColorStop(
        0.75,
        "#071017"
    );

    tunnelGradient.addColorStop(
        1,
        "#010203"
    );

    ctx.fillStyle =
        tunnelGradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
       Tunnel arch
    */

    ctx.beginPath();

    ctx.moveTo(
        W * 0.04,
        H
    );

    ctx.lineTo(
        W * 0.04,
        H * 0.42
    );

    ctx.bezierCurveTo(
        W * 0.04,
        H * 0.05,

        W * 0.96,
        H * 0.05,

        W * 0.96,
        H * 0.42
    );

    ctx.lineTo(
        W * 0.96,
        H
    );

    ctx.strokeStyle =
        "rgba(70,180,220,.3)";

    ctx.lineWidth = 4;

    ctx.stroke();


    /*
       Perspective rays
    */

    const rays = 22;

    for (
        let i = 0;
        i <= rays;
        i++
    ) {

        const x =
            (i / rays) * W;

        ctx.beginPath();

        ctx.moveTo(
            centerX,
            horizonY
        );

        ctx.lineTo(
            x,
            H
        );

        ctx.strokeStyle =
            `rgba(
                15,
                150,
                210,
                ${0.04 + (i % 2) * 0.025}
            )`;

        ctx.lineWidth = 1;

        ctx.stroke();
    }

    ctx.restore();
}


/* =========================================
   TUNNEL RINGS
========================================= */

function drawTunnelRings() {

    const ringCount = 19;

    /*
       Moving offset creates illusion
       that the camera is moving forward.
    */

    const offset =
        (time * 0.006) % 1;

    for (
        let i = 0;
        i < ringCount;
        i++
    ) {

        let z =
            (i + offset) /
            ringCount;

        /*
           Exponential perspective curve
        */

        let depth =
            z * z;

        const width =
            20 +
            depth *
            W *
            1.15;

        const height =
            18 +
            depth *
            H *
            1.18;

        const alpha =
            0.12 +
            depth * 0.35;


        ctx.beginPath();

        ctx.ellipse(
            centerX,
            horizonY +
                depth *
                H *
                0.25,

            width / 2,
            height / 2,

            0,
            Math.PI,
            Math.PI * 2
        );


        ctx.strokeStyle =
            `rgba(
                75,
                205,
                255,
                ${alpha}
            )`;

        ctx.lineWidth =
            1 + depth * 4;

        ctx.stroke();


        /*
           Side walls
        */

        const floorY =
            horizonY +
            depth *
            H *
            0.68;

        const leftX =
            centerX -
            depth *
            W *
            0.54;

        const rightX =
            centerX +
            depth *
            W *
            0.54;


        ctx.beginPath();

        ctx.moveTo(
            leftX,
            floorY
        );

        ctx.lineTo(
            rightX,
            floorY
        );

        ctx.strokeStyle =
            `rgba(
                70,
                180,
                210,
                ${alpha * 0.7}
            )`;

        ctx.lineWidth =
            1 + depth * 2;

        ctx.stroke();
    }
}


/* =========================================
   TRACKS
========================================= */

function drawTracks() {

    /*
       Four perspective rail lines
    */

    const rails = [
        -0.32,
        -0.13,
         0.13,
         0.32
    ];

    rails.forEach(
        (position, index) => {

            const bottomX =
                centerX +
                W * position;

            ctx.beginPath();

            ctx.moveTo(
                centerX +
                position * 8,
                horizonY
            );

            ctx.lineTo(
                bottomX,
                H
            );

            ctx.strokeStyle =
                index === 1 ||
                index === 2
                    ? "#c1d7df"
                    : "#566d78";

            ctx.lineWidth =
                index === 1 ||
                index === 2
                    ? 5
                    : 3;

            ctx.shadowBlur = 8;

            ctx.shadowColor =
                "#74ddff";

            ctx.stroke();

            ctx.shadowBlur = 0;
        }
    );


    /*
       Railway sleepers
    */

    const sleepers = 36;

    const offset =
        (time * 0.012) % 1;

    for (
        let i = 0;
        i < sleepers;
        i++
    ) {

        let z =
            (i + offset) /
            sleepers;

        let perspective =
            z * z;

        const y =
            horizonY +
            perspective *
            (H - horizonY);

        const halfWidth =
            8 +
            perspective *
            W *
            0.38;

        ctx.beginPath();

        ctx.moveTo(
            centerX - halfWidth,
            y
        );

        ctx.lineTo(
            centerX + halfWidth,
            y
        );

        ctx.strokeStyle =
            `rgba(
                160,
                115,
                65,
                ${0.25 + perspective * 0.7}
            )`;

        ctx.lineWidth =
            1 +
            perspective * 8;

        ctx.stroke();
    }
}


/* =========================================
   SIDE LIGHTS
========================================= */

function drawLights() {

    const count = 14;

    for (
        let side of [-1, 1]
    ) {

        for (
            let i = 0;
            i < count;
            i++
        ) {

            let z =
                ((i / count) +
                time * 0.0008) % 1;

            let depth =
                z * z;

            const x =
                centerX +
                side *
                (
                    18 +
                    depth *
                    W *
                    0.46
                );

            const y =
                horizonY +
                depth *
                H *
                0.45;

            const size =
                1 +
                depth * 8;


            const gradient =
                ctx.createRadialGradient(
                    x,
                    y,
                    0,

                    x,
                    y,
                    size * 4
                );

            gradient.addColorStop(
                0,
                "rgba(255,190,70,1)"
            );

            gradient.addColorStop(
                0.2,
                "rgba(255,100,20,.8)"
            );

            gradient.addColorStop(
                1,
                "rgba(255,60,0,0)"
            );

            ctx.fillStyle =
                gradient;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                size * 4,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#ffe08a";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                size,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }
}


/* =========================================
   TRAIN
========================================= */

function drawTrain() {

    /*
       Train slowly approaches
       and then resets.
    */

    const cycle =
        (time * 0.00014) % 1;

    const approach =
        0.15 +
        Math.pow(
            cycle,
            2
        ) * 0.63;


    const trainW =
        W *
        (
            0.09 +
            approach * 0.40
        );

    const trainH =
        trainW * 1.05;

    const x =
        centerX -
        trainW / 2;

    const y =
        horizonY -
        trainH * 0.15 +
        approach *
        H *
        0.44;


    /*
       Shadow underneath train
    */

    const shadow =
        ctx.createRadialGradient(
            centerX,
            y + trainH,
            0,

            centerX,
            y + trainH,
            trainW
        );

    shadow.addColorStop(
        0,
        "rgba(0,0,0,.8)"
    );

    shadow.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        shadow;

    ctx.fillRect(
        centerX - trainW,
        y + trainH * 0.7,
        trainW * 2,
        trainH
    );


    /*
       Train body
    */

    const body =
        ctx.createLinearGradient(
            x,
            0,
            x + trainW,
            0
        );

    body.addColorStop(
        0,
        "#17232c"
    );

    body.addColorStop(
        0.2,
        "#55727f"
    );

    body.addColorStop(
        0.47,
        "#d2e4e9"
    );

    body.addColorStop(
        0.65,
        "#536d78"
    );

    body.addColorStop(
        1,
        "#131d23"
    );


    ctx.beginPath();

    ctx.moveTo(
        x + trainW * 0.16,
        y
    );

    ctx.lineTo(
        x + trainW * 0.84,
        y
    );

    ctx.quadraticCurveTo(
        x + trainW,
        y + trainH * 0.12,

        x + trainW,
        y + trainH * 0.34
    );

    ctx.lineTo(
        x + trainW * 0.92,
        y + trainH
    );

    ctx.lineTo(
        x + trainW * 0.08,
        y + trainH
    );

    ctx.lineTo(
        x,
        y + trainH * 0.34
    );

    ctx.quadraticCurveTo(
        x,
        y + trainH * 0.12,

        x + trainW * 0.16,
        y
    );

    ctx.fillStyle =
        body;

    ctx.fill();


    /*
       Red accent stripe
    */

    ctx.fillStyle =
        "#cf322e";

    ctx.fillRect(
        x + trainW * 0.07,
        y + trainH * 0.56,

        trainW * 0.86,
        trainH * 0.09
    );


    /*
       Windshield
    */

    const windowGradient =
        ctx.createLinearGradient(
            0,
            y,
            0,
            y + trainH * 0.4
        );

    windowGradient.addColorStop(
        0,
        "#163c54"
    );

    windowGradient.addColorStop(
        1,
        "#020b12"
    );


    ctx.fillStyle =
        windowGradient;

    ctx.beginPath();

    ctx.moveTo(
        x + trainW * 0.19,
        y + trainH * 0.12
    );

    ctx.lineTo(
        x + trainW * 0.81,
        y + trainH * 0.12
    );

    ctx.lineTo(
        x + trainW * 0.73,
        y + trainH * 0.42
    );

    ctx.lineTo(
        x + trainW * 0.27,
        y + trainH * 0.42
    );

    ctx.closePath();

    ctx.fill();


    /*
       Window reflection
    */

    ctx.strokeStyle =
        "rgba(120,220,255,.35)";

    ctx.lineWidth =
        Math.max(
            1,
            trainW * 0.012
        );

    ctx.beginPath();

    ctx.moveTo(
        x + trainW * 0.30,
        y + trainH * 0.15
    );

    ctx.lineTo(
        x + trainW * 0.42,
        y + trainH * 0.39
    );

    ctx.stroke();


    /*
       Headlights
    */

    drawHeadlight(
        x + trainW * 0.22,
        y + trainH * 0.72,
        trainW * 0.05
    );

    drawHeadlight(
        x + trainW * 0.78,
        y + trainH * 0.72,
        trainW * 0.05
    );


    /*
       Center number
    */

    ctx.fillStyle =
        "#e4eced";

    ctx.font =
        `bold ${Math.max(
            8,
            trainW * 0.08
        )}px monospace`;

    ctx.textAlign =
        "center";

    ctx.fillText(
        "EXPRESS",
        centerX,
        y + trainH * 0.55
    );
}


/* =========================================
   HEADLIGHT
========================================= */

function drawHeadlight(
    x,
    y,
    radius
) {

    const glow =
        ctx.createRadialGradient(
            x,
            y,
            0,

            x,
            y,
            radius * 6
        );

    glow.addColorStop(
        0,
        "#ffffff"
    );

    glow.addColorStop(
        0.15,
        "#fff7c2"
    );

    glow.addColorStop(
        0.45,
        "rgba(255,190,60,.6)"
    );

    glow.addColorStop(
        1,
        "rgba(255,180,30,0)"
    );


    ctx.fillStyle =
        glow;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius * 6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#fffbdc";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


/* =========================================
   VANISHING POINT
========================================= */

function drawVanishingPoint() {

    ctx.save();

    ctx.strokeStyle =
        "rgba(75,225,255,.65)";

    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.moveTo(
        centerX - 12,
        horizonY
    );

    ctx.lineTo(
        centerX + 12,
        horizonY
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        centerX,
        horizonY - 12
    );

    ctx.lineTo(
        centerX,
        horizonY + 12
    );

    ctx.stroke();


    ctx.fillStyle =
        "#7cf0ff";

    ctx.beginPath();

    ctx.arc(
        centerX,
        horizonY,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* =========================================
   ATMOSPHERE
========================================= */

function drawAtmosphere() {

    /*
       Fog at tunnel opening
    */

    const fog =
        ctx.createRadialGradient(
            centerX,
            horizonY,
            0,

            centerX,
            horizonY,
            W * 0.28
        );

    fog.addColorStop(
        0,
        "rgba(80,200,220,.12)"
    );

    fog.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle =
        fog;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /*
       Vignette
    */

    const vignette =
        ctx.createRadialGradient(
            centerX,
            H * 0.48,
            W * 0.1,

            centerX,
            H * 0.48,
            W * 0.8
        );

    vignette.addColorStop(
        0,
        "rgba(0,0,0,0)"
    );

    vignette.addColorStop(
        0.72,
        "rgba(0,0,0,.12)"
    );

    vignette.addColorStop(
        1,
        "rgba(0,0,0,.85)"
    );

    ctx.fillStyle =
        vignette;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );
}


/* =========================================
   ANIMATION
========================================= */

function animate(timestamp) {

    time = timestamp;

    ctx.clearRect(
        0,
        0,
        W,
        H
    );


    drawBackground();

    drawTunnel();

    drawTunnelRings();

    drawLights();

    drawTracks();

    drawTrain();

    drawVanishingPoint();

    drawAtmosphere();


    requestAnimationFrame(
        animate
    );
}


requestAnimationFrame(
    animate
);