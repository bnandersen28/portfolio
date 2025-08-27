let t = 0;
let stars = [];

function setup() {
    let cnv = createCanvas(windowWidth, windowHeight);
    cnv.parent("home");
    noStroke();

    // Pre-generate star positions
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: random(width),
            y: random(height * 0.8), // avoid bottom ground
            size: random(1, 3),
            twinkleSpeed: random(0.002, 0.01),
            phase: random(TWO_PI)
        });
    }

}

function draw() {
    // Gradient sky (day -> night)
    let sunriseColor = color(252, 128, 3);//orange
    let morningColor = color(135, 206, 235); //skyblue
    let sunsetColor = color(128, 0, 128); //purple
    let nightColor = color(20, 24, 82); //deep navy
    
    
    let cycle = t%1;
    let bg;

    //change color based on point in cycle
    if(cycle < 0.25){
        //Sunrise
        let amt = map(cycle, 0, 0.25, 0, 1);
        bg = lerpColor(sunriseColor, morningColor, amt);
    }else if(cycle < 0.5){
        //Daytime
        let amt= map(cycle, 0.25, 0.5, 0, 1);
        bg = lerpColor(morningColor, morningColor,amt)
    }else if (cycle < 0.75){
        //nightime
        let amt =map(cycle, 0.5, 0.75, 0, 1);
        bg = lerpColor(morningColor, sunsetColor, amt);
    }else if (cycle , 0.95){
        let amt = map(cycle, 0.75, 0.95, 0, 1);
        bg = lerpColor(sunsetColor, nightColor, amt);
    }else{
        let amt = map(cycle, 0.95, 1, 0, 1);
        bg = lerpColor(nightColor, sunriseColor, amt);
    }
    background(bg);

    //Night factor for fading stars/clouds
    let nightFactor = 0;
    if(cycle > 0.75){
        nightFactor = map(cycle, 0.75, 1, 0, 1);
    } else if (cycle < 0.05){
        nightFactor = map(cycle, 0, 0.05, 1, 0);
    }

    //Ensure stars and clouds are behind mountains
    if(nightFactor > 0){
        drawStars(nightFactor);
        drawClouds(nightFactor);
    }

    // Mountains
    fill(50);
    beginShape();
    vertex(0, height * 0.9);
    vertex(width * 0.25, height * 0.6);
    vertex(width * 0.5, height * 0.9);
    endShape(CLOSE);

    fill(70);
    beginShape();
    vertex(width * 0.3, height * 0.9);
    vertex(width * 0.6, height * 0.65);
    vertex(width, height * 0.9);
    endShape(CLOSE);

    // Grass strip (bottom of screen)


    let grassTop = height * 0.9;   // where grass starts
    let grassBottom = height;  

    fill(152, 251, 152);
    rect(0, grassTop, width, height * 0.1);

    // Grass lines (to mimic blades/texture)
    stroke(120, 200, 120);   // slightly darker green
    strokeWeight(2);
    // bottom of canvas

    for (let x = 0; x < width; x += 10) {   // space between lines
        let bladeHeight = random(5, 20);     // variable blade lengths
        line(x, grassTop, x, grassTop + bladeHeight);
    }

    // reset stroke so it doesn’t affect mountains/sun
    noStroke();


    //Daytime
    let angle = map(cycle, 0, 0.75, PI, TWO_PI);
    let sx = map(cos(angle), -1, 1, 100, width - 100);
    let sy = map(sin(angle), 0, -1, height - 250, 100);

    if(cycle < 0.75){
        fill(255,200,0);
        ellipse(sx, sy, 80, 80);

        //Glowing rings around sun
        noFill();
        for (let r=100; r<=220; r+=30){
            stroke(255,200, 0, 120-r/2);
            ellipse(sx, sy, r, r);
        }
        noStroke();
    }
    t+=0.001;
}

function drawStars(nightFactor){
    for(let s of stars){
        let alpha = map(sin(frameCount * s.twinkleSpeed + s.phase), 
        -1, 1, 
        50, 180) * nightFactor;
        
        fill(255, 255, 255, alpha);
        ellipse(s.x, s.y, s.size, s.size);

        //soft glow 
        fill(255, 255, 255, alpha/3);
        ellipse(s.x, s.y, s.size * 2, s.size * 2);
    }
}

function drawClouds(nightFactor){
    fill(255, 255, 255, 40 * nightFactor);
    noStroke();

    //drifting groups
    let cloudX1 = (frameCount * 0.2) % (width + 200) - 200;
    let cloudX2 = (frameCount * 0.15) % (width + 200) - 200;

    drawCloud(cloudX1, height * 0.25);
    drawCloud(cloudX2, height * 0.35);
}

function drawCloud(x,y){
    ellipse(x, y, 120, 60);
    ellipse(x + 40, y + 10, 100, 50);
    ellipse(x - 40, y + 10, 100, 50);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
