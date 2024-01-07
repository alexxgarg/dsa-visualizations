interface HoverComponentInterface{
    positionX: number;
    positionY: number;
    value: number;
    showHover: boolean;
}

const HoverComponent : React.FC<HoverComponentInterface> = ({
    positionX,
    positionY,
    value,
    showHover
})=>{
    return(
        <>
        {
            showHover &&         <div style={{
                position: 'absolute',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                top: positionY+10,
                left: positionX,
                zIndex: 35
            }}>
                {value}
            </div>
        }
        </>
    )
}

export default HoverComponent;