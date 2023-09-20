'use strict';

/** @type {HTMLElement} */
let _svg = document.getElementById("svg");

let holdState = false;

let [mouseDeltaX, mouseDeltaY] = [0, 0];
let mouseOriginX, mouseOriginY;

const SWIPE_SPEED = 0.7;

window.addEventListener("mousemove", ev=>{
    console.log(`MOUSE: [${ev.clientX}, ${ev.clientY}]`) 
})

/* let svgViewBox = _svg.getAttribute("viewBox").split(" "); */
let svgViewBox = _svg.getAttribute("viewBox").split(" ").map((value) => parseFloat(value));
/* let [svgX, svgY] = [parseFloat(svgViewBox[0]), parseFloat(svgViewBox[1])]; */
let [_newSvgX, _newSvgY] = [svgViewBox[0], svgViewBox[1]];

_svg.addEventListener("mousedown", (ev)=>{
    holdState = true;
    [mouseOriginX, mouseOriginY] = [ev.clientX, ev.clientY];
    _svg.style.backgroundColor = "#22fd22aa";
    
    console.table({originX: mouseOriginX, originY: mouseOriginY});
});

_svg.addEventListener("mouseup", (ev)=>{
    holdState = false;
    _svg.style.backgroundColor = ""
    svgViewBox = _svg.getAttribute("viewBox").split(" ").map((value) => parseFloat(value));
});

_svg.addEventListener("mousemove", (ev)=>{
    if(!holdState) return;

    mouseDeltaX = parseFloat(ev.clientX - mouseOriginX);    
    mouseDeltaY = parseFloat(ev.clientY - mouseOriginY);

    // Because mouse origin is left top and we want to mimify a mobile scrolling behavior
    // We invert vertical and horizontal swipes for better UX.

    _newSvgX = (-mouseDeltaX + svgViewBox[0]) * SWIPE_SPEED;
    _newSvgY = (-mouseDeltaY + svgViewBox[1]) * SWIPE_SPEED;

    console.table({ox: mouseOriginX, oy: mouseOriginY, dx: mouseDeltaX, dy: mouseDeltaY, _newSvgX: _newSvgX, _newSvgY: _newSvgY})

    _svg.setAttribute("viewBox", `${_newSvgX} ${_newSvgY} ${parseFloat(svgViewBox[2])} ${parseFloat(svgViewBox[3])}`);
});