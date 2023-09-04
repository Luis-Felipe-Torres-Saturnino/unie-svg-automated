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

const deadMouseFollowDistance = 90;
let circleDeadThreshold = document.createElementNS('http://www.w3.org/2000/svg','circle');
circleDeadThreshold.setAttribute("style", "fill: #99009966; stroke-width: 1px; stroke: black")

const minMouseFollowDistance = 175;
let circleMinThreshold = document.createElementNS('http://www.w3.org/2000/svg','circle');
circleMinThreshold.setAttribute("style", "fill: #dd00dd66; stroke-width: 1px; stroke: black")

const maxMouseFollowDistance = 400;
let circleMaxThreshold = document.createElementNS('http://www.w3.org/2000/svg','circle');
circleMaxThreshold.setAttribute("style", "fill: #caca0066; stroke-width: 1px; stroke: black")

let mouseX, mouseY;
let unieElRects, unieBb;


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

                svg.append(ray, rayX, rayY);
                svg.append(circleMaxThreshold, circleMinThreshold, circleDeadThreshold);

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

                //Load init prop data unie
                for (const [k, v] of Object.entries(UnieBody)) {
                    UnieBody[k].originalBoundClientRect = v.el.getBoundingClientRect();
                }

                UpdateViewboxData();	

                drawCharacterBones();
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
			UnieBody.armL.el.classList.toggle("rotateL");
			UnieBody.armR.el.classList.toggle("rotateR");

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

            //Head Always infront of Torso
            if(v.name == Atlas.torsoFront.name || v.name == Atlas.torsoSide.name){
                UnieBody.character.el.insertBefore(newPart.el, UnieBody.head.el);
            }
            else{
                UnieBody.character.el.appendChild(newPart.el);
            }
            

            part.el.style.display = "none"; 
	        newPart.el.style.display = "";

            UnieBody[k] = newPart;
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
    [unieElRects, unieBb] = [UnieBody.character.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let currPos = {
        x: unieElRects.x + svgX,
        y: unieElRects.y + svgY
    };

    // Svg / Screen = rate ratio
    let ratioW = w/window.innerWidth;
    let ratioH = h/window.innerHeight;
    
    let [newX, newY] = [(newPos[0] + offset[0]) * ratioW, (newPos[1] +  offset[1]) * ratioH ];
    
    
    console.log("Curr", currPos.x, currPos.y)
    console.log("new:", newX, newY)
    console.log("rects", unieElRects.x, unieElRects.y)
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
        console.log("rects", unieElRects.x, unieElRects.y)
        console.log("bbox", unieBb.x, unieBb.y)
    });

    moveUnieAnimation.play();

}


window.addEventListener("pointermove", (ev)=>{
        
    [mouseX, mouseY] = [ev.clientX, ev.clientY];
    let bbox = UnieBody.head.el.getBBox();

    [unieElRects, unieBb] = [UnieBody.head.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let unieOriginScreen = {
        x: unieElRects.x,
        y: unieElRects.y,
        cx: unieElRects.x + unieElRects.width/2,
        cy: unieElRects.y + unieElRects.height/2,
    };

    let unieOriginSvg = {
        x: unieElRects.x + svgX,
        y: unieElRects.y + svgY,
        cx: (unieElRects.x + svgX) + unieElRects.width/2,
        cy: (unieElRects.y + svgY) + unieElRects.height/2,
    };

    let [newMouseX, newMouseY] = [(mouseX - unieElRects.x), (mouseY - unieElRects.y)];
    
    let distPos = {
        x: newMouseX - unieOriginScreen.x,
        y: newMouseY - unieOriginScreen.y,
        cx: newMouseX - unieOriginScreen.cx,
        cy: newMouseY - unieOriginScreen.cy
    }

    let distPosSvg = {
        x: newMouseX - unieOriginSvg.x,
        y: newMouseY - unieOriginSvg.y,
        cx: newMouseX - unieOriginSvg.cx,
        cy: newMouseY - unieOriginSvg.cy,
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

    Unie.lookAtPosition.x = newMouseX;
    Unie.lookAtPosition.y = newMouseY;
    
    /*Unie top left*/
    /* setLine(ray, unieOriginSvg.x, unieOriginSvg.y, x, y);
    setLine(rayX, unieOriginSvg.x, unieOriginSvg.y, x, unieOriginSvg.y);
    setLine(rayY, unieOriginSvg.x, unieOriginSvg.y, unieOriginSvg.x, y); */
    
    /* Unie center */
    setLine(ray, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, newMouseX, newMouseY);
    setLine(rayX, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, newMouseX, getSvgObjectCoordinates(UnieBody.head.el).cy);
    setLine(rayY, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, getSvgObjectCoordinates(UnieBody.head.el).cx, newMouseY);

    setCircle(circleMaxThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, maxMouseFollowDistance);
    setCircle(circleMinThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, minMouseFollowDistance);
    setCircle(circleDeadThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, deadMouseFollowDistance);

});



/**
 * @typedef {Object} SvgCoordinateAdjusted
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} cx 
 * @param {Number} cy 
 */

/**
 * 
 * @param {SVGElement} svgId 
 * @returns {SvgCoordinateAdjusted} Adjusted Coordinates 
 */
function getSvgObjectCoordinates(svgId){
    let svgObj;
    if(typeof svgId == "object"){
        svgObj = svgId;
    }
    else if(typeof svgId == "string"){
        svgObj = document.getElementById(svgId);
    }

    let rects = svgObj.getBoundingClientRect();

    let coordinateObj = {
        x: rects.x + svgX,
        y: rects.y + svgY,
        cx: (rects.x + svgX) + rects.width / 2,
        cy: (rects.y + svgY) + rects.height / 2,
    }
    return coordinateObj;
}

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

function setCircle(circle, cx, cy, r){
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);    
}

function toFullCircleAngle(angle){
    return((angle + 360) % 360);
}

let boneList = [];
function drawCharacterBones(){
    for (let [k, prop] of Object.entries(UnieBody)) {

        let bone = {
            el: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
            originalComputed: getComputedStyle(prop.el),
        } 
        bone.el.style = "fill: black;"
        bone.el.setAttribute("cx", prop.el.getBoundingClientRect().x + prop.el.getBoundingClientRect().width / 2);
        bone.el.setAttribute("cy", prop.el.getBoundingClientRect().y + prop.el.getBoundingClientRect().height / 2);
        bone.el.setAttribute("r", "3");

        boneList.push(bone);
        svg.append(bone.el);
    }
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
let lookSide;

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
    
    lookSide = cos > 90 ? 180 : 0;

    //Definir qual cabeca usar com rotacao
    if(cos <= 20 || cos >= 160){
        SetBody(UnieBody.head, Atlas.headSide2);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else if ((cos > 20 && cos <= 60) || (cos < 160 && cos >= 120)){
        SetBody(UnieBody.head, Atlas.headSide1);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else{
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
    }

    //Distancia minima para angular cabeca?
    let [computedTranslateHeadX, computedTranslateHeadY] = [parseFloat(getComputedStyle(UnieBody.head.el).translate.split(" ")[0]), parseFloat(getComputedStyle(UnieBody.head.el).translate.split(" ")[1])];
    if(typeof computedTranslateHeadX != "number"){
        computedTranslateHeadX = 0;
    }

    if(typeof computedTranslateHeadY != "number"){
        computedTranslateHeadX = 0;
    }

    let [headCx, headCy] = [(UnieBody.head.el.getBoundingClientRect().x + UnieBody.head.el.getBoundingClientRect().width/2) - computedTranslateHeadX, (UnieBody.head.el.getBoundingClientRect().y + UnieBody.head.el.getBoundingClientRect().height/2) - computedTranslateHeadY]
    let [distX, distY] = [Unie.lookAtPosition.x - headCx, Unie.lookAtPosition.y - headCy];
    
    let dist = Math.sqrt(distX * distX + distY * distY);

    let data = {
        mouseX: mouseX,
        mouseY: mouseY,
        headCx: headCx,
        headCy: headCy,
        distX: distX,
        distY: distY,
        dist: dist,
        computedTranslateHeadX: computedTranslateHeadX,
        computedTranslateHeadY: computedTranslateHeadY,
        test1: typeof computedTranslateHeadX,
        test2: typeof computedTranslateHeadY
    }
    console.table(data)
    if(dist >= deadMouseFollowDistance){
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
        
        if(dist > minMouseFollowDistance){
            //console.log("Safe distance");
            UnieBody.head.el.style.translate = `${(distX+headCx)/10}px ${(distY+headCy)/10}px`
        }
        else{
            UnieBody.head.el.style.translate = `${-(distX+headCx)/10}px ${-(distY+headCy)/10}px`
        }
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