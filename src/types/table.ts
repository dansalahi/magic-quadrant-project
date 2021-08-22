import {IData, IDataItem, IField} from './data';

export interface ITableProps {
    data: IData | undefined;
    addItem: (item: IDataItem) => void;
    removeItem: (index: number) => void;
    editItem: (index: number, field: IField, value: string | number) => void;
}