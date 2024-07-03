export class UidGenerator {
    private currentId: number;

    constructor() {
        this.currentId = 0;
    }

    public nextId(): number {
        this.currentId = (this.currentId + 1) >>> 0; // Wrapping addition for 32-bit unsigned integer
        return this.currentId;
    }
}