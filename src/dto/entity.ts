// Anything identifiable by an ID
export default interface Entity<T> {
    id: string;
    data: T;
}