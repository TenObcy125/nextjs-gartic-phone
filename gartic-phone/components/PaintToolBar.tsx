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
                        onInput={(e) => setPenSize(Number((e.target as HTMLInputElement).value))}
                        className="pensize"
                        type="range"
                        min="0"
                        max="30"
                    />
                </div>
            </div>
        </div>
    )
}
