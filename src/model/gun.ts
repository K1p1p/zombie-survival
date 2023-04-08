export default interface GunModel {
    id: GUN_ID;
    name: string;

    ammo: number;
    ammoCapacity: number;
    totalAmmo: number;
    isReloading: boolean;

    fireMode: FIRE_MODE;
}

export enum GUN_ID {
    GENERIC_PISTOL,
    GENERIC_ASSAULT_RIFLE
}

export enum FIRE_MODE {
    AUTO = "AUTO",
    BURST = "BURST",
    SEMI_AUTO = "SEMI-AUTO",
}