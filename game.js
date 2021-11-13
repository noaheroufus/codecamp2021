function Game(canvas, width, height, units) {
    this.canvas = canvas;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.units = units;
    this.width = width * this.units;
    this.height = height * this.units;

    this.running = false;
    this.last = 0;
    this.keys = [];
    this.mouse_x = 0;
    this.mouse_y = 0;
    this.mouse_attack = false;

    this.objects = [];
    this.forest = [];

    this.state = new GameState();

    this.beast = null;

    this.inventory = new Inventory();
    this.descriptions = new Description();
    this.descriptionItem = document.createElement("div");
    this.descriptionItem.style.width = "15em";
    this.descriptionItem.style.height = "auto";
    this.descriptionItem.style.padding = "1em";
    this.descriptionItem.style.textAlign = "center";
    this.descriptionItem.style.background = "#4c4c4c";
    this.descriptionItem.style.color = "white";
    this.descriptionItem.style.borderRadius = "6px";
    this.descriptionItem.style.border= "2px solid yellow";
    this.descriptionItem.style.position = "absolute";
    this.descriptionItem.style.display = "none";
    //this.canvas.appendChild(this.descriptionItem);
    document.getElementById("container").appendChild(this.descriptionItem);

    this.covered = 1.0;
    this.victories = 0;
}

Game.prototype.init = function() {
    // Event listeners
    this.canvas.addEventListener('mousedown', function(ev) {
        if(ev.button == 0) {
            this.mouse_attack = true;
        }
    }.bind(this));
    this.canvas.addEventListener('mouseup', function(ev) {
        if(ev.button == 0) {
            this.mouse_attack = false;
        }
    }.bind(this));
    this.canvas.addEventListener('mousemove', function(ev) {
        this.mouse_x = Math.max(0, Math.min(ev.offsetX, this.width));
        this.mouse_y = Math.max(0, Math.min(ev.offsetY, this.height));
    }.bind(this));

    document.addEventListener('keydown', function(ev) {
        let c = ev.keyCode;
        let i = this.keys.indexOf(c);
        if(i < 0) {
            // Push the key to the table if it's not already there
            this.keys.push(c);
        }
    }.bind(this));
    document.addEventListener('keyup', function(ev) {
        let c = ev.keyCode;
        let i = this.keys.indexOf(c);
        if(i >= 0) {
            // Remove the key from the table if it's not already there
            this.keys.splice(i, 1);
        }
    }.bind(this));

    // Set the canvas size
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Initialize WebGL
    this.webgl = new WebGl(this.canvas);
    this.webgl.init();

    // Load textures
    LoadTextures(this.webgl);

    // Build our shaders
    this.webgl.makeShader('main');

    // Set our game state to the title screen
    // (state.type, callback)
    this.state.changeState(this.state.title, this.prepareTitle.bind(this));

    // Start the game loop
    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.update = function(time, delta) {

    // State logic
    if(this.state.getState() == this.state.title) {
        if(this.mouse_attack) { // left click for now
            this.state.changeState(this.state.playing, this.preparePlay.bind(this));
        }
    } else if (this.state.getState() == this.state.playing) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        this.objects.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        if (this.mouse_attack) {
            this.state.changeState(this.state.reveal, this.prepareReveal.bind(this));
            this.mouse_attack = false;
        }
    } else if (this.state.getState() == this.state.reveal) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        this.objects.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        if (this.mouse_attack) {
            this.state.changeState(this.state.fight, this.prepareBeastFight.bind(this));
            this.mouse_attack = false;
        }
    } else if (this.state.getState() == this.state.fight) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        this.beast.update(time, delta);
        this.objects.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        // Hover descriptions
        if(this.within(this.mouse_x, this.mouse_y, this.beast.x, this.beast.y, this.beast.width, this.beast.height)) {
            this.descriptionItem.style.display = "block";
            this.descriptionItem.style.left = this.mouse_x-64+(this.canvasRect.left/2)+'px';
            this.descriptionItem.style.top = this.mouse_y+this.canvasRect.top+'px';
            this.descriptionItem.innerHTML = '<strong>' +
                this.descriptions.titles[this.beast.version] +
                '</strong><br /><br />' +
                this.descriptions.descriptions[this.beast.version];
        } else {
            this.descriptionItem.style.display = "none";
        }
        if (this.mouse_attack) {
            this.state.changeState(this.state.slay, this.prepareBeastSlay.bind(this));
            this.mouse_attack = false;
        }
    } else if (this.state.getState() == this.state.slay) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        this.objects.forEach(function(obj, idx) {
            if(!obj) return;
            obj.update(time, delta);
        });
        if (this.mouse_attack) {
            if(this.victories < 4) {
                this.state.changeState(this.state.playing, function(){});
            } else {
                this.state.changeState(this.state.victory, this.prepareVictory.bind(this));
            }
            this.mouse_attack = false;
        }
    } else if (this.state.getState() == this.state.victory) {
        if (this.mouse_attack) {
            this.state.changeState(this.state.title, this.prepareTitle.bind(this));
            this.mouse_attack = false;
        }
    }

    // Misc
    this.objects.forEach(function(obj, idx) {
        if(!obj) return;
        obj.update(time, delta);
    });
}

