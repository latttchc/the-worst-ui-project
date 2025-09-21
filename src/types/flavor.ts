export const flavorOptions = ["strawberry", "blue", "meron", "orange"] as const;
export type Flavor = typeof flavorOptions[number];