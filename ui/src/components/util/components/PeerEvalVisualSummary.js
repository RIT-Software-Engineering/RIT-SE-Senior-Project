import { useRef, useEffect } from "react"


export function PeerEvalVisualSummary(props) {
    const canvasRef = useRef(null)

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    //Our first draw
    context.fillStyle = '#000000'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
      

    return <div>
            <h1>
            PeerEvalVisualSummary
            </h1>
            <span></span>
            <svg class="chart" width="500" height="300">
                <g class="bar">
                    <rect width="40" height="150" x="0" y="150"></rect>
                    <text x="20" y="145">Label 1</text>
                </g>
                <g class="bar">
                    <rect width="80" height="150" x="50" y="150"></rect>
                    <text x="90" y="145">Label 2</text>
                </g>
            </svg>
        </div>
}