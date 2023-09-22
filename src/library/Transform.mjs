export class Transform{
    position = [0, 0, 0]
    rotation = [0, 0, 0]
    scale = [0, 0, 0]

    static identity = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    constructor(){
        return [
            this.position,
            this.rotation,
            this.scale
        ]
    }
}