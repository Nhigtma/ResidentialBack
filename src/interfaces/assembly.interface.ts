export class Assembly {
    _id: string;
    date: Date;
    state: State;
}

export enum State {
    PENDING = 'pending',
    STARTED = 'started',
    FINISHED = 'finished',
}