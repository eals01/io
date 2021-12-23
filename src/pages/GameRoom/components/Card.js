import './Card.scss'

import block from '../assets/block.svg'
import reverse from '../assets/reverse.svg'
import swap from '../assets/swap.svg'
import plusTwo from '../assets/plus_two.svg'
import plusFour from '../assets/plus_four.svg'

const icons = {
    'block': block,
    'reverse': reverse,
    'swap': swap,
    '+2': plusTwo,
    '+4': plusFour
}

const Card = props => {
    let cardStyle = {
        position: 'absolute',
    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    
        width: '180px',
        height: '300px',
    
        borderRadius: '10px'
    }
    cardStyle.background = props.color

    if(props.back) {
        return (
            <div style={cardStyle} className='card'>
                <span className='mainNumber'>UNO</span>
            </div>
        )
    } else if(props.special) {
        return (
            <div style={cardStyle} className='card'>
                <img className='topImage' src={icons[props.value]}/>
                <img src={icons[props.value]}/>
                <img className='bottomImage' src={icons[props.value]}/>
            </div>
        )
    } else if(props.hSpecial) {
        return (
            <div style={cardStyle} className='card'>
                <span className='topNumber'>{props.value}</span>
                <img src={icons[props.value]}/>
                <span className='bottomNumber'>{props.value}</span>
            </div>
        )
    } else {
        return (
            <div style={cardStyle} className='card'>
                <span className='topNumber'>{props.value}</span>
                <span className='mainNumber'>{props.value}</span>
                <span className='bottomNumber'>{props.value}</span>
            </div>
        )
    }
}

export default Card