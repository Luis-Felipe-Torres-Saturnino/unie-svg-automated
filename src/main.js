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


/**
 * Plano AGORA
 *  -Unificar objetos: Unie(unieBody, armature), Svg
*/


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
 * @property {String} name
 * @property {SVGElement} el
 * @property {(Array<BodyCategories> | BodyCategories)} category categoria
*/

/**
 * @enum {String}
 */
const BodyCategories = {
    character,
    head,
    torso,
    armL,
    armR,
    eyes,
    eyeLeft,
    eyeRight,
}


let UnieBody = [
    {
        name: "",
        el: null,
        category: BodyCategories.character,
    },
    {
        name: "",
        el: null,
        category: BodyCategories.head,
    },
    {
        name: "",
        el: null,
        category: BodyCategories.torso,
    },
	{
        name: "",
        el: null,
        category: BodyCategories.armL,
    },
	{
        name: "",
        el: null,
        category: BodyCategories.armR,
    },
    {
        name: "",
        el: null,
        category: BodyCategories.eyes,
    },
    {
        name: "",
        el: null,
        category: BodyCategories.eyeLeft,
    },
    {
        name: "",
        el: null,
        category: BodyCategories.eyeRight,
    },
];

let Atlas = {
    /**@type {Array<BodyPart>} */
    UnieBodyParts: [
        {
            name: "UniePose__Character",
            el:"",
            category: ["character"]
        },
        {
            name:"UniePose__Head",
            el: "",
            category: [BodyCategories.head]

        },     
        {
            name:"Unie__Head_Side1",
            el: "",
            category: [BodyCategories.head]
        },     
        {
            name:"Unie__Head_Side2",
            el: "",
            category: [BodyCategories.head]
        },     
        {
            name:"UniePose__Torso",
            el: "",
            category: [BodyCategories.torso]
        },     
        {
            name:"Unie__Torso_Side",
            el: "",
            category: [BodyCategories.torso]
        },
        {
            name:"UniePose__Arm_R",
            el: "",
            category: [BodyCategories.armR]
        },
        {
            name:"UniePose__Arm_L",
            el: "",
            category: [BodyCategories.armL]
        },
        {
            name:"Braco_lado_R",
            el: "",
            category: [BodyCategories.armR]
        },
        {
            name:"Braco_lado_L",
            el: "",
            category: [BodyCategories.armL]
        },
        {
            name: "UniePose__Eye_L",
            el:"",
            category: [BodyCategories.eyeLeft]
        },
        {
            name: "UniePose__Eye_R",
            el:"",
            category: [BodyCategories.eyeRight]
        },
        {
            name: "UniePose__Eyes",
            el:"",
            category: [BodyCategories.eyes]
        },
    ],
    
};


let Unie = {
    /**@type {Array<BodyPart>} */
    body: UnieBody,
    lookAt:{
        position: {
            x: 0,
            y: 0
        },
        angle:{
            sin: null,
            cos: null,
            sinFixed: null,
            cosFixed: null,
        },
        quadrant: "",
    },
    forceHeadFrontOnLowAngle: true,
    isMouseFollow: true,
}

let Mouse = {
    x : 0,
    y : 0,

    svg:{
        x : 0,
        y:  0,
    }
}


let main;

let svg = {
    htmlElement: undefined,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    ratio: 0,
    viewBox: [],
    translateStep: 25,
    sizingStep: 25
}

let armatureFixed = createSVGElement("g", {id: "bone-armature"});
let debugLayer = createSVGElement("g", {id: "SVG__DEBUG"})

let ray = createSVGElement("line", {id: 'ray', "stroke": 'black', "stroke-width": "2px"});
let rayX = createSVGElement("line", {id:"rayX", "stroke": "red", "stroke-width": "2px"});
let rayY = createSVGElement("line", {id: "rayY", "stroke": "green", "stroke-width": "2px"});


const deadMouseFollowDistance = 90;
let circleDeadThreshold = createSVGElement("circle", {"style": "fill: #99009966; stroke-width: 1px; stroke: black"});

