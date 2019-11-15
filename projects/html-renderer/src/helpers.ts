import { Pillar } from './model/Pillar'
import { Theme } from './components/headers/Theme'

const getTheme = (pillar: Pillar): Theme => {
    switch (pillar) {
        case 'news': {
            return {
                dark: '#ab0613',
                main: '#c70000',
                bright: '#ff4e36',
                pastel: '#ffbac8',
                faded: '#fff4f2',
                borderStyle: 'solid',
            }
        }
        case 'opinion': {
            return {
                dark: '#bd5318',
                main: '#e05e00',
                bright: '#ff7f0f',
                pastel: '#f9b376',
                faded: '#fef9f5',
                borderStyle: 'solid',
            }
        }
        case 'sport': {
            return {
                dark: '#005689',
                main: '#0084c6',
                bright: '#00b2ff',
                pastel: '#90dcff',
                faded: '#f1f8fc',
                borderStyle: 'dotted',
            }
        }
        case 'culture': {
            return {
                dark: '#6b5840',
                main: '#a1845c',
                bright: '#eacca0',
                pastel: '#e7d4b9',
                faded: '#fbf6ef',
                borderStyle: 'solid',
            }
        }
        case 'lifestyle': {
            return {
                dark: '#7d0068',
                main: '#bb3b80',
                bright: '#ffabdb',
                pastel: '#fec8d3',
                faded: '#feeef7',
                borderStyle: 'solid',
            }
        }
    }
}

export { getTheme }
