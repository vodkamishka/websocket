import '../styles/toolbar.scss';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import Brush from '../tools/Brush';
import Rect from '../tools/Rect';
import Eraser from '../tools/Eraser';

const Toolbar = () => {

    const changeColor = (e) => {
        toolState.setStrokeColor(e.target.value);
        toolState.setFillColor(e.target.value);
    }
    return (
        <div className='toolbar' >
            <button className='toolbar__btn brush' onClick={()=> toolState.setTool(new Brush(canvasState.canvas))}></button>
            <button className='toolbar__btn brush' onClick={()=> toolState.setTool(new Rect(canvasState.canvas))}></button>
            <button className='toolbar__btn brush' onClick={()=> toolState.setTool(new Eraser(canvasState.canvas))}></button>
            <button className='toolbar__btn brush'></button>
            <button className='toolbar__btn brush'></button>
            <input onChange={changeColor} style= {{marginLeft: '10px'}} type='color'/>
            <button className='toolbar__btn brush undo' onClick={canvasState.undo}></button>
            <button className='toolbar__btn brush' onClick={canvasState.redo}></button>
            <button className='toolbar__btn brush'></button>
        </div>
    );
};

export default Toolbar;