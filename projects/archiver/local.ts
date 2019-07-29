import MemWatch from 'node-memwatch'
import { run } from './main'
//When run from terminal
MemWatch.on('stats', stats => {
    console.log('GC ran', JSON.stringify(stats))
})
MemWatch.on('leak', ev => {
    console.error('LEAK LEAK LEAK>>>')

    console.error(JSON.stringify(ev, null, 2))
    console.error('>>>LEAK LEAK LEAK')
})
console.log('Node process running on', process.pid)
const date = process.argv[2] || '2019-07-09'
run(date, 'preview')
    .then(() => {
        process.exit(0)
    })
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
