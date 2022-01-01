import './Card.scss'

import block from '../assets/block.svg'
import reverse from '../assets/reverse.svg'
import swap from '../assets/swap.svg'
import plusTwo from '../assets/plus_two.svg'
import plusFour from '../assets/plus_four.svg'

const icons = {
    'B': block,
    'R': reverse,
    '2': plusTwo,
    '4': plusFour,
    'S': swap,
}

const colors = {
    'R': 'rgb(255, 42, 42)',
    'Y': 'rgb(255, 204, 0',
    'B': 'rgb(42, 127, 255)',
    'G': 'rgb(127, 200, 42)',
    'X': 'rgb(20,20,20)',
    'E': 'rgb(50,50,50)',
}

const Card = props => {
    let cardStyle = {
        position: 'absolute',
        display:'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '180px',
        height: '300px',
        borderRadius: '10px',
        transition: 'transform .1s'
    }
    cardStyle.background = colors[props.value[0]]

    const handleClick = e => {
        if(props.handleclick != undefined) {
            props.handleclick(Array.from(props.hand.children).indexOf(e.target))
        }
    }

    if(props.value === 'EE') {
        return (
            <div onClick={handleClick} className='card' style={cardStyle}>
                <span>UNO</span>
            </div>
        )
    } else if(['B', 'R', 'S'].includes(props.value[1])) {
        return (
            <div onClick={handleClick} className='card' style={cardStyle}>
                <img className='topImage' src={icons[props.value[1]]} />
                <img src={icons[props.value[1]]} />
                <img className='bottomImage' src={icons[props.value[1]]} />
            </div>
        )
    } else if(props.value.length === 3) {
        return (
            <div onClick={handleClick} className='card' style={cardStyle}>
                <span className='topNumber'>+{props.value[2]}</span>
                <img src={icons[props.value[2]]} />
                <span className='bottomNumber'>+{props.value[2]}</span>
            </div>
        )
    } else {
        return (
            <div onClick={handleClick} className='card' style={cardStyle}>
                <span className='topNumber'>{props.value[1]}</span>
                <span>{props.value[1]}</span>
                <span className='bottomNumber'>{props.value[1]}</span>
            </div>
        )
    }
}

export default Card