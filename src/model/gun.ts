export default interface GunModel {
    name: string;

    ammo: number;
    ammoCapacity: number;
    isReloading: boolean;

    fireMode: FIRE_MODE;
}

export enum FIRE_MODE {
    AUTO = "AUTO",
    BURST = "BURST",
    SEMI_AUTO = "SEMI-AUTO",
}