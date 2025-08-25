import type { TPrintableView } from "../App"
import { Output } from "./Output"

interface IProps {
    selectedText: string
    printableView: TPrintableView
    setPrintableView: React.Dispatch<React.SetStateAction<TPrintableView>>
}

export const PrintableView = ({ selectedText, printableView, setPrintableView }: IProps) => {
    const printableViews: TPrintableView[] = ['key', 'puzzle'];

    return (
        <div>
            <div className='flex justify-between'>
                <button onClick={() => setPrintableView(printableViews[(printableViews.indexOf(printableView) + 1) % printableViews.length])}>{printableView}</button>
                <button onClick={() => setPrintableView(null)}>Close</button>
            </div>
            {printableView && <Output selectedText={selectedText} hideKey={printableView === 'puzzle'} />}
        </div>
    )

}
