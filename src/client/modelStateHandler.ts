export default class ModelStateHandler<DTO> {
    private _currentState: DTO;
    private _lastState   : DTO;
    private _lastUpdate: number;

    public get current(): DTO { return this._currentState;  }
    public get last()   : DTO { return this._lastState; }
    public get lastUpdate(): number { return this._lastUpdate; }

    constructor(state: DTO) {
        this._currentState = state;
        this._lastState = state;
    }

    public setState(newState: DTO) {
        this._lastState = this.current;
        this._currentState = newState;

        this._lastUpdate = Date.now();
    }
}