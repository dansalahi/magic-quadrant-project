import React, {useEffect, useState} from 'react';
import Layout from './layout/layout';
import {Chart, Table} from './components';
import {createUseStyles} from 'react-jss';
import {IData, IDataItem, IField} from './types/data';
import {initialData} from './helper/faker';
import {ThemeProvider} from 'react-jss';
import {ITheme} from './types/theme';

const theme: ITheme = {
    lightGrey: '#E3E4E7',
    darkGrey: '#696969',
    lightBlue: '#ADB9C3',
    blue: '#327297',
    grayTransparent: 'rgba(59, 66, 77, 0.7)',
    silver: '#dfdfe5',
    gray: '#5F5F5FFF'
};

function App() {
    const classes = useStyles();
    const [data, setData] = useState<IData>();
    const [visitedBefore, setVisitedBefore] = useState(localStorage.getItem('visitedBefore') ?? '');

    useEffect(() => {
        if(!visitedBefore){
            localStorage.setItem('data', JSON.stringify(initialData));

            // Set visited before
            localStorage.setItem('visitedBefore', 'true');
            setVisitedBefore('true');
        }

        // Getting data from local storage
        const savedData = localStorage.getItem('data');
        setData(savedData ? JSON.parse(savedData) : []);
    }, []);

    // Adding a new item to the list
    const addItem = (item: IDataItem) => {
        // Add to the state
        let newData = data ? [...data] : [];
        newData.push(item);
        setData(newData);

        // Update local storage data
        updateLocalStorageData(newData);
    }

    // Removing an item from the list by index
    const removeItem = (index: number) => {
        if(!data || data.length === 0){
            return;
        }

        // Removing from state
        let newData = [...data];
        newData.splice(index, 1);
        setData(newData);

        // Update local storage data
        updateLocalStorageData(newData);
    };

    // Editing an item in the list
    const editItem = (index: number, field: IField, value: string | number) => {
        if(!data || data.length === 0){
            return;
        }

        // Checking number fields
        if(field === 'vision' || field === 'ability'){
            if(value < 0){
                value = 0
            }
            if(value > 100){
                value = 100;
            }
        }

        // Updating state
        let newData = [...data];
        newData[index] = {...newData[index], [field]: value};
        setData(newData);

        // Update local storage data
        updateLocalStorageData(newData);
    };

    const editItemFull = (index: number, item: IDataItem) => {
        if(!data || data.length === 0){
            return;
        }

        // Updating state
        let newData = [...data];
        newData[index] = item;
        setData(newData);

        // Update local storage data
        updateLocalStorageData(newData);
    };

    const updateLocalStorageData = (newData: IData) => {
        if(!newData){
            newData = [];
        }
        localStorage.setItem('data', JSON.stringify(newData));
    };

    return (
        <ThemeProvider theme={theme}>
            <Layout title={'Home'}>
                <div className={classes.row}>
                    <div className={classes.col}>
                        <Chart
                            data={data}
                            editItemFull={editItemFull}
                        />
                    </div>
                    <div className={classes.col}>
                        <Table
                            data={data}
                            addItem={addItem}
                            editItem={editItem}
                            removeItem={removeItem}
                        />
                    </div>
                </div>
            </Layout>
        </ThemeProvider>
    );
}

const useStyles = createUseStyles({
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',

        '@media (max-width: 1024px)': {
            flexDirection: 'column'
        }
    },
    col: {
        width: '100%',

        '@media (max-width: 1024px)': {
            marginBottom: '10px'
        }
    }
});

export default App;
