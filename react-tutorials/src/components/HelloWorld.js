import React from 'react'

export default function HelloWorld(name = 'HelloWorld') {
    return (
        <h1>Hello {name} !</h1>
    )
}

/*

Old code

class HelloWorld extends React.Component{
    render(){
        return(
            <h1>Hello {this.props.name} !</h1>
        )
    }
}

export default HelloWorld;

 */