import {IData, IDataItem} from './data';

export interface IChartProps {
    data: IData | undefined;
    editItemFull: (index: number, item: IDataItem) => void;
}