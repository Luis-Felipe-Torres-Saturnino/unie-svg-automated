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
        name:"",
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
    console.log(unieBodyParent)

    for (let [k, v] of Object.entries(UnieBody)) {
        //console.log("Searching... \n",k, v);
        if(v.name == part.name){
            console.log("found");
            
            

            atlas.appendChild(part.el);
            UnieBody.character.el.appendChild(newPart.el);

            part.el.style.display = "none"; 
	        newPart.el.style.display = "";

            UnieBody[k] = newPart;
            console.log(UnieBody);
            console.log(UnieBody[k]);

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


const CartesianPlane = window.addEventListener("pointermove", (ev)=>{
        
    [mouseX, mouseY] = [ev.clientX, ev.clientY];
    let bbox = UnieBody.head.el.getBBox();

    [unieRects, unieBb] = [UnieBody.character.el.getBoundingClientRect(), UnieBody.character.el.getBBox()];

    let unieOriginScreen = {
        x: unieRects.x,
        y: unieRects.y
    };

    let unieOriginSvg = {
        x: unieRects.x + svgX,
        y: unieRects.y + svgY
    };

    let [x, y] = [mouseX - unieRects.x, mouseY - unieRects.y];
    
    let distPos = {
        x: x - unieOriginScreen.x,
        y: y - unieOriginScreen.y
    }

    let distPosSvg = {
        x: x - unieOriginSvg.x,
        y: y - unieOriginSvg.y
    }


    
    //Tangente trata ambos. Cosseno é mais seguro e trata horizontal;

    let dist = Math.sqrt(distPos.x * distPos.x + distPos.y * distPos.y);
    let distSvg = Math.sqrt(distPosSvg.x * distPosSvg.x + distPosSvg.y * distPosSvg.y);

    let ratio = distPosSvg.x / distSvg;

    console.table({
        mouseRelativeSvg: {x: x, y: y},
        currPosScreen: unieOriginScreen,
        distPos: distPos,
        dist:dist,
        distPosSvg: distPosSvg,
        distSvg: distSvg,
        empty: null,
        ratio: ratio,
        angleRadian: Math.acos(ratio),
        angleDegree: toDegrees(Math.acos(ratio)),
    })


    ray.setAttribute('x1', unieOriginSvg.x);
    ray.setAttribute('y1', unieOriginSvg.y);
    ray.setAttribute('x2', x);
    ray.setAttribute('y2', y);

    
    rayX.setAttribute('x1', unieOriginSvg.x);
    rayX.setAttribute('y1', unieOriginSvg.y);
    rayX.setAttribute('x2', x);
    rayX.setAttribute('y2', unieOriginSvg.y);

    rayY.setAttribute('x1', unieOriginSvg.x);
    rayY.setAttribute('y1', unieOriginSvg.y);
    rayY.setAttribute('x2', unieOriginSvg.x);
    rayY.setAttribute('y2', y);


    

   /*  let data = {
        x:x,
        y:y,

        dist: dist,
        ratio: distPos.y / dist,
        degree: degree,
        "Ângulo real(?)": Math.acos(ratio),
    }
    
    
    console.table(data); */
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
