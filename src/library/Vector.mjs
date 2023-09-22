/**
 * 
 * @description Classe para manipular vetores de duas dimensões.
 * @class 
 */
export class Vector2{
    x;
    y;
    magnitude;
    normal;
    
    static unit = [1, 1];
    static null = [0, 0];

    static zero = [0, 0];
    static one = [1, 1];

    static right = [1, 0]
    static up = [0, 1]
    static left = [-1, 0]
    static down = [0, -1]

    /*===== Helper functions =====*/

    // Private helper function for parameter validation and normalization
    #_normalizeParams(x, y) {
        if (typeof x === 'number' && typeof y === 'number') {
            return { x, y };
        } 
        else if (Array.isArray(x) && x.length === 2 && typeof x[0] === 'number' && typeof x[1] === 'number') {
            return { x: x[0], y: x[1] };
        } 
        else if (typeof x === 'object' && 'x' in x && 'y' in x && typeof x.x === 'number' && typeof x.y === 'number') {
            return { x: x.x, y: x.y };
        } 
        else {
            throw new Error('Invalid parameters for Vector2');
        }
    }

    /*=======================*/


    /**
     * Soma dois vetores e retorna um novo objeto Vector2
     * @param {Vector2} v1
     * @param {Vector2} v2 
     * @returns {Vector2} Novo Vetor resultante
     */
    static SumVectors(v1, v2){
        let [newX, newY] = [v1.x + v2.x, v1.y + v2.y];
        return new Vector2(newX, newY);
    }

    /**
     * Soma os componentes de outro vetor neste objeto
     * @param {Vector2} v1 
     */
    SumVectors(v1){
        this.x += v1.x;
        this.y += v1.y;
    }

    /**
     * Calcula os valores de um vetor normalizado
     * @param {Vector2} vector Vetor base
     * @returns {Array<Number>} Vetor normalizado
    */
    static Normal(vector){
        return [vector.x/vector.magnitude, vector.y/vector.magnitude]
    }

    /**
     * Calcula os valores deste vetor normalizado
     * @returns {Array<Number>} Valores normaliados
     */
    Normal(){
        return [this.x/this.magnitude, this.y/this.magnitude];
    }
    
    /**
     * Normaliza este vetor. É UM PROCESSO IRREVERSÍVEL!
    */
    Normalize(){
        if(this.IsNullVector()){
            throw Error("Impossível normalizar vetores nulos")
        }
        this.x /= this.magnitude;
        this.y /= this.magnitude;
    }
    /**
     * Calculates the magnitude/length of a given vector.
     * @param {Vector2} vector 
     * @param {Number} [y] 
     * @returns {Number} The magnitude of the vector
     */
    static DistanceSqrt(vector, y){
        let magnitude;
        if(vector instanceof Vector2){
            magnitude = Math.sqrt(vector.x**2 + vector.y**2); 
        }
        else{
            if(typeof vector !== "number" || typeof y !== "number") throw TypeError(`INPUTS X: ${typeof vector, vector}, Y: ${typeof y, y} ARE NOT NUMBERS`);
            magnitude = Math.sqrt(vector**2 + y**2);
        }
        
        return magnitude;
    }

    /**
     * 
     * @returns {Number} A magnitude/comprimento deste vetor
     */
    DistanceSqrt(){
        return Math.sqrt(this.x**2 + this.y**2); 
    }

    /**
     * 
     * @param {Vector2} vector 
     * @returns {boolean}
     */
    static IsNullVector(vector){
        return (vector.x == 0 && vector.y == 0) ? true : false;
    }

    IsNullVector(){
        return (this.x == 0 && this.y == 0) ? true : false;
    }

    static Values(vector, component = null){
        if(component == "x"){
            return vector.x;
        } 
        else if(component == "y"){
            return vector.y;
        }
        else{
            return [vector.x, vector.y]
        }
    }

    Values(component){
        if(component == "x"){
            return this.x;
        } 
        else if(component == "y"){
            return this.y;
        }
        else{
            return [this.x, this.y]
        }
    }
    /**
     * Cria um vetor de duas dimensões;
     * @param {(Number | Array<Number> | Object)} x 
     * @param {Number} [y] 
     * @returns {Vector2}
     */
    constructor(x = 0, y = 0){
        if(Array.isArray(x)){
            if(x.length !== 2) throw Error(`Array: ${x} não formatado corretamente`);
            this.x = x[0];
            this.y = x[1];
        }
        else if(typeof x == "object"){
            this.x = x.x;
            this.y = x.y;
            if(!x.x){
                console.warn(`Empty X value: ${x.x}. Defaulting to 0`);
                this.x = 0;    
            }
            
            if(!x.y){
                console.warn(`Empty X value: ${x.y} Defaulting to 0`);
                this.y = 0;
            }
        }
        else if(typeof x !== "number" || typeof y !== "number"){
            throw TypeError(`INPUTS X: ${typeof x, x}, Y: ${typeof y, y} ARE NOT NUMBERS`);
        }
        else{
            this.x = x ? x : 0;
            this.y = y ? y : 0;
        }

        this.magnitude = this.DistanceSqrt(this.x, this.y);
        this.normal = this.Normal();
    };
}

/**
 * 
 * @description Classe para manipular vetores de duas dimensões.
 * @class 
 */
export class Vector3{
    static zero = [0, 0, 0];
    static one = [1, 1, 1];
    
    static right = [1, 0, 0];
    static up = [0, 1, 0];
    static left = [-1, 0, 0];
    static down = [0, -1, 0];

    /**
     * Soma dois vetores
     * @param {Vector2} v1
     * @param {Vector2} v2 
     * @returns {Vector2} Vetor resultante
     */
    static sumVectors(v1, v2){
        return [v1[0] + v2[0], v1[1] + v2[1]]
    }

    /**
     * Instancia um vetor de duas dimensões;
     * @param {Number} x 
     * @param {Number} y 
     * @returns {Vector2} Vetor de duas dimensões
     */
    constructor(x = 0, y = 0){
        if(typeof x !== "number" || typeof y !== "number"){
            throw TypeError(`INPUTS X: ${typeof x, x}, Y: ${typeof y, y} ARE NOT NUMBERS`);
        }
        return [x, y]
    };
}