const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

class Graph {
    constructor(){
        this.rows = 0
        this.columns = 0
        this.nodes = 0
        this.map = []
        this.index = []
        this.adjMatrix = []
        this.smallest = []
    }
    configure(i,j){
        this.rows = i
        this.columns = j
        this.nodes = i * j
        for(let row = 0; row < i; row++){
            let arr = []
            let arr2 = []
            for(let column = 0; column < j; column++){
                arr.push(0)
                arr2.push(0)
            }
            this.map.push(arr)
            this.smallest.push(arr2)
        }
    }
    addRow(row, i){
        for(let x = 0; x < this.columns; x++){
            this.map[i][x] = parseInt(row[x],10)
            this.index.push(parseInt(row[x],10))
        }
    }
    makeMatrix(){
        for(let i = 1; i <= this.nodes; i++){
            let rowArray = []
            for(let j = 1; j <= this.nodes; j++){
                if(j === i){
                    rowArray.push(NaN)
                }else{
                    let currentValue = this.index[i - 1]
                    let rightIndex = (i % this.columns !== 0)? i + 1:NaN
                    let leftIndex = (i % this.columns !== 1)? i - 1:NaN
                    let topIndex = (i > this.columns)? i - this.columns:NaN
                    let bottomIndex = (i < (this.nodes - this.columns))? i + this.columns:NaN
                    if(rightIndex === j || leftIndex === j || topIndex === j || bottomIndex === j){
                        rowArray.push(Math.abs(currentValue - this.index[j - 1]))
                    }else{
                        rowArray.push(NaN)
                    }
                }
            }
            this.adjMatrix.push(rowArray)
        }
    }
    isUsed(i,used){
        let found = false
            used.forEach(x => {
                if(x.index === i)
                    found = true
            })
        return found
    }
    findMin(arr, used){
        let min = 101
        let index = -1
        arr.forEach((x,i) => {
            if(x < min && !this.isUsed(i,used)){
                min = x
                index = i
            }
        })
        return {min,index}
    }
    minSpan(start, length){
        let usedNodes = [{min:0 , index:start}]
        for(let i = 0; i < length; i++){
            usedNodes.push(this.findMin(this.adjMatrix[start], usedNodes))
            start = usedNodes[i].index
        }
        console.log(usedNodes[0].min, usedNodes[1].min, usedNodes[2].min)
    }
    print(){
        console.log('#################')
        for(let i = 0; i < this.rows; i++){
            console.log(`${this.map[i].toString()}`)
        }
        console.log('#################')
        for(let i = 0; i < this.rows; i++){
            console.log(`${this.smallest[i].toString()}`)
        }
        console.log('#################')
        console.log(this.index.toString())
        console.log('#################')
        for(let i = 0; i < this.nodes; i++){
            console.log(`${this.adjMatrix[i].toString()}`)
        }
        console.log('#################')
    }
    get rowCount(){
        return this.rows
    }
}

let lineCount = 0
let graph = new Graph()
let firstLine = true

rl.on('line', input => {
    if(firstLine){
        str = input.split(' ')
        graph.configure(parseInt(str[0],10),parseInt(str[1],10))
        firstLine = false
    }else{
        str = input.split(' ')
        graph.addRow(str,lineCount)
        lineCount++
        if(lineCount === graph.rowCount){
            graph.makeMatrix()
            graph.print()
            graph.minSpan(1, 3)
            rl.close()
        }
    }
})