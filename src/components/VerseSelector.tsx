import type { Dispatch, SetStateAction } from "react";
import type { ITextData } from "../App";

interface IProps {
    selection: {
        startVerse: number
        endVerse: number
    }
    selectionSetter: Dispatch<SetStateAction<{
        startVerse: number
        endVerse: number
    }>>
    textData: ITextData;
    className?: string
}

export const VerseSelector = ({ selection, selectionSetter, textData, className }: IProps) => {
    return (
        <>

            <div className='flex flex-col'>
                <label className='self-start mx-2' htmlFor='startverse'>Start Verse: </label>
                <select className={className ?? ''} value={selection.startVerse} onChange={(e) => selectionSetter({ startVerse: Number(e.target.value), endVerse: selection.endVerse })}>
                    <option disabled value={-1}>Select a start verse</option>
                    {textData.verses.map((verse) => {
                        return <option key={'start' + verse.verseNumber} value={verse.verseNumber}>{verse.verseNumber}</option>
                    })}
                </select>
            </div>
            <div className='flex flex-col'>
                <label className='self-start mx-2' htmlFor='endverse'>End Verse: </label>
                <select className={className ?? ''} value={selection.endVerse} onChange={(e) => selectionSetter({ startVerse: selection.startVerse, endVerse: Number(e.target.value) })}>
                    <option disabled value={-1}>Select an end verse</option>
                    {textData.verses.map((verse) => {
                        return <option key={'end' + verse.verseNumber} value={verse.verseNumber}>{verse.verseNumber}</option>
                    })}
                </select>
            </div>
        </>
    )
}