Game.prototype.render = function() {
    let gl = this.webgl.context;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.state.getState() == this.state.title) {
        // Render title card
        // Render buttons
    } else if (this.state.getState() == this.state.playing) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.render();
        });
    } else if (this.state.getState() == this.state.reveal) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.render();
        });
    } else if (this.state.getState() == this.state.fight) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.render();
        });
        if(this.beast) {
            this.beast.render();
        }
    } else if (this.state.getState() == this.state.slay) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.render();
        });
    } else if (this.state.getState() == this.state.victory) {
        this.forest.forEach(function(obj, idx) {
            if(!obj) return;
            obj.render();
        });
    }

    // Render all our objects.
    this.objects.forEach(function(obj, idx) {
        if(!obj) return;
        obj.render();
    });
}

Game.prototype.loop = function(ts) {
    let delta = ts - this.last;

    this.update(ts, delta);
    this.render();

    this.last = ts;

    window.requestAnimationFrame(this.loop.bind(this));
}

Game.prototype.keyPressed = function(keyCode) {
    return (this.keys.indexOf(keyCode) >= 0);
}

Game.prototype.prepareTitle= function() {
    // Add our title screen objects
    // TODO
    this.covered = 1.0;
    this.victories = 0;
    this.objects = [];
    this.forest = [];
}

Game.prototype.preparePlay= function() {
    // Prevent attacking right away
    this.mouse_attack = false;

    this.objects = [];

    // Add our player object to the game.
    this.objects.push(new PlayerObject(this.webgl, ( this.width / 2 ) - ( ( this.units*4 ) / 2), this.height - this.units*4, 4, 4));
    // Tree Pool
    this.forest = [];
    for (let i=0; i<=100; i++) {
        this.forest.push(new TreeObject(this.webgl, (Math.random()*this.width)-(this.units*4), (Math.random()*this.height)-(this.units*4), 8, 8));
    }
    // Shrub Pool
    for (let i=0; i<=100; i++) {
        this.forest.push(new ShrubObject(this.webgl, (Math.random()*this.width)-(this.units*1), (Math.random()*this.height)-(this.units*1), 2, 2));
    }
    this.objects.sort((a,b) => (a.y+a.height > b.y+b.height) ? 1 : -1);

    // Decide on Network Beast
    this.beast = new NetworkBeastObject(this.webgl, this.width/2, this.height/2, 8, 8);
    // TODO: Generate the appropriate Tools to find on the way
    this.tools = [];

    // TEMP:
    this.objects.push(new ItemExtender(Math.random()*this.width, Math.random()*this.height));
    this.objects.push(new ItemPasschange(Math.random()*this.width, Math.random()*this.height));
    this.objects.push(new ItemPower(Math.random()*this.width, Math.random()*this.height));
    this.objects.push(new ItemChanchange(Math.random()*this.width, Math.random()*this.height));

    // Add inventory bar.
    this.objects.push(new Inventory(this.webgl.context));
}

Game.prototype.prepareReveal = function() {
    this.covered -= 0.25;
    for(let i = 0; i < this.forest.length; i++) {
        let obj = this.forest[i];
        if(obj && (obj.y+obj.height) > (this.height * this.covered)) {
            this.forest[i] = undefined;
        }
    }
}

Game.prototype.prepareBeastFight = function() {
}

Game.prototype.prepareBeastSlay = function() {
    this.beast.newTexture();
    this.victories += 1;
}

Game.prototype.prepareVictory = function() {
}

Game.prototype.prepareDead= function() {
    // Add our dead state objects
    // TODO
}

Game.prototype.within = function(a_x, a_y, b_x, b_y, width, height) {
    return (a_x >= b_x && a_x <= b_x+width && a_y >= b_y && a_y <= b_y+height);
}
