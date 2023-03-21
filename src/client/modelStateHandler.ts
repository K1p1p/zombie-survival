export default class ModelStateHandler<DTO> {
    private _currentState: DTO;
    private _lastState   : DTO;

    public get current(): DTO { return this._currentState;  }
    public get last()   : DTO { return this._lastState; }

    constructor(state: DTO) {
        this._currentState = state;
        this._lastState = state;
    }

    public isReady(): boolean {
        if(this._currentState == null) { return false; }
        if(this._lastState    == null) { return false; }

        return true;
    }

    public setState(newState: DTO) {
        this._lastState = this.current;
        this._currentState = newState;
    }
}