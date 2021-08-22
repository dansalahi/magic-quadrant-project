export type IField = 'label' | 'vision' | 'ability';

export interface IDataItem {
    label: string;
    vision: number;
    ability: number;
}

export type IData = Array<IDataItem>;