const minMouseFollowDistance = 175;
let circleMinThreshold = createSVGElement("circle", {"style": "fill: #dd00dd66; stroke-width: 1px; stroke: black"});

const maxMouseFollowDistance = 400;
let circleMaxThreshold = createSVGElement("circle", {"style":"fill: #caca0066; stroke-width: 1px; stroke: black"});

let unieOriginRect, unieOriginRectFixed;
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

				svg.htmlElement = main.firstElementChild;
                svg.htmlElement.setAttribute("viewBox", `0 0 ${innerWidth} ${innerHeight}`);

				svg.htmlElement.setAttribute("width", "100%");
				svg.htmlElement.setAttribute("height", "100%");
				svg.htmlElement.setAttribute("style", "background-color: #0f0f0f9d");
                svg.htmlElement.classList.add("mySvg")


                svg.htmlElement.append(debugLayer);
                debugLayer.append(ray, rayX, rayY);
                debugLayer.append(circleMaxThreshold, circleMinThreshold, circleDeadThreshold);
                
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
                UnieBody.eyeLeft.el= Atlas.eyeLeft.el;  
                UnieBody.eyeLeft.name = Atlas.eyeLeft.name;
                UnieBody.eyeRight.el= Atlas.eyeRight.el;  
                UnieBody.eyeRight.name = Atlas.eyeRight.name;
                UnieBody.eyes.el= Atlas.eyes.el;  
                UnieBody.eyes.name = Atlas.eyes.name;                

                //Load initial body unie
                for (const [k, v] of Object.entries(UnieBody)) {
                    console.log(k, v);
                    UnieBody[k].originalBoundClientRect = v.el.getBoundingClientRect();
                }

                updateViewboxData();	

                drawCharacterBones();

                //This should be temporary
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
				svg.htmlElement.style.display = "";
			}
            else {
				main.style.display = "none";
				svg.htmlElement.style.display = "none";
			}

			break;

		case keyCode.NUMPAD_ADD:
			if (svg.w - svg.sizingStep < 0 || svg.h - svg.sizingStep < 0) return;
			svg.w -= svg.sizingStep;
			svg.h -= svg.sizingStep;			
			break;

		case keyCode.NUMPAD_SUBTRACT:
			svg.w += svg.sizingStep;
			svg.h += svg.sizingStep;
			break;

		case keyCode.LEFT:
			svg.x -= svg.translateStep;
			break;

		case keyCode.RIGHT:
			svg.x += svg.translateStep;
			break;

		case keyCode.UP:
			svg.y -= svg.translateStep;
			break;

		case keyCode.DOWN:
			svg.y += svg.translateStep;
			break;

		default:
			break;
	}

    svg.htmlElement.setAttribute("viewBox", `${svg.x} ${svg.y} ${svg.w} ${svg.h}`);

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
            move(newPos, [svg.x, svg.y]);
			break;

		default:
			break;
	}
});

/** Adapt viewbox on rezise */
window.addEventListener("resize", (ev)=>{
    svg.htmlElement.setAttribute("viewBox", `${svg.x} ${svg.y} ${innerWidth} ${innerHeight}`);
    updateViewboxData();
});


/*
    Bodyparts - label, id, 'transform' --> screenSpace, svgSpace
    Bones - label, id, 'transform' --> x, y, width, hegiht cx, cy.

    Mouse
        -ScrenSpace
        -SvgSpace (screen(transform) + svg(transform))

*/


window.addEventListener("pointermove", (ev)=>{
    [Mouse.x, Mouse.y] = [ev.clientX, ev.clientY];
    [Mouse.svg.x, Mouse.svg.y] = [Mouse.x + svg.x, Mouse.y + svg.y];
    Unie.lookAt.position.x = Mouse.svg.x;
    Unie.lookAt.position.y = Mouse.svg.y;


    [unieOriginRect, unieOriginRectFixed] = [UnieBody.head.el.getBoundingClientRect(), boneList[1].el.getBoundingClientRect()];

    unieOriginSvg = {
        x: unieOriginRect.x + svg.x,
        y: unieOriginRect.y + svg.y,
        cx: (unieOriginRect.x + svg.x) + unieOriginRect.width/2,
        cy: (unieOriginRect.y + svg.y) + unieOriginRect.height/2,
    };

    unieOriginSvgFixed = {
        x: unieOriginRectFixed.x + svg.x,
        y: unieOriginRectFixed.y + svg.y,
        cx: (unieOriginRectFixed.x + svg.x) + unieOriginRectFixed.width/2,
        cy: (unieOriginRectFixed.y + svg.y) + unieOriginRectFixed.height/2,
    };

    
    
    let distPosSvg = {
        x: Mouse.svg.x - unieOriginSvg.x,
        y: Mouse.svg.y - unieOriginSvg.y,
        cx: Mouse.svg.x - unieOriginSvg.cx,
        cy: Mouse.svg.y - unieOriginSvg.cy,
    }

    let distPosSvgFixed = {
        x: Mouse.svg.x - unieOriginSvgFixed.x,
        y: Mouse.svg.y - unieOriginSvgFixed.y,
        cx: Mouse.svg.x - unieOriginSvgFixed.cx,
        cy: Mouse.svg.y - unieOriginSvgFixed.cy,
    }

    let distSvgCenter = Math.sqrt((distPosSvg.cx * distPosSvg.cx) + (distPosSvg.cy * distPosSvg.cy));
    let distSvgCenterFixed = Math.sqrt((distPosSvgFixed.cx * distPosSvgFixed.cx) + (distPosSvgFixed.cy * distPosSvgFixed.cy));
    
    let cosineSvg = distPosSvg.cx / distSvgCenter;
    let cosineSvgFixed = distPosSvgFixed.cx / distSvgCenterFixed;

    //Invert sign because mouse (starting points) is at upper left [0, y], not down left [0, 0];
    let sineSvg = -(distPosSvg.cy / distSvgCenter);
    let sineSvgFixed = -(distPosSvgFixed.cy / distSvgCenterFixed);

    Unie.lookAt.angle.sin = Math.asin(sineSvg);
    Unie.lookAt.angle.cos = Math.acos(cosineSvg); 
    Unie.lookAt.angle.sinFixed = Math.asin(sineSvgFixed);
    Unie.lookAt.angle.cosFixed = Math.acos(cosineSvgFixed); 

        
    DEBUG_DrawGizmos(GizmoHeadReference.HEAD_FIXED);

    /*
        Visually defining Unie directions, LookAt and Head Bobbing
    */
    let [sinDeg, cosDeg] = [toDegrees(Unie.lookAt.angle.sinFixed), toDegrees(Unie.lookAt.angle.cosFixed)]

    Unie.lookAt.quadrant = "";
    if(Unie.lookAt.angle.sinFixed > 0 && Unie.lookAt.angle.sinFixed <= Math.PI/2){
        Unie.lookAt.quadrant += "Upper"
    }
    else{
        Unie.lookAt.quadrant += "Lower"
    }

    if(Unie.lookAt.angle.cosFixed > 0 && Unie.lookAt.angle.cosFixed < Math.PI/2){
        Unie.lookAt.quadrant += " Right"
    }
    else{
        Unie.lookAt.quadrant += " Left"
    }
    
    lookSide = cosDeg > 90 ? 180 : 0;

    //Definir qual cabeca usar com rotacao em torno do eixo Y.
    if(cosDeg <= 20 || cosDeg >= 160){
        Unie.forceHeadFrontOnLowAngle = false;
        setBody(UnieBody.head, Atlas.headSide2);
        setBody(UnieBody.torso, Atlas.torsoSide);
    }
    else if ((cosDeg > 20 && cosDeg <= 60) || (cosDeg < 160 && cosDeg >= 120)){
        Unie.forceHeadFrontOnLowAngle = false;
        setBody(UnieBody.head, Atlas.headSide1);
        setBody(UnieBody.torso, Atlas.torsoSide);
    }
    else{        
        Unie.forceHeadFrontOnLowAngle = true;
        setBody(UnieBody.head, Atlas.headFront);
        setBody(UnieBody.torso, Atlas.torsoFront);
    }

    //Angular cabeça
    //Distancia minima para angular cabeca?
    let [headFixedCxAdapted, headFixedCyAdapted] = [unieOriginSvgFixed.cx, unieOriginSvgFixed.cy]
    let [headCxAdapted, headCyAdapted] = [UnieBody.head.el.getBoundingClientRect().left - UnieBody.head.el.getBoundingClientRect().width/2, UnieBody.head.el.getBoundingClientRect().top - UnieBody.head.el.getBoundingClientRect().height/2]
    let [distX, distY] = [Unie.lookAt.position.x - headFixedCxAdapted, Unie.lookAt.position.y - headFixedCyAdapted];
    
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
        setBody(UnieBody.head, Atlas.headFront);
        setBody(UnieBody.torso, Atlas.torsoFront);
    }
    
    UnieBody.torso.el.style = `transform: rotateY(${lookSide}deg)`
    
    if(Unie.forceHeadFrontOnLowAngle){
        setBody(UnieBody.head, Atlas.headFront);
        setBody(UnieBody.torso, Atlas.torsoFront);
        UnieBody.head.el.style = `transform: rotateZ(${0}deg) rotateY(${0}deg)`
        UnieBody.torso.el.style = `transform: rotateY(${0}deg)`
    }

    
    /**@todo ROTATE HEAD BASED ON MOUSE POSITION*/
    
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
            finalTranslate.x = translate.x/headFollowMouseCoeficient.x
            finalTranslate.y = translate.y/headFollowMouseCoeficient.y

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
        x: rects.x + svg.x,
        y: rects.y + svg.y,
        cx: (rects.x + svg.x) + rects.width / 2,
        cy: (rects.y + svg.y) + rects.height / 2,
    }
    return coordinateObj;
}

