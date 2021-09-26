import { SlotMachine } from "../state/SlotMachine";

describe("slot machine", () => {
    const slot = new SlotMachine([5, 10, 20, 30, 40, 50], 0.10);
    it("spins", () => {
        for (let x = 0; x < 10; x++) {
            slot.spin();
        }
    });
});
