let UnieBody = {
    character: {
        name: "",
        el: null
    },
    head: {
        name: "",
        el: null
    },
    torso: {
        name: "",
        el: null
    },
	armL:{
        name: "",
        el: null
    },
	armR:{
        name: "",
        el: null
    },
    Eyes:{
        name: "",
        el: null
    },
    EyeLeft:{
        name: "",
        el: null
    },
    EyeRight:{
        name: "",
        el: null
    },
};

let Atlas = {
    character:{
        name: "UniePose__Character",
        el:""
    },
    headFront:{
        name:"UniePose__Head",
        el: ""
    },     
	headSide1:{
        name:"Unie__Head_Side1",
        el: ""
    },     
	headSide2:{
        name:"Unie__Head_Side2",
        el: ""
    },     
	torsoFront:{
        name:"UniePose__Torso",
        el: ""
    },     
	torsoSide:{
        name:"Unie__Torso_Side",
        el: ""
    },
    armR:{
        name:"UniePose__Arm_R",
        el: ""
    },
    armL:{
        name:"UniePose__Arm_L",
        el: ""
    },
    armSideR:{
        name:"Braco_lado_R",
        el: ""
    },
    armSideL:{
        name:"Braco_lado_L",
        el: ""
    },
    eyeLeftNormal:{
        name: "UniePose__Eye_L",
        el:""
    },
    eyeRightNormal:{
        name: "UniePose__Eye_R",
        el:""
    },
    eyes:{
        name: "UniePose__Eyes",
        el:""
    },
};

let Unie = {
    lookAtAngle: {
        sin: null,
        cos: null,
    },
    lookAtPosition: {
        x: 0,
        y: 0,
    }
}


let main, svg;

let viewBox;
let w, h, svgX = 0, svgY = 0, ratio;
const SizingStep = 25;

let ray = document.createElementNS('http://www.w3.org/2000/svg','line');
ray.setAttribute('id','ray');
ray.setAttribute("stroke", "black")
ray.setAttribute("stroke-width", "2px")

let rayX = document.createElementNS('http://www.w3.org/2000/svg','line');
rayX.setAttribute('id','rayX');
rayX.setAttribute("stroke", "red")
rayX.setAttribute("stroke-width", "2px")

let rayY = document.createElementNS('http://www.w3.org/2000/svg','line');
rayY.setAttribute('id','rayY');
rayY.setAttribute("stroke", "green")
rayY.setAttribute("stroke-width", "2px")

let mouseX, mouseY;
let unieRects, unieBb;


const load = async () => {
	await fetch("./Unie Sprite Atlas.svg")
	//await fetch("./unieFix.svg")
		.then((res) => {
			res.text()
            .then((data) => {
				main = document.getElementById("svg_canvas");
				main.innerHTML = data;

				svg = main.firstElementChild;
                svg.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);

				svg.setAttribute("width", "100%");
				svg.setAttribute("height", "100%");
				svg.setAttribute("style", "background-color: #0f0f0f9d");
                svg.classList.add("mySvg")

                svg.append(ray);
                svg.append(rayX);
                svg.append(rayY);

				/* svg.setAttribute("viewBox", "0 0 6000 6000"); */
                
                //console.log("Load resources");                
                for (const [k, v] of Object.entries(Atlas)) {
                    v.el = document.getElementById(v.name);
                    v.el.classList.add("transform");                            
                    //console.log(k, v);
                }

                //Load init state unie
                UnieBody.character.el= Atlas.character.el;  
                UnieBody.character.name = Atlas.character.name;  
                UnieBody.head.el= Atlas.headFront.el;  
                UnieBody.head.name = Atlas.headFront.name;  
                UnieBody.armL.el= Atlas.armL.el;  
                UnieBody.armL.name = Atlas.armL.name;  
                UnieBody.armR.el= Atlas.armR.el;  
                UnieBody.armR.name = Atlas.armR.name;  
                UnieBody.torso.el= Atlas.torsoFront.el;  
                UnieBody.torso.name = Atlas.torsoFront.name;
                UnieBody.EyeLeft.el= Atlas.eyeLeftNormal.el;  
                UnieBody.EyeLeft.name = Atlas.eyeLeftNormal.name;
                UnieBody.EyeRight.el= Atlas.eyeRightNormal.el;  
                UnieBody.EyeRight.name = Atlas.eyeRightNormal.name;
                UnieBody.Eyes.el= Atlas.eyes.el;  
                UnieBody.Eyes.name = Atlas.eyes.name;                

                UpdateViewboxData();				
			});
		});
};
load();

document.body.addEventListener("keydown", (ev) => {
	//console.log("pressed: "+ ev.key)
	switch (ev.keyCode) {
		//Control zone for config
		case keyCode.ESCAPE:
			if (main.style.display !== "") {
				main.style.display = "";
				svg.style.display = "";
			} else {
				main.style.display = "none";
				svg.style.display = "none";
			}

			break;

		case keyCode.NUMPAD_ADD:
			if (w - SizingStep < 0 || h - SizingStep < 0) return;
			w -= SizingStep;
			h -= SizingStep;			
			break;

		case keyCode.NUMPAD_SUBTRACT:
			w += SizingStep;
			h += SizingStep;
			break;

		case keyCode.LEFT:
			svgX -= SizingStep;
			break;

		case keyCode.RIGHT:
			svgX += SizingStep;
			break;

		case keyCode.UP:
			svgY -= SizingStep;
			break;

		case keyCode.DOWN:
			svgY += SizingStep;
			break;

		default:
			break;
	}

    svg.setAttribute("viewBox", `${svgX} ${svgY} ${w} ${h}`);

	//Animations/taunts
	switch (ev.key) {
		case "z":
			UnieBody.armL.classList.toggle("rotateL");
			UnieBody.armR.classList.toggle("rotateR");

			UnieBody.armL.addEventListener("animationend", (ev) => {
				console.log("finished");
			});

			UnieBody.armR.addEventListener("animationend", (ev) => {
				console.log("finished");
			});
			break;
		case "x":
			break;
		case "c":
			break;

		default:
			break;
	}
});

window.addEventListener("resize", (ev)=>{
    svg.setAttribute("viewBox", `${svgX} ${svgY} ${innerWidth} ${innerHeight}`);
    UpdateViewboxData();
});


/**
 * 
 * @param {HTMLElement} part 
 * @param {HTMLElement} newPart
 */
function SetBody(part, newPart) {

    //console.log(part);
    let atlas = document.getElementById("Sprite_Atlas")
    let unieBodyParent = part.el.parentElement;
    /* console.log(unieBodyParent) */

    for (let [k, v] of Object.entries(UnieBody)) {
        //console.log("Searching... \n",k, v);
        if(v.name == part.name){
            /* console.log("found"); */
            atlas.appendChild(part.el);
            UnieBody.character.el.appendChild(newPart.el);

            part.el.style.display = "none"; 
	        newPart.el.style.display = "";

            UnieBody[k] = newPart;
            /* console.log(UnieBody);
            console.log(UnieBody[k]); */

            return;
        }
    }
}


/**
 * Moves Unie absolutely in screen space coordinates. Must provide for now 'svgX' and 'svgY' in offset to make him go to absolute position in screen space. Otherwise, it moves in SVG space coordinates
 * @param {Array<Number>} newPos 
 * @param {Array<Number>} offset 
 */
function move(newPos = [0, 0], offset = [0,0]){
    //Hardcoded get element of Uni-e. MUST BE EXTRACTED TO ANOTHER FUNCTION LATER

    //We are dealing with SVG space. Screen --to-> SVG needed
    //Already in svg space
    [unieRects, unieBb] = [UnieBody.character.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let currPos = {
        x: unieRects.x + svgX,
        y: unieRects.y + svgY
    };

    // Svg / Screen = rate ratio
    let ratioW = w/window.innerWidth;
    let ratioH = h/window.innerHeight;
    
    let [newX, newY] = [(newPos[0] + offset[0]) * ratioW, (newPos[1] +  offset[1]) * ratioH ];
    
    
    console.log("Curr", currPos.x, currPos.y)
    console.log("new:", newX, newY)
    console.log("rects", unieRects.x, unieRects.y)
    console.log("bbox", unieBb.x, unieBb.y)


    /** @type {Animation} */
    let moveUnieAnimation;

    let moveKeyframes = new KeyframeEffect(UnieBody.character.el, [
        
        {transform: `translate(${currPos.x}px, ${currPos.y}px)`, offset: 0},
        /* {transform: `translate(${newPos[0]}px, ${newPos[1]}px)`, offset: 1}, */
        {transform: `translate(${newX}px, ${newY}px)`, offset: 1},
        
        /* {transform: `translate(${deltaTranslate[0]}px, ${deltaTranslate[1]}px)`} */
    ],
    {
        duration: 1300,
        easing: "cubic-bezier(.37,.24,.26,1.2)",
        fill: "forwards"
    });

    moveUnieAnimation = new Animation(moveKeyframes, document.timeline);

    
    moveUnieAnimation.addEventListener("finish", (ev)=>{
        console.log("rects", unieRects.x, unieRects.y)
        console.log("bbox", unieBb.x, unieBb.y)
    });

    moveUnieAnimation.play();

}


window.addEventListener("pointermove", (ev)=>{
        
    [mouseX, mouseY] = [ev.clientX, ev.clientY];
    let bbox = UnieBody.head.el.getBBox();

    [unieRects, unieBb] = [UnieBody.character.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let unieOriginScreen = {
        x: unieRects.x,
        y: unieRects.y,
        cx: unieRects.x + unieRects.width/2,
        cy: unieRects.y + unieRects.height/2,
    };

    let unieOriginSvg = {
        x: unieRects.x + svgX,
        y: unieRects.y + svgY,
        cx: (unieRects.x + svgX) + unieRects.width/2,
        cy: (unieRects.y + svgY) + unieRects.height/2,
    };

    let [x, y] = [mouseX - unieRects.x, mouseY - unieRects.y];
    
    let distPos = {
        x: x - unieOriginScreen.x,
        y: y - unieOriginScreen.y,
        cx: x - unieOriginScreen.cx,
        cy: y - unieOriginScreen.cy
    }

    let distPosSvg = {
        x: x - unieOriginSvg.x,
        y: y - unieOriginSvg.y,
        cx: x - unieOriginSvg.cx,
        cy: y - unieOriginSvg.cy,
    }

    let dist = Math.sqrt((distPos.x * distPos.x) + (distPos.y * distPos.y));
    let distCenter = Math.sqrt((distPos.cx * distPos.cx) + (distPos.cy * distPos.cy));

    let distSvg = Math.sqrt((distPosSvg.x * distPosSvg.x) + (distPosSvg.y * distPosSvg.y));
    let distSvgCenter = Math.sqrt((distPosSvg.cx * distPosSvg.cx) + (distPosSvg.cy * distPosSvg.cy));
    
    let cosineSvg = distPosSvg.cx / distSvgCenter;
    //let cosineSvgDegrees = toDegrees(Math.acos(cosineSvg));

    //Invert sign because mouse (starting points) is at upper left [0, y], not down left [0, 0];
    let sineSvg = -(distPosSvg.cy / distSvgCenter);
    //let sineSvgDegrees = toDegrees(Math.asin(sineSvg));

    Unie.lookAtAngle.sin = Math.asin(sineSvg);
    Unie.lookAtAngle.cos = Math.acos(cosineSvg); 

    Unie.lookAtPosition.x = x;
    Unie.lookAtPosition.y = y;

    /* console.table({
        mouseRelativeSvg: {x: x, y: y},
        distPosSvgX: distPosSvg.cx,
        distPosSvgY: distPosSvg.cy,
        distSvgCenter: distSvgCenter,
        arcCos: Math.acos(cosineSvg),
        arcSin: Math.asin(sineSvg),  
        lookAt: {sin: Unie.lookAtAngle.sin, cos: Unie.lookAtAngle.cos, },
        cosAngleCenter: Math.cos(cosineSvg),
        sineSvg: Math.sin(sineSvg),
        
        sin: toDegrees(Unie.lookAtAngle.sin),
        cos: toDegrees(Unie.lookAtAngle.cos),
    }); */


    
    /*Unie top left*/
    /* setLine(ray, unieOriginSvg.x, unieOriginSvg.y, x, y);
    setLine(rayX, unieOriginSvg.x, unieOriginSvg.y, x, unieOriginSvg.y);
    setLine(rayY, unieOriginSvg.x, unieOriginSvg.y, unieOriginSvg.x, y); */
    
    /* Unie center */
    setLine(ray, unieOriginSvg.cx, unieOriginSvg.cy, x, unieOriginSvg.cy);
    setLine(rayX, unieOriginSvg.cx, unieOriginSvg.cy, x, y);
    setLine(rayY, unieOriginSvg.cx, unieOriginSvg.cy, unieOriginSvg.cx, y);
});



function toDegrees(radian){
    return radian * (180/ Math.PI)
}

function UpdateViewboxData(){
    /** @type {String}*/
    viewBox = svg.getAttribute("viewBox");
    viewBox = viewBox.split(" ");
    w = parseInt(viewBox[2]);
    h = parseInt(viewBox[3]);
    ratio = w / h;
}

function setLine(line, x1, y1, x2, y2){
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
}

function toFullCircleAngle(angle){
    return((angle + 360) % 360);
}

const keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
    UP: 38,
	DOWN: 40,
    RIGHT: 39,
	NUMPAD_ADD: 107,
	NUMPAD_DECIMAL: 110,
	NUMPAD_DIVIDE: 111,
	NUMPAD_ENTER: 108,
	NUMPAD_MULTIPLY: 106,
	NUMPAD_SUBTRACT: 109,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	SPACE: 32,
	TAB: 9,
};


const Sides = {
    Right: "right",
    Up: "up",
    Left: "left",
    Down: "down",
}

let previousSide = ""




window.addEventListener("pointermove", (ev)=>{
    let dir = ""
    if(Unie.lookAtAngle.sin > 0 && Unie.lookAtAngle.sin <= Math.PI/2){
        dir += "Upper"
    }
    else{
        dir += "Lower"
    }

    if(Unie.lookAtAngle.cos > 0 && Unie.lookAtAngle.cos < Math.PI/2){
        dir += " Right"
    }
    else{
        dir += " Left"
    }
    console.log(dir)

    
    let [sin, cos] = [toDegrees(Unie.lookAtAngle.sin), toDegrees(Unie.lookAtAngle.cos)]
    let lookSide;
    cos > 90 ? lookSide = 180 : lookSide = 0;

    //Definir qual cabeca usar com rotacao
    if(cos <= 30 || cos >= 150){
        SetBody(UnieBody.head, Atlas.headSide2);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else if ((cos > 30 && cos <= 60) || (cos < 150 && cos >= 120)){
        SetBody(UnieBody.head, Atlas.headSide1);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else{
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
    }

    //Distancia minima para angular cabeca?
    
    let dist = Math.sqrt((Unie.lookAtPosition.x - UnieBody.character.el.getBBox().x) * (Unie.lookAtPosition.x - UnieBody.character.el.getBBox().x) + (Unie.lookAtPosition.y - UnieBody.character.el.getBBox().y) * (Unie.lookAtPosition.y - UnieBody.character.el.getBBox().y))
    console.log("distance", dist, Unie.lookAtPosition.x, UnieBody.character.el.getBBox().x, UnieBody.character.el.getBBox().width)
    if(dist > 130){
        console.log("Safe distance");


        if(cos > 90){
            lookSide = 180;
            UnieBody.head.el.style = `transform: rotateZ(${sin}deg) rotateY(${lookSide}deg)`
            //UnieBody.head.el.style = `transform: rotateY(${lookSide}deg)`
        }
        else{
            lookSide = 0;
            UnieBody.head.el.style = `transform: rotateZ(${-sin}deg) rotateY(${lookSide}deg)`
            /* UnieBody.head.el.style = `transform:  rotateY(${lookSide}deg)` */
        }
        
        UnieBody.torso.el.style = `transform: rotateY(${lookSide}deg)`

    }
    else{
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
        UnieBody.head.el.style = `transform: rotateZ(0deg) rotateY(0deg)`
    }
    
    
    
    /* if(sin <= 45){
    }
    else if(sin >= 135){
        SetBody(UnieBody.head, Atlas.headSide1);
        UnieBody.head.el.style = `transform: rotateZ(${180 - sin}deg) rotateY(${lookSide}deg)`
    } */
})


/* const interval = setInterval(() => {
    
}, 100); */