interface StorageProvider {
  save: (name: string, data: any) => void;
  get: (name: string) => any;
}

export type { StorageProvider }