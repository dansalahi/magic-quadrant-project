import React from 'react';
import {createUseStyles} from 'react-jss';
import {ITheme} from '../types/theme';

export default function Layout(props: React.PropsWithChildren<{ title: string }>) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <h1>{props.title}</h1>
            </div>
            <div className={classes.content}>
                {props.children}
            </div>
        </div>
    );
}

const useStyles = createUseStyles((theme: ITheme) => ({
    container: {
        width: '100%',
        maxWidth: '1536px',
        margin: '0 auto'
    },
    header: {
        padding: '5px',
        borderBottom: `1px solid ${theme.silver}`
    },
    content: {
        padding: '20px'
    }
}));
