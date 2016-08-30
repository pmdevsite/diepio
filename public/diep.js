var sketchProc = function(processingInstance) {
    with(processingInstance) {
        size(window.innerWidth, window.innerHeight);

        frameRate(60); //Set The Frame Rate
        textAlign(CENTER, CENTER);
        var l = function() {
            return this.Function("gflink", "var f=document.createElement('link');f.setAttribute('rel','stylesheet');f.setAttribute('type','text/css');f.setAttribute('href',gflink);document.head.appendChild(f);");
        }();
        l("/fonts/ubuntu.css");
        textFont(createFont("Ubuntu"));
        var startMS = millis();
        var lastMS = 0;

        var playing = false;
        var gameMode = "FFA";

        var leaderboard = [];

        var hideGrid = false;

        /** Colors **/
        var colors = {
            square: color(255,232,105),
            triangle: color(252,118,119),
            pentagon: color(118,141,252),
            tank_red: color(241,78,84),
            tank_blue: color(0,178,225),
            tank_green: color(76,233,153),
            tank_purple: color(191,127,245),
            tank_barrel: color(153,153,153)
        };

        /** Outline Text **/
        var textOutline = function(t, x, y, w, h, fc, sc, o) {
            fill(sc);
            o = max(o, 1);
            for (var a = 0; a < 360; a += 360 / (2 * PI * o)) {
                if (w > 0 && h > 0) {
                    text(t, x + cos(a) * o, y + sin(a) * o, w, h);
                } else {
                    text(t, x + cos(a) * o, y + sin(a) * o);
                }
            }
            fill(fc);
            if (w > 0 && h > 0) {
                text(t, x, y, w, h);
            } else {
                text(t, x, y);
            }
        };

        /** World **/
        var world = {
            w: 6000, //World Width
            h: 6000, //World Height
            minimumSquares: 75, //Minimum Amount Of Squares
            minimumTriangles: 50, //Minimum Amount Of Triangles
            minimumPentagons: 10, //Minimum Amount Of Pentagons
            maxSquares: 175, //Maximum Amount Of Squares
            maxTriangles: 125, //Maximum Amount Of Triangles
            maxPentagons: 75, //Maximum Amount Of Pentagons
        };

        /** Level Stuff **/
        var levels = {
          /*2:
            3:
            4:
            5:
            6:
            7:
            8:
            9:
            10:
            11:
            12:
            13:
            14:
            15:
            16:
            17:
            18:
            19:
            20:
            21:
            22:
            23:
            24:
            25:
            26:
            27:
            28:
            29:
            30:
            31:
            32:
            33:
            34:
            35:
            36:
            37:
            38:
            39:
            40:
            41:
            42:
            43:
            44:
            45: */
        };

        /** Bullets **/
        var bullets = [];
        var Bullet = function(position, velocity, speed, diameter, damage, defence) {
            this.pos = position;
            this.velocity = velocity;
            this.speed = speed;
            this.velocity.mult(this.speed);
            this.d = diameter;
            this.defence=defence;
            this.damage=damage;
        };
        Bullet.prototype.run = function() {
            this.display();
            this.update();
        };
        Bullet.prototype.display = function() {
            stroke(85);
            strokeWeight(2.5);
            fill(241, 78, 84);
            ellipse(this.pos.x, this.pos.y, this.d, this.d);
        };
        Bullet.prototype.update = function() {
            this.pos.add(this.velocity);
        };

        /** Enemies **/
        var squares = [];
        var triangles = [];
        var pentagons = [];

        var Square = function(x, y) {
            this.pos = new PVector(x, y); //Its Position
            this.r = random(0, 360); //Its Starting Rotation
            this.d = 35; //Its Diameter
            this.s = 0.25;
            this.velocity = new PVector(random(-this.s,this.s),random(-this.s,this.s));

            this.defence=2;
            this.damage=1;

            this.v = 10; //Its Value
        };
        Square.prototype.run = function() {
            this.display();
            this.update();
        };
        Square.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.square);
            rect(-this.d / 2, -this.d / 2, this.d, this.d);
            popMatrix();
        };
        Square.prototype.update = function() {
            this.r += random(0.025);
            this.velocity.x = constrain(this.velocity.x, -this.s,this.s);
            this.velocity.y = constrain(this.velocity.y, -this.s,this.s);
            this.pos.add(this.velocity);
            this.pos.x = constrain(this.pos.x, 0, world.w);
            this.pos.y = constrain(this.pos.y, 0, world.h);
        };
        while (squares.length < world.maxSquares) {
            squares.push(new Square(random(0, world.w), random(0, world.h)));
        }

        var Triangle = function(x, y) {
            this.pos = new PVector(x, y); //Its Position
            this.r = random(0, 360); //Its Starting Position
            this.d = 20; //Its Diameter
            this.s = 0.25;
            this.velocity = new PVector(random(-this.s,this.s),random(-this.s,this.s));

            this.defence=4;
            this.damage=2;

            this.v = 25; //Its Value
        };
        Triangle.prototype.run = function() {
            this.display();
            this.update();
        };
        Triangle.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.triangle);
            triangle(0, 0 - this.d / 1.25, 0 - this.d, 0 + this.d, 0 + this.d, 0 + this.d);
            popMatrix();
        };
        Triangle.prototype.update = function() {
            this.r += random(0.025);
            this.velocity.x = constrain(this.velocity.x, -this.s,this.s);
            this.velocity.y = constrain(this.velocity.y, -this.s,this.s);
            this.pos.add(this.velocity);
            this.pos.x = constrain(this.pos.x, 0, world.w);
            this.pos.y = constrain(this.pos.y, 0, world.h);
        };
        while (triangles.length < world.maxTriangles) {
            triangles.push(new Triangle(random(0, world.w), random(0, world.h)));
        }

        var Pentagon = function(x, y) {
            this.pos = new PVector(x, y); //Its Position
            this.r = random(0, 360); //Its Starting Rotation
            this.d = 60; //Its Diameter
            this.s = 0.25;
            this.velocity = new PVector(random(-this.s,this.s),random(-this.s,this.s));

            this.defence=6;
            this.damage=3;

            this.v = 130; //Its Value
        };
        Pentagon.prototype.run = function() {
            this.display();
            this.update();
        };
        Pentagon.prototype.display = function() {
            pushMatrix();
            translate(this.pos.x, this.pos.y);
            rotate(this.r);
            stroke(85);
            strokeWeight(3);
            fill(colors.pentagon);
            beginShape();
            vertex(0, 0 - this.d / 2);
            vertex(0 + this.d / 2, 0 - this.d / 8);
            vertex(0 + this.d / 3, 0 + this.d / 2);
            vertex(0 - this.d / 3, 0 + this.d / 2);
            vertex(0 - this.d / 2, 0 - this.d / 8);
            vertex(0, 0 - this.d / 2);
            endShape();
            popMatrix();
        };
        Pentagon.prototype.update = function() {
            this.r += random(0.025);
            this.velocity.x = constrain(this.velocity.x, -this.s,this.s);
            this.velocity.y = constrain(this.velocity.y, -this.s,this.s);
            this.pos.add(this.velocity);
            this.pos.x = constrain(this.pos.x, 0, world.w);
            this.pos.y = constrain(this.pos.y, 0, world.h);
        };
        while (pentagons.length < world.maxPentagons) {
            pentagons.push(new Pentagon(random(0, world.w), random(0, world.h)));
        }

        /** Player **/
        var keys = {};
        var keyPressed = function() {
            keys[keyCode] = true;
        };
        var keyReleased = function() {
            keys[keyCode] = false;
        };
        var Player = function(x, y) {
            this.pos = new PVector(x, y);
            this.velocity = new PVector(0,0);
            this.accSpeed = 0.1;
            this.d = 40;

            this.pmx = 0;
            this.pmy = 0;

            this.screenx = 0;
            this.screenx = 0;

            this.reloadTime = 0;
            this.shooting = false;

            this.stats = {
                health: 100,
                regeneration: 1,
                bodyDamage: 1,
                bulletSpeed: 5,
                bulletPenetration: 1,
                bulletDamage: 1,
                reload: 1,
                movementSpeed: 2.5,
                tankType: "twin",
                bulletSize: 19,
                name: [],
                score: 0,
                lvl: 1,
                dst: 0,
            };
        };
        Player.prototype.run = function() {
            this.display();
            this.update();
        };
        Player.prototype.display = function() {
            switch (this.stats.tankType) {
                case "tank":
                    stroke(62);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "twin":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-19.75, 0, 17.5, 35);
                    rect(1.4, 0, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "flankGuard":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, -35, 17.5, 75);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "machineGun":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    //use a quad()
                    quad(-10, 0, 10, 0, 17.5, 37.5, -17.5, 37.5);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "sniper":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 42);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "tripleShot":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rotate(45);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(-90);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(45);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "twinFlank":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-19.75, -38, 17.5, 75);
                    rect(1.4, -38, 17.5, 75);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "quadTank":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(90);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(90);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(90);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "tri-angle":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 39);
                    rotate(150);
                    rect(-8.75, 5, 17.5, 35);
                    rotate(60);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "destroyer":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-13.80, 5, 27.5, 35);
                    this.stats.bulletSize = 31;
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "gunner":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-19.75, 8, 9, 25);
                    rect(-10.4, 8, 9, 30);
                    rect(-1.4, 8, 9, 30);
                    rect(10.4, 8, 9, 25);
                    this.stats.bulletSize = 12;
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "assassin":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-10, 5, 19.5, 55);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "overseer":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rotate(20);
                    stroke(62);
                    strokeWeight(2.5);
                    triangle(25, 23, -5, 33, 0, 0);
                    rotate(180);
                    triangle(25, 23, -3, 33, 0, 0);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "hunter":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-9.75, 5, 18.5, 48);
                    rect(-11.75, 5, 22.5, 42);

                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "triplet":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-18.75, 5, 17.5, 30);
                    rect(0.75, 5, 17.5, 30);
                    rect(-8.75, 5, 17.5, 35);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "pentaShot":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rotate(45);
                    rect(-8.75, 5, 17.5, 27);
                    rotate(-90);
                    rect(-8.75, 5, 17.5, 27);
                    rotate(45);
                    rotate(20);
                    rect(-8.75, 5, 17.5, 32);
                    rotate(-40);
                    rect(-8.75, 5, 17.5, 32);
                    rotate(20);
                    rect(-8.75, 5, 17.5, 37);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "tripleTwin":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-19.75, 5, 17.5, 33);
                    rect(1.5, 5, 17.5, 33);
                    rotate(120);
                    rect(-19.75, 5, 17.5, 33);
                    rect(1.5, 5, 17.5, 33);
                    rotate(120);
                    rect(-19.75, 5, 17.5, 33);
                    rect(1.5, 5, 17.5, 33);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "octoTank":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    for (var i = 0; i < 360; i += 45) {
                        rotate(i);
                        rect(-8.75, 5, 17.5, 35);
                    }
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "booster":

                    break;

                case "fighter":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-8.75, 5, 17.5, 36);
                    rotate(90);
                    rect(-8.75, -35, 17.5, 70);
                    rotate(60);
                    rect(-8.75, 5, 17.5, 30);
                    rotate(65);
                    rect(-8.75, 5, 17.5, 30);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "hybrid":

                    break;

                case "stalker":

                    break;

                case "ranger":

                    break;

                case "manager":

                    break;

                case "overlord":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(153);
                    rotate(20);
                    triangle(25, 23, -5, 33, 1, 3);
                    rotate(90);
                    triangle(25, 23, -3, 33, 1, 3);
                    rotate(90);
                    triangle(25, 23, -3, 33, 1, 3);
                    rotate(90);
                    triangle(25, 23, -3, 33, 1, 3);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "necromancer":
                    stroke(85);
                    strokeWeight(0);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    //use a quad()
                    rotate(20);
                    stroke(62);
                    strokeWeight(2.5);
                    triangle(25, 23, -5, 33, 0, 0);
                    rotate(180);
                    triangle(25, 23, -3, 33, 0, 0);
                    fill(colors.tank_blue);
                    rotate(-20);
                    rect(-18.75, -20, 40, 40);
                    popMatrix();
                    break;

                case "x-hunter":
                    stroke(85);
                    strokeWeight(2.5);
                    pushMatrix();
                    translate(this.pos.x, this.pos.y);
                    rotate(atan2(mouseY-this.screeny, mouseX-this.screenx) - HALF_PI);
                    fill(colors.tank_barrel);
                    rect(-9.75, 5, 18.5, 48);
                    rect(-11.75, 5, 22.5, 42);
                    rect(-13.75, 5, 26.5, 36);
                    popMatrix();
                    fill(colors.tank_blue);
                    ellipse(this.pos.x, this.pos.y, this.d, this.d);
                    break;

                case "sprayer":

                    break;

                case "predator":

                    break;
            }
        };
        Player.prototype.update = function() {
            if (keys[UP] || keys[87]) {
                this.velocity.sub(0, this.accSpeed);
            }
            if (keys[DOWN] || keys[83]) {
                this.velocity.add(0, this.accSpeed);
            }
            if (keys[RIGHT] || keys[68]) {
                this.velocity.add(this.accSpeed, 0);
            }
            if (keys[LEFT] || keys[65]) {
                this.velocity.sub(this.accSpeed, 0);
            }
            if(!keys[LEFT]&&!keys[DOWN]&&!keys[RIGHT]&&!keys[LEFT]&&!keys[87]&&!keys[83]&&!keys[68]&&!keys[65]){
                this.velocity.div(1.05);
            }
            this.velocity.x = constrain(this.velocity.x, -this.stats.movementSpeed,this.stats.movementSpeed);
            this.velocity.y = constrain(this.velocity.y, -this.stats.movementSpeed,this.stats.movementSpeed);
            this.pos.add(this.velocity);
            this.pos.x = constrain(this.pos.x, 0, world.w);
            this.pos.y = constrain(this.pos.y, 0, world.h);

            var r = atan2(mouseY - height / 2, mouseX - width / 2);
            //var bulletCount=0;
            //if(bullets.length===0){
            //    bulletCount=0;
            //}
            if (this.shooting && this.reloadTime === 0) {
                //bulletCount+=1;
                //println(bulletCount);
                switch (this.stats.tankType) {
                    case "tank":
                        bullets.push(new Bullet(new PVector(this.pos.x, this.pos.y), new PVector(cos(r) , sin(r)), this.stats.bulletSpeed, this.stats.bulletSize, this.stats.bulletDamage, this.stats.bulletPenetration));
                        this.reloadTime = this.stats.reload;
                        lastMS = millis() - startMS + this.stats.reload * 100;
                        break;

                    case "twin": //WIP
                        if(bullets.length%2===0){
                            bullets.push(new Bullet(new PVector(this.pos.x-TWO_PI-TWO_PI, this.pos.y), new PVector(cos(r), sin(r)), this.stats.bulletSpeed, this.stats.bulletSize, this.stats.bulletDamage, this.stats.bulletPenetration));
                        } else {
                            bullets.push(new Bullet(new PVector(this.pos.x+TWO_PI+TWO_PI, this.pos.y), new PVector(cos(r), sin(r)), this.stats.bulletSpeed, this.stats.bulletSize, this.stats.bulletDamage, this.stats.bulletPenetration));
                        }
                        this.reloadTime = this.stats.reload;
                        lastMS = millis() - startMS + this.stats.reload * 50;
                        break;

                    case "flankGuard":
                        if(bullets.length%2===0){
                            bullets.push(new Bullet(new PVector(this.pos.x, this.pos.y), new PVector(cos(r) , sin(r)), this.stats.bulletSpeed, this.stats.bulletSize, this.stats.bulletDamage, this.stats.bulletPenetration));
                        } else {
                            bullets.push(new Bullet(new PVector(this.pos.x, this.pos.y), new PVector(cos(r+PI) , sin(r+PI)), this.stats.bulletSpeed, this.stats.bulletSize, this.stats.bulletDamage, this.stats.bulletPenetration));
                        }
                        this.reloadTime = this.stats.reload;
                        lastMS = millis() - startMS + this.stats.reload * 100;
                        break;

                    case "machineGun":

                        break;

                    case "sniper":

                        break;

                    case "tripleShot":

                        break;

                    case "twinFlank":

                        break;

                    case "quadTank":

                        break;

                    case "tri-angle":

                        break;

                    case "destroyer":

                        break;

                    case "gunner":

                        break;

                    case "assassin":

                        break;

                    case "overseer":

                        break;

                    case "hunter":

                        break;

                    case "triplet":

                        break;

                    case "pentaShot":

                        break;

                    case "tripleTwin":

                        break;

                    case "octoTank":

                        break;

                    case "booster":

                        break;

                    case "fighter":

                        break;

                    case "hybrid":

                        break;

                    case "stalker":

                        break;

                    case "ranger":

                        break;

                    case "manager":

                        break;

                    case "overlord":

                        break;

                    case "necromancer":

                        break;

                    case "x-hunter":

                        break;
                }
            }
        };
        var player = new Player(random(0, world.w - width), random(0, world.h - height));
        leaderboard.push(player);

        /** Minimap **/
        var miniMap = function(x, y, t) {
            this.pos = new PVector(x, y);

            this.x = 0;
            this.y = 0;

            this.tracking = t;
        };
        miniMap.prototype.run = function() {
            this.display();
            this.update();
        };
        miniMap.prototype.display = function() {
            stroke(100);
            strokeWeight(5);
            fill(207, 207, 207, 200);
            rect(this.pos.x, this.pos.y, 125, 125);
            strokeWeight(5);
            stroke(114);
            pushMatrix();
            translate(this.x + (width - 130), this.y + (height - 130));
            rotate(atan2(mouseY - height / 2, mouseX - width / 2));
            fill(0);
            triangle(10, 0, -1, -2.5, -1, 2.5);
            popMatrix();
        };
        miniMap.prototype.update = function() {
            if (this.pos.x !== width - 135 || this.pos.y !== height - 135) {
                this.pos.x = width - 135;
                this.pos.y = height - 135;
            }
            this.x = 115 * this.tracking.pos.x / world.w;
            this.y = 115 * this.tracking.pos.y / world.h;
        };
        var minimap = new miniMap(width - 135, height - 135, player.pos.x, player.pos.y);

        /** Map Camera **/
        var mapCamera = {
            pos: new PVector(player.pos.x, player.pos.y),
            right: -world.w,
            bottom: -world.h,
            ox: 0,
            oy: 0,
            run: function() {
                this.pos.x = constrain(this.pos.x + (width / 2 - player.pos.x - this.pos.x) / 5, this.right, this.left);
                this.pos.y = constrain(this.pos.y + (height / 2 - player.pos.y - this.pos.y) / 5, this.bottom, this.top);
                translate(this.pos.x, this.pos.y);

                player.screenx = player.pos.x + this.pos.x;
                player.screeny = player.pos.y + this.pos.y;
            }
        };

        /** Overlays **/
        var overlays = function(t) {
            this.tracking = t;
            this.minimap = new miniMap(width - 135, height - 135, t);
            this.scoreBarLength = 246;
            this.levelBarLength = 346;
        };
        overlays.prototype.run = function() {
            this.display();
            this.update();
        };
        overlays.prototype.display = function() {
            /* Mini Map */
            this.minimap.run();

            /*  */
            noStroke();
            fill(22, 22, 22, 200);
            rect(width / 2 - (250 / 2), height - 60, 250, 17.5, 100);
            rect(width / 2 - (350 / 2), height - 40, 350, 20, 100);

            fill(108, 240, 162);
            rect(width / 2 - (250 / 2) + 2, height - 58, 13.5/*+this.scoreBarLength*/, 13.5, 100);

            fill(240, 217, 108);
            rect(width / 2 - (350 / 2) + 2, height - 38, 16/*+this.levelBarLength*/, 16, 100);

            textSize(11);
            textOutline("Score: " + this.tracking.stats.score, width / 2, height - 51, 0, 0, color(240), color(61), 1);
            textSize(12.5);
            textOutline("Lvl " + this.tracking.stats.lvl + " Tank", width / 2, height - 30, 0, 0, color(240), color(61), 1);
            textSize(32.5);
            textOutline(this.tracking.stats.name.join(""), width / 2, height - 80, 0, 0, color(240), color(61), 3.5);



            /* Leaderboard */
            for (var i = 0; i < 10; i += 1) {

            }
        };
        overlays.prototype.update = function() {
            var nlvl = this.tracking.stats.lvl + 1;
            this.scoreBarLength = 246 * this.tracking.stats.score / leaderboard[0].stats.score;
            this.levelBarLength = 346 * this.tracking.stats.dst / levels[nlvl];
        };

        var Overlay = new overlays(player);

        /** Collisions **/
        var collideWith = function(e, c) {
            if (dist(e.pos.x, e.pos.y, c.pos.x, c.pos.y) - (e.d / 2) < c.d / 2) {
                return true;
            } else {
                return false;
            }

        };
        var collisions = function() {
            /* Squares Collisions */
            for(var i=0; i<squares.length; i++){
                if (collideWith(player, squares[i])) {
                    squares[i].defence-=player.stats.bodyDamage;
                    if(player.velocity.x>0){
                        player.velocity.div(1.3,1.3);
                        squares[i].velocity.add(1,0);
                        squares[i].pos.add(10,0);
                    }
                    if(player.velocity.x<0){
                        player.velocity.div(1.3,1.3);
                        squares[i].velocity.sub(1,0);
                        squares[i].pos.sub(10,0);
                    }
                    if(player.velocity.y<0){
                        player.velocity.div(1.3,1.3);
                        squares[i].velocity.sub(0,1);
                        squares[i].pos.sub(0,10);
                    }
                    if(player.velocity.y>0){
                        player.velocity.div(1.3,1.3);
                        squares[i].velocity.add(0,1);
                        squares[i].pos.add(0,10);
                    }
                }
                for(var b=0; b<bullets.length; b++){
                    if(collideWith(bullets[b],squares[i])){
                        squares[i].defence-=bullets[b].damage;
                        bullets[b].defence-=squares[i].damage;
                        if(bullets[b].velocity.x>0){
                            squares[i].velocity.add(1,0);
                            squares[i].pos.add(10,0);
                        }
                        if(bullets[b].velocity.x<0){
                            squares[i].velocity.sub(1,0);
                            squares[i].pos.sub(10,0);
                        }
                        if(bullets[b].velocity.y<0){
                            squares[i].velocity.sub(0,1);
                            squares[i].pos.sub(0,10);
                        }
                        if(bullets[b].velocity.y>0){
                            squares[i].velocity.add(0,1);
                            squares[i].pos.add(0,10);
                        }
                    }
                }
                if(squares[i].defence<=0){
                    squares.splice(i,1);
                }
            }

            /* Triangles Collisions */
            for(var ib=0; ib<triangles.length; ib++){
                if (collideWith(player, triangles[ib])) {
                    triangles[ib].defence-=player.stats.bodyDamage;
                    if(player.velocity.x>0){
                        player.velocity.div(1.3,1.3);
                        triangles[ib].velocity.add(1,0);
                        triangles[ib].pos.add(10,0);
                    }
                    if(player.velocity.x<0){
                        player.velocity.div(1.3,1.3);
                        triangles[ib].velocity.sub(1,0);
                        triangles[ib].pos.sub(10,0);
                    }
                    if(player.velocity.y<0){
                        player.velocity.div(1.3,1.3);
                        triangles[ib].velocity.sub(0,1);
                        triangles[ib].pos.sub(0,10);
                    }
                    if(player.velocity.y>0){
                        player.velocity.div(1.3,1.3);
                        triangles[ib].velocity.add(0,1);
                        triangles[ib].pos.add(0,10);
                    }
                }
                for(var b=0; b<bullets.length; b++){
                    if(collideWith(bullets[b],triangles[ib])){
                        triangles[ib].defence-=squares[b].damage;
                        bullets[b].defence-=triangles[ib].damage;
                        if(bullets[b].velocity.x>0){
                            triangles[ib].velocity.add(1,0);
                            triangles[ib].pos.add(10,0);
                        }
                        if(bullets[b].velocity.x<0){
                            triangles[ib].velocity.sub(1,0);
                            triangles[ib].pos.sub(10,0);
                        }
                        if(bullets[b].velocity.y<0){
                            triangles[ib].velocity.sub(0,1);
                            triangles[ib].pos.sub(0,10);
                        }
                        if(bullets[b].velocity.y>0){
                            triangles[ib].velocity.add(0,1);
                            triangles[ib].pos.add(0,10);
                        }
                    }
                }
                if(triangles[ib].defence<=0){
                    triangles.splice(ib,1);
                }
            }

            /* Pentagons Collisions */
            for(var ic=0; ic<pentagons.length; ic++){
                if (collideWith(player, pentagons[ic])) {
                    pentagons[ic].defence-=player.stats.bodyDamage;
                    if(player.velocity.x>0){
                        player.velocity.div(1.3,1.3);
                        pentagons[ic].velocity.add(1,0);
                        pentagons[ic].pos.add(10,0);
                    }
                    if(player.velocity.x<0){
                        player.velocity.div(1.3,1.3);
                        pentagons[ic].velocity.sub(1,0);
                        pentagons[ic].pos.sub(10,0);
                    }
                    if(player.velocity.y<0){
                        player.velocity.div(1.3,1.3);
                        pentagons[ic].velocity.sub(0,1);
                        pentagons[ic].pos.sub(0,10);
                    }
                    if(player.velocity.y>0){
                        player.velocity.div(1.3,1.3);
                        pentagons[ic].velocity.add(0,1);
                        pentagons[ic].pos.add(0,10);
                    }
                }
                for(var b=0; b<bullets.length; b++){
                    if(collideWith(bullets[b],pentagons[ic])){
                        pentagons[ic].defence-=bullets[b].damage;
                        bullets[b].defence-=pentagons[ic].damage;
                        if(bullets[b].velocity.x>0){
                            pentagons[ic].velocity.add(1,0);
                            pentagons[ic].pos.add(10,0);
                        }
                        if(bullets[b].velocity.x<0){
                            pentagons[ic].velocity.sub(1,0);
                            pentagons[ic].pos.sub(10,0);
                        }
                        if(bullets[b].velocity.y<0){
                            pentagons[ic].velocity.sub(0,1);
                            pentagons[ic].pos.sub(0,10);
                        }
                        if(bullets[b].velocity.y>0){
                            pentagons[ic].velocity.add(0,1);
                            pentagons[ic].pos.add(0,10);
                        }
                    }
                }
                if(pentagons[ic].defence<=0){
                    pentagons.splice(ic,1);
                }
            }
            for(var b=0; b<bullets.length; b++){
                if(bullets[b].defence<=0){
                    bullets.splice(b,1);
                }
            }
        };

        /** Draw Function **/
        var draw = function() {
          size(window.innerWidth, window.innerHeight);
            try{
                if (playing) {
                    if (squares.length < world.minimumSquares) {
                        squares.push(new Square(random(0, world.w), random(0, world.h)));
                    }
                    if (triangles.length < world.minimumTriangles) {
                        triangles.push(new Triangle(random(0, world.w), random(0, world.h)));
                    }
                    if (pentagons.length < world.minimumPentagons) {
                        pentagons.push(new Pentagon(random(0, world.w), random(0, world.h)));
                    }

                    if (squares.length < world.maxSquares && frameCount%150 === 25) {
                        squares.push(new Square(random(0, world.w), random(0, world.h)));
                    }
                    if (triangles.length < world.maxTriangles && frameCount%150 === 25) {
                        triangles.push(new Triangle(random(0, world.w), random(0, world.h)));
                    }
                    if (pentagons.length < world.maxPentagons && frameCount%150 === 25) {
                        pentagons.push(new Pentagon(random(0, world.w), random(0, world.h)));
                    }

                    switch (gameMode) {
                        case "FFA":
                            background(185); //Background Color
                            pushMatrix();
                            mapCamera.run(); //Map Camera
                            fill(205);
                            rect(width/2,height/2,world.w-width/2,world.h-height/2);
                            if(hideGrid === false){
                                stroke(170);
                                strokeWeight(1);
                                for (var w = -width*2; w < world.w+width*2; w += 22.5) {
                                    line(w, 0, w, world.w);
                                }
                                for (var h = -height*2; h < world.h+height*2; h += 22.5) {
                                    line(0, h, world.h, h);
                                }
                            }
                            for (var i = 0; i < squares.length; i += 1) {
                                squares[i].run();
                            }
                            for (var i = 0; i < triangles.length; i += 1) {
                                triangles[i].run();
                            }
                            for (var i = 0; i < pentagons.length; i += 1) {
                                pentagons[i].run();
                            }
                            for (var i = 0; i < bullets.length; i += 1) {
                                bullets[i].run();
                            }
                            player.run(); //The Player
                            popMatrix();
                            if (millis() - startMS > lastMS + player.stats.reload * 1000) {
                                player.reloadTime = 0;
                            }
                            Overlay.run();
                            collisions();
                            break;
                    }
                } else {
                    background(131, 125, 116);
                    textSize(16);
                    textOutline("Game mode: " + gameMode, width / 2, 20, 0, 0, color(255), color(0), 2);
                    textSize(20);
                    textOutline("This is the tale of...", width / 2, height / 2 - 35, 0, 0, color(255), color(0), 2);
                    fill(238);
                    stroke(0);
                    strokeWeight(4);
                    rect(width / 2 - (325 / 2), height / 2 - (40 / 2), 325, 40);
                    textAlign(LEFT, CENTER);
                    textSize(30);
                    if (round(frameCount / 40) % 2 === 0) {
                        textOutline(player.stats.name.join("") + "|", width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                    } else {
                        textOutline(player.stats.name.join(""), width / 2 - (320 / 2), height / 2, 0, 0, color(0));
                    }
                    textAlign(CENTER, CENTER);
                    textSize(11);
                    textOutline("(press enter to spawn)", width / 2, height / 2 + 30, 0, 0, color(255), color(0), 1.25);
                    if (keys[ENTER]) {
                        playing = true;
                    }
                }
                //println(__frameRate);
            }
            catch(e) {
                println(e);
            }
        };

        /** Shooting Stuff **/
        mousePressed = function() {
            player.shooting = true;
        };
        mouseReleased = function() {
            player.shooting = false;
        };

        /** Typing Stuff **/
        var keyTyped = function() {
            console.log(key.code);
            if (!playing) {
                if (key.code !== BACKSPACE && player.stats.name.length < 15 && !keys[ENTER]) {
                    player.stats.name.push(key);
                }
                if (key.code === BACKSPACE) {
                    player.stats.name.pop();
                }
            }
            if(playing){
                if(key.code===104 && !hideGrid){
                    hideGrid = true;
                } else if(key.code===104 && hideGrid){
                    hideGrid = false;
                }
            }
        };
    }
};
var canvas = document.getElementById("mycanvas");
var processingInstance = new Processing(canvas, sketchProc);
