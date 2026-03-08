type ToolBar = {
    setPenSize: (value: number) => void,
    penSize: number
}

export default function PaintToolBar({ penSize, setPenSize }: ToolBar) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="p-4 w-200">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-base-content">
                        Pen size: <span className="text-primary">{penSize}</span>
                    </p>

                    <input
                        value={penSize}
                        onChange={(e) => setPenSize(Number(e.target.value))}
                        className="pensize"
                        type="range"
                        min="1"
                        max="50"
                    />
                </div>
            </div>
        </div>
    )
}