function toDegrees(radian){
    return radian * (180/ Math.PI)
}

function updateViewboxData(){
    /** @type {String}*/
    svg.viewBox = svg.htmlElement.getAttribute("viewBox");
    svg.viewBox = svg.viewBox.split(" ");
    svg.w = parseInt(svg.viewBox[2]);
    svg.h = parseInt(svg.viewBox[3]);
    svg.ratio = svg.w / svg.h;
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
function setBody(part, newPart) {
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
    unieOriginRect = UnieBody.character.el.getBoundingClientRect();

    let currPos = {
        x: unieOriginRect.x + svg.x,
        y: unieOriginRect.y + svg.y
    };

    // Svg / Screen = rate ratio
    let ratioW = svg.w/window.innerWidth;
    let ratioH = svg.h/window.innerHeight;
    
    let [newX, newY] = [(newPos[0] + offset[0]) * ratioW, (newPos[1] +  offset[1]) * ratioH ];
    
    
    console.log("Curr", currPos.x, currPos.y)
    console.log("new:", newX, newY)
    console.log("rects", unieOriginRect.x, unieOriginRect.y)

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
        svg.htmlElement.append(bone.el);
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
            setLine(ray, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, Mouse.svg.x, Mouse.svg.y);
            setLine(rayX, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, Mouse.svg.x, getSvgObjectCoordinates(UnieBody.head.el).cy);
            setLine(rayY, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, getSvgObjectCoordinates(UnieBody.head.el).cx, Mouse.svg.y);

            setCircle(circleMaxThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, maxMouseFollowDistance);
            setCircle(circleMinThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, minMouseFollowDistance);
            setCircle(circleDeadThreshold, getSvgObjectCoordinates(UnieBody.head.el).cx, getSvgObjectCoordinates(UnieBody.head.el).cy, deadMouseFollowDistance);
        break;

        case GizmoHeadReference.HEAD_FIXED:
            /* Draw reference lines -- Unie Head Center */
            setLine(ray, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, Mouse.svg.x, Mouse.svg.y);
            setLine(rayX, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, Mouse.svg.x, unieOriginSvgFixed.cy);
            setLine(rayY, unieOriginSvgFixed.cx, unieOriginSvgFixed.cy, unieOriginSvgFixed.cx, Mouse.svg.y);

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