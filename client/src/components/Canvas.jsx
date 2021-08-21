import '../styles/canvas.scss';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import {Modal, Button} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import Brush from '../tools/Brush';

const Canvas = () => {

    const [modal, setModal] = useState(true)

    const canvasRef = useRef();

    const usernameRef = useRef();

    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current);
    }, [])

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/');
            canvasState.setSocket(socket);
            canvasState.setSessionId(params.id);
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
                console.log('connection is open')
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data);
                switch (msg.method) {
                    case 'connection':
                        console.log(`User ${msg.username} joined`)
                        break;
                    case 'draw':
                        drawHandler(msg)
                        break;
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = msg => {
        const {figure} = msg;
        const ctx = canvasRef.current.getContext('2d')
        switch (figure.type) {
            case 'brush': {
                Brush.draw(ctx, figure.x, figure.y);
                break;
            }
        }

    }

    const onMouseDown = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL());
    }

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef .current.value)
    }

    return (
        <div className='canvas'>
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Wtite your name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type='text' ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={connectionHandler}>
                        Enter
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas
                ref = {canvasRef}
                width={600}
                height={400}
                onMouseDown={onMouseDown}
            >
            </canvas>
        </div>
    );
};

export default observer(Canvas);