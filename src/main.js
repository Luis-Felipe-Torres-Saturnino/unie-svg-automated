"use strict";   //True js dev mode

/**
 * @todo
 * 1. Make lookAt be the main driver of Unie behaviors
 *  a) toggle between specific point or mouse
 * 
 * Fix head angle after max threshold (math)
 * Use requestAnimatioFrame
 * Make the Update Cycle depend on
 *  -Always moving
 *  -Always when mouse moves
 *  -Always when object move
 * Study use case of SVG 'Symbol' and '<use>'. Performance may degrade, but help designers profoundly
 * Create a better mapper and an interface for UnieBody and Atlas. It just sucks to hardcode
 * God help you trying to adequately animate the body with head as reference (IK principles?)
 * 
 * @TodoImportant
 * -Interromper cabeça translate.
 * -Criar Lib visual para debug
 * -Criar layers para debug visual
 * -Melhorar ciclo de atualizaçao visual e do unie
 * -Substituir mover cabeça para usar "estados";
 * -Atualizar matemática e usar biblioteca Vector2
 * -(opt) Experimentar lib Vector2 usar HOF
 *  
 * 
*/

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
    lookAt:{
        transform:{

        },
        fixedTransform:{

        },
        quadrant: "",
    },
    lookAtAngle: {
        sin: null,
        cos: null,
        sinFixed: null,
        cosFixed: null,
    },
    lookAtPosition: {
        x: 0,
        y: 0,
    },
    forceHeadFrontOnLowAngle: true,
    isMouseFollow: true,
    
    body: UnieBody,
}

let armatureFixed = document.createElementNS("http://www.w3.org/2000/svg", "g");
armatureFixed.id = "bone-armature";

let main, svg;

let viewBox;
let w, h, svgX = 0, svgY = 0, ratio;
const SizingStep = 25;


let ray = createSVGElement("line", {id: 'ray', stroke: 'black', "stroke-width": "2px"});
let rayX = createSVGElement("line", {id:"rayX", stroke: "red", "stroke-width": "2px"});
let rayY = createSVGElement("line", {id: "rayY", "stroke": "green", "stroke-width": "2px"});


const deadMouseFollowDistance = 90;
let circleDeadThreshold = createSVGElement("circle", {"style": "fill: #99009966; stroke-width: 1px; stroke: black"});

const minMouseFollowDistance = 175;
let circleMinThreshold = createSVGElement("circle", {"style": "fill: #dd00dd66; stroke-width: 1px; stroke: black"});

const maxMouseFollowDistance = 400;
let circleMaxThreshold = createSVGElement("circle", {"style":"fill: #caca0066; stroke-width: 1px; stroke: black"});

let mouseSvgX, mouseSvgY;
let unieOriginRect, unieOriginRectFixed, unieBb;
let unieOriginSvg, unieOriginSvgFixed;

/**
 * Load SVG into page
 */
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

                UnieBody.character.el.append(armatureFixed);
                boneList.forEach((bone)=>{
                    armatureFixed.append(bone.el);
                })
			});
		});
};
load();

/** SVG & Animations via Keyboard control */
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

			UnieBody.armL.el.addEventListener("animationend", (ev) => {
				console.log("finished");
			});

			UnieBody.armR.el.addEventListener("animationend", (ev) => {
				console.log("finished");
			});
			break;
		case "x":
            Unie.isMouseFollow = !Unie.isMouseFollow;
			break;
		case "c":
			break;

		case "k":
            const newPos = [Math.random()*window.innerWidth, Math.random()*window.innerHeight]
            move(newPos, [svgX, svgY]);
			break;

		default:
			break;
	}
});

/** Adapt viewbox on rezise */
window.addEventListener("resize", (ev)=>{
    svg.setAttribute("viewBox", `${svgX} ${svgY} ${innerWidth} ${innerHeight}`);
    UpdateViewboxData();
});



window.addEventListener("pointermove", (ev)=>{
    [mouseSvgX, mouseSvgY] = [(ev.clientX + svgX), (ev.clientY + svgY)];
    Unie.lookAtPosition.x = mouseSvgX;
    Unie.lookAtPosition.y = mouseSvgY;
    

    [unieOriginRect, unieBb, unieOriginRectFixed] = [UnieBody.head.el.getBoundingClientRect(), UnieBody.character.el.getBBox(), boneList[1].el.getBoundingClientRect()];

    unieOriginSvg = {
        x: unieOriginRect.x + svgX,
        y: unieOriginRect.y + svgY,
        cx: (unieOriginRect.x + svgX) + unieOriginRect.width/2,
        cy: (unieOriginRect.y + svgY) + unieOriginRect.height/2,
    };

    unieOriginSvgFixed = {
        x: unieOriginRectFixed.x + svgX,
        y: unieOriginRectFixed.y + svgY,
        cx: (unieOriginRectFixed.x + svgX) + unieOriginRectFixed.width/2,
        cy: (unieOriginRectFixed.y + svgY) + unieOriginRectFixed.height/2,
    };

    
    
    let distPosSvg = {
        x: mouseSvgX - unieOriginSvg.x,
        y: mouseSvgY - unieOriginSvg.y,
        cx: mouseSvgX - unieOriginSvg.cx,
        cy: mouseSvgY - unieOriginSvg.cy,
    }

    let distPosSvgFixed = {
        x: mouseSvgX - unieOriginSvgFixed.x,
        y: mouseSvgY - unieOriginSvgFixed.y,
        cx: mouseSvgX - unieOriginSvgFixed.cx,
        cy: mouseSvgY - unieOriginSvgFixed.cy,
    }

    let distSvgCenter = Math.sqrt((distPosSvg.cx * distPosSvg.cx) + (distPosSvg.cy * distPosSvg.cy));
    let distSvgCenterFixed = Math.sqrt((distPosSvgFixed.cx * distPosSvgFixed.cx) + (distPosSvgFixed.cy * distPosSvgFixed.cy));
    
    let cosineSvg = distPosSvg.cx / distSvgCenter;
    let cosineSvgFixed = distPosSvgFixed.cx / distSvgCenterFixed;

    //Invert sign because mouse (starting points) is at upper left [0, y], not down left [0, 0];
    let sineSvg = -(distPosSvg.cy / distSvgCenter);
    let sineSvgFixed = -(distPosSvgFixed.cy / distSvgCenterFixed);

    Unie.lookAtAngle.sin = Math.asin(sineSvg);
    Unie.lookAtAngle.cos = Math.acos(cosineSvg); 
    Unie.lookAtAngle.sinFixed = Math.asin(sineSvgFixed);
    Unie.lookAtAngle.cosFixed = Math.acos(cosineSvgFixed); 


        
    DEBUG_DrawGizmos(GizmoHeadReference.HEAD_FIXED);

    /*
        Visually defining Unie directions, LookAt and Head Bobbing
    */
    let [sinDeg, cosDeg] = [toDegrees(Unie.lookAtAngle.sinFixed), toDegrees(Unie.lookAtAngle.cosFixed)]

    Unie.lookAt.quadrant = "";
    if(Unie.lookAtAngle.sinFixed > 0 && Unie.lookAtAngle.sinFixed <= Math.PI/2){
        Unie.lookAt.quadrant += "Upper"
    }
    else{
        Unie.lookAt.quadrant += "Lower"
    }

    if(Unie.lookAtAngle.cosFixed > 0 && Unie.lookAtAngle.cosFixed < Math.PI/2){
        Unie.lookAt.quadrant += " Right"
    }
    else{
        Unie.lookAt.quadrant += " Left"
    }
    
    lookSide = cosDeg > 90 ? 180 : 0;

    //Definir qual cabeca usar com rotacao em torno do eixo Y.
    if(cosDeg <= 20 || cosDeg >= 160){
        Unie.forceHeadFrontOnLowAngle = false;
        SetBody(UnieBody.head, Atlas.headSide2);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else if ((cosDeg > 20 && cosDeg <= 60) || (cosDeg < 160 && cosDeg >= 120)){
        Unie.forceHeadFrontOnLowAngle = false;
        SetBody(UnieBody.head, Atlas.headSide1);
        SetBody(UnieBody.torso, Atlas.torsoSide);
    }
    else{        
        Unie.forceHeadFrontOnLowAngle = true;
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
    }

    //Angular cabeça
    //Distancia minima para angular cabeca?
    let [headFixedCxAdapted, headFixedCyAdapted] = [unieOriginSvgFixed.cx, unieOriginSvgFixed.cy]
    let [headCxAdapted, headCyAdapted] = [UnieBody.head.el.getBoundingClientRect().left - UnieBody.head.el.getBoundingClientRect().width/2, UnieBody.head.el.getBoundingClientRect().top - UnieBody.head.el.getBoundingClientRect().height/2]
    let [distX, distY] = [Unie.lookAtPosition.x - headFixedCxAdapted, Unie.lookAtPosition.y - headFixedCyAdapted];
    
    let dist = Math.sqrt(distX * distX + distY * distY);

    //Arbitrario
    const headFollowMouseCoeficient = {
        x: 1,
        y: 1,
    };

    //Rotacionar cabeça em distância minima
    if(dist > deadMouseFollowDistance){
        //Look left?
        if(cosDeg > 90){
            lookSide = 180;
            UnieBody.head.el.style = `transform: rotateZ(${sinDeg}deg) rotateY(${lookSide}deg)`
        }
        else{
            lookSide = 0;
            UnieBody.head.el.style = `transform: rotateZ(${-sinDeg}deg) rotateY(${lookSide}deg)`
        }
    }
    else{
        UnieBody.head.el.style = `transform: rotateZ(${0}deg) rotateY(${0}deg)`
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
    }
    
    UnieBody.torso.el.style = `transform: rotateY(${lookSide}deg)`
    
    if(Unie.forceHeadFrontOnLowAngle){
        SetBody(UnieBody.head, Atlas.headFront);
        SetBody(UnieBody.torso, Atlas.torsoFront);
        UnieBody.head.el.style = `transform: rotateZ(${0}deg) rotateY(${0}deg)`
        UnieBody.torso.el.style = `transform: rotateY(${0}deg)`
    }

    
    /**@todo ROTATE HEAD BASED ON MOUSE POSITION*/


/*     let translate = {
        x: (distX + headCxAdapted) - minMouseFollowDistance,
        y: (distY + headCyAdapted) - minMouseFollowDistance,
    } */
    let translate = {
        x: (headFixedCxAdapted + distX) - UnieBody.head.el.getBoundingClientRect().width/2,
        y: (headFixedCyAdapted + distY) - UnieBody.head.el.getBoundingClientRect().height/2
    }

    if(Unie.isMouseFollow){
        let finalTranslate = {
            x: 0,
            y: 0
        };

        if(dist < deadMouseFollowDistance){
            console.log("Dead distance")
            finalTranslate.x = translate.x/-headFollowMouseCoeficient.x
            finalTranslate.y = translate.y/-headFollowMouseCoeficient.y
        }
        else if(dist < minMouseFollowDistance){
            console.log("Follow up distance")
            
            let originAdapted = [distX/minMouseFollowDistance * 2, distY/minMouseFollowDistance * 2];
            let coeficientAdapted = [(-headFollowMouseCoeficient.x + originAdapted[0]), (-headFollowMouseCoeficient.y + originAdapted[1])]
            
            if(originAdapted[0] < 0){
                coeficientAdapted[0] = -(-headFollowMouseCoeficient.x + originAdapted[0]) 
            }

            if(originAdapted[1] < 0){
                coeficientAdapted[1] = (-headFollowMouseCoeficient.y - originAdapted[1])
            }

            let translateAdapted = [(translate.x - minMouseFollowDistance) + (translate.x * coeficientAdapted[0]),
                                 (translate.y - minMouseFollowDistance) + (translate.y * coeficientAdapted[1])]

            if(originAdapted[0] < 0){
                translateAdapted[0] = -(translate.x - minMouseFollowDistance) + (translate.x * coeficientAdapted[0])
            }

            if(originAdapted[1] < 0){
                translateAdapted[1] = -(translate.y + minMouseFollowDistance) + (translate.y * coeficientAdapted[1])
            }

            console.table({
                minmouse: deadMouseFollowDistance,
                maxMouse: minMouseFollowDistance,
                transX: distX/minMouseFollowDistance,
                transXAdapted: originAdapted,
                AbstransXAdapted: Math.abs(originAdapted[0]),
                newCoefic: coeficientAdapted,
                translateAdapted: translateAdapted
            })
           
            finalTranslate.x = translate.x/(headFollowMouseCoeficient.x);
            finalTranslate.y = translateAdapted[1]/(headFollowMouseCoeficient.y);
           
            //We defaulting it
            /* finalTranslate.x = translate.x/coeficient.x
            finalTranslate.y = translate.y/coeficient.y */

        }
        else if(dist <= maxMouseFollowDistance){
            console.log("Safe Distance")
            finalTranslate.x = translate.x/headFollowMouseCoeficient.x
            finalTranslate.y = translate.y/headFollowMouseCoeficient.y
        }
        else if(dist > maxMouseFollowDistance){
            //Clamp X and Y
            console.log("X Y - Over the limit");
            finalTranslate.x = maxMouseFollowDistance*cosineSvgFixed/headFollowMouseCoeficient.x
            finalTranslate.y = -(maxMouseFollowDistance*sineSvgFixed/headFollowMouseCoeficient.y)
        }

        UnieBody.head.el.style.translate = `${finalTranslate.x}px ${finalTranslate.y}px`
    }

    

    /* let data = {
        maxMouseFollowDistance: maxMouseFollowDistance,
        distX: distX,
        distY:distY,
        dist: dist,
        sineSvgFixed: sineSvgFixed,
        cosineSvgFixed: cosineSvgFixed,
        translate: translate
    }
    console.table(data); */

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
    if(line == null){

    }
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

/**
 * Quickly creates SVG elements and append attributes to them. Any attribute will be added, whether it exists in HTML, SVG or not
 * @param {keyof SVGElementTagNameMap} el
 * @param {Object} attributes
 * @returns {SVGElement} Element configured with given attributes
 */
function createSVGElement(el, attributes){
    let element = document.createElementNS("http://www.w3.org/2000/svg", el);
    for (const [k, v] of Object.entries(attributes)) {
        element.setAttribute(k, v);
    }
    return element;
}


/**
 * Swaps Unie body parts. 
 * @param {HTMLElement} part 
 * @param {HTMLElement} newPart
 */
function SetBody(part, newPart) {
    let atlas = document.getElementById("Sprite_Atlas")

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
            
            //Append armature last always (to paint over for better seeing);
            UnieBody.character.el.append(armatureFixed);

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
    [unieOriginRect, unieBb] = [UnieBody.character.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let currPos = {
        x: unieOriginRect.x + svgX,
        y: unieOriginRect.y + svgY
    };

    // Svg / Screen = rate ratio
    let ratioW = w/window.innerWidth;
    let ratioH = h/window.innerHeight;
    
    let [newX, newY] = [(newPos[0] + offset[0]) * ratioW, (newPos[1] +  offset[1]) * ratioH ];
    
    
    console.log("Curr", currPos.x, currPos.y)
    console.log("new:", newX, newY)
    console.log("rects", unieOriginRect.x, unieOriginRect.y)
    console.log("bbox", unieBb.x, unieBb.y)


    /** @type {Animation} */
    let moveUnieAnimation;k

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
        console.log("rects", unieOriginRect.x, unieOriginRect.y)
        console.log("bbox", unieBb.x, unieBb.y)
    });

    moveUnieAnimation.play();

}



let boneList = [];
function drawCharacterBones(){
    for (let [k, prop] of Object.entries(UnieBody)) {

        let bone = {
            id: `bone-${prop.name}`,
            el: document.createElementNS("http://www.w3.org/2000/svg", "circle"),
            svgEl: prop.el,
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


const GizmoHeadReference = {
    HEAD: "head",
    HEAD_FIXED: "headFixed",
}

/**
 * @param {GizmoHeadReference} mode 
 */
function DEBUG_DrawGizmos(mode){

    mode = !mode ? GizmoHeadReference.HEAD : mode;

    switch(mode){
        case GizmoHeadReference.HEAD:
            /* Draw reference lines -- Unie Head Center */
            setLine(ray, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, mouseSvgX, mouseSvgY);
            setLine(rayX, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, mouseSvgX, getSvgObjectCoordinates(UnieBody.head.el).cy);
            setLine(rayY, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, getSvgObjectCoordinates(UnieBody.head.el).cx, mouseSvgY);

            setCircle(circleMaxThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, maxMouseFollowDistance);
            setCircle(circleMinThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, minMouseFollowDistance);
            setCircle(circleDeadThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, deadMouseFollowDistance);
        break;

        case GizmoHeadReference.HEAD_FIXED:
            /* Draw reference lines -- Unie Head Center */
            setLine(ray, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, mouseSvgX, mouseSvgY);
            setLine(rayX, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, mouseSvgX, unieOriginSvgFixed.cy);
            setLine(rayY, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, unieOriginSvgFixed.cx, mouseSvgY);

            setCircle(circleMaxThreshold, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, maxMouseFollowDistance);
            setCircle(circleMinThreshold, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, minMouseFollowDistance);
            setCircle(circleDeadThreshold, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, deadMouseFollowDistance);
        break;
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



/**
 * @typedef Skeleton
 * @property {Bone} rootBone
 * @property {String} Label
*/

/**
 * @typedef Bone
 * @property {Array<Bone>} childBones children bones associated with this bone
 * @property {String} label
*/

/**
 * @typedef BodyPart
 * @property {String} label 
 * @property {SVGElement} element
 */

/**
 * Calculate a number linearly proportional to a starting nubmer and ending number. 
 * The parametric value represents the "progress" ratio, normally between [0, 1]. Other values can also be stated
 * @param {Number} a Starting Point 
 * @param {Number} b Ending point
 * @param {Number} t Parameter. Usually between [0, 1]
 * @returns {Number}
 */
function lerp(a, b, t){
    return a + (b - a) * t;
}