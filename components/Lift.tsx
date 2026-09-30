class Elevator {
    name: string;
    direction: string;
    status: string;
    currentFloor: number;
    next: any[];

    constructor(name: string, floor: number) {
        this.name = name;
        this.direction = "IDLE";
        this.status = "idle";
        this.currentFloor = floor;
        this.next = [];
    }

    addStop(request: any) {
        this.next.push(request);

        if (this.status === "idle") {
            this.run();
        }
    }

    async run() {
        if (this.status !== "idle") return;

        this.status = "running";

        while (this.next.length) {
            const current = this.next.shift();

            const targetFloor = current.floor;

            console.log(
                `${this.name} assigned -> Floor ${targetFloor} ${current.direction}`
            );

            while (this.currentFloor !== targetFloor) {
                if (this.currentFloor < targetFloor) {
                    this.direction = "UP";
                    this.currentFloor++;
                } else {
                    this.direction = "DOWN";
                    this.currentFloor--;
                }

                console.log(
                    `${this.name} at floor ${this.currentFloor}`
                );

                await new Promise((resolve) =>
                    setTimeout(resolve, 500)
                );
            }

            console.log(
                `${this.name} reached floor ${targetFloor}`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );
        }

        this.direction = "IDLE";
        this.status = "idle";
    }
}

class ElevatorController {
    elevators: Elevator[];

    constructor(elevators: Elevator[]) {
        this.elevators = elevators;
    }

    assignRequest(request: any) {
        let bestElevator = this.elevators[0];
        let minDistance = Infinity;

        for (const elevator of this.elevators) {
            const distance = Math.abs(
                elevator.currentFloor - request.floor
            );

            if (distance < minDistance) {
                minDistance = distance;
                bestElevator = elevator;
            }
        }

        bestElevator.addStop(request);

        console.log(
            `${request.floor} ${request.direction} assigned to ${bestElevator.name}`
        );
    }
}

const EL1 = new Elevator("EL1", 6);
const EL2 = new Elevator("EL2", 6);
const EL3 = new Elevator("EL3", 6);

const controller = new ElevatorController([
    EL1,
    EL2,
    EL3,
]);

const requests = [
    { floor: 4, direction: "DOWN" },
    { floor: 3, direction: "DOWN" },
    { floor: 2, direction: "DOWN" },
    { floor: 5, direction: "UP" },
    
];

for (const request of requests) {
    controller.assignRequest(request);
}