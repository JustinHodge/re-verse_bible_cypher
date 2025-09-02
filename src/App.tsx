import { useEffect, useState } from 'react'
import { ChapterSelector } from './components/ChapterSelector';

import './App.css'
import { VerseSelector } from './components/VerseSelector';
import { Output } from './components/Output';
import { PrintableView } from './components/PrintableView';
import logoUrl from './assets/logo.png';

const API_URL = 'https://bibledata.atl1.cdn.digitaloceanspaces.com';
const LANGUAGE = 'English';
const VERSION = 'CSBBible';
const TOC_FILENAME = '00_TableOfContents.json';

const makeURL = (filepath: string) => {
    return `${API_URL}/${LANGUAGE}/${VERSION}/${filepath}`
}

interface IVerse {
    verseNumber: number;
    verseText: string;
}

export interface ITextData {
    bookName: string;
    bookNumber: number;
    chapterNumber: number;
    testament: string;
    verses: IVerse[];
}

interface ITableOfContents {
    [key: string]: {
        bookName: string;
        bookNumber: number;
        chapters: string[];
    }
}

export type TPrintableView = 'puzzle' | 'key' | null;

export const App = () => {
    const [directory, setDirectory] = useState<ITableOfContents>();
    const [bookKey, setBook] = useState('');
    const [chapter, setChapter] = useState('');
    const [verses, setVerses] = useState({ startVerse: -1, endVerse: -1 });
    const [textData, setTextData] = useState<ITextData | null>(null);
    const [printableView, setPrintableView] = useState<TPrintableView>(null);

    useEffect(() => {
        const fetchData = async () => {
            const tableOfContents = await fetch(makeURL(TOC_FILENAME));
            const json = await tableOfContents.json();
            const directory = Object.entries(json).reduce((acc, [key, value]) => {
                acc[key] = { ...value, bookKey: key };
                return acc;
            }, {} as ITableOfContents);
            setDirectory(json);
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (!directory || !chapter) {
            setTextData(null);
            return;
        }

        const fetchData = async () => {
            const bookData = directory[bookKey];
            const bookNumberString = bookData.bookNumber.toString().padStart(2, '0');
            const chapterString = chapter.toString().padStart(3, '0');
            const chapterData = await fetch(makeURL(`${bookNumberString}_${bookKey}/${bookKey}_${chapterString}.json`));
            const json = await chapterData.json();
            setTextData(json);
        }

        fetchData();

    }, [chapter, bookKey, directory])

    if (!directory) {
        return <p>Loading...</p>
    }

    const books = Object.entries(directory).map(([key, value]) => {
        return { bookName: value.bookName, bookNumber: value.bookNumber, bookKey: key }
    })

    const selectedText = textData
        && verses.startVerse
        && verses.endVerse
        && verses.startVerse <= verses.endVerse
        && verses.startVerse >= 1
        ? textData.verses
            .slice(verses.startVerse - 1, verses.endVerse)
            .map((verse) => { return (`${verse.verseNumber} ${verse.verseText} `) })
            .join('')
        : null;

    if (printableView && selectedText) {
        return <PrintableView selectedText={selectedText} printableView={printableView} setPrintableView={setPrintableView} />
    }

    return (
        <div className='flex flex-col container'>
            <div className='flex justify-center bg-gray-500 p-4 rounded-2xl'>
                <img src={logoUrl} alt="logo" />
            </div>
            <div className='flex my-4'>
                <div className='flex flex-col'>
                    <label className='self-start mx-2' htmlFor='book'>Book: </label>
                    <select className='border-2 border-gray-300 p-2 m-2 rounded-md' onChange={(e) => setBook(e.target.value)} value={bookKey}>
                        <option value="" disabled>Select a book</option>
                        {books.map((book) => {
                            return <option key={book.bookKey} value={book.bookKey}>{book.bookName}</option>
                        })}
                    </select>
                </div>
                {
                    bookKey ?
                        <ChapterSelector
                            className='border-2 border-gray-300 p-2 m-2 rounded-md'
                            value={chapter}
                            onChange={(e) => setChapter(e.target.value)}
                            chapters={directory[bookKey].chapters.map((chapter) => {
                                return Number.parseInt(chapter.replace('.json', '').replace(`${bookKey}_`, '')).toString();
                            })}
                        />
                        : null}
                {
                    chapter && textData ?
                        <VerseSelector
                            className='border-2 border-gray-300 p-2 m-2 rounded-md'
                            selection={verses}
                            selectionSetter={setVerses}
                            textData={textData}

                        />
                        : null
                }
                {
                    selectedText ?
                        <div className='flex'>
                            <button className='border-2 border-gray-300 p-2 m-2 rounded-md' onClick={() => {
                                setPrintableView('key');
                            }}>Print Key</button>
                            <button onClick={() => { setPrintableView('puzzle') }} className='border-2 border-gray-300 p-2 m-2 rounded-md'>Print Puzzle</button>
                        </div>
                        : null
                }
            </div>
            {
                selectedText ?
                    (<Output selectedText={selectedText} />) : null
            }

        </div>
    )
}

export default App
