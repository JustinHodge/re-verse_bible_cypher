interface IProps {
    selectedText: string;
    hideKey?: boolean;
}

interface IEncoding {
    [key: string]: string;
}

const codableCharacters = ['🐵', '🐒', '🦍', '🐶', '🐕', '🐩', '🐺', '🦊', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦌', '🦄', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🦏', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿', '🦇', '🐻', '🐨', '🐼', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊', '🦅', '🦆', '🦉', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🦀', '🦐', '🦑', '🦋', '🐌', '🐛', '🐜', '🐝', '🐞', '🕷', '🕸', '🦂',]

const makeEncoding = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const characterOptions = [...codableCharacters];

    const encoding = letters.reduce((acc, letter) => {
        acc[letter] = characterOptions.shift() ?? '_';
        return acc;
    }, {} as IEncoding);

    return encoding
}

const encodeText = (text: string, encoding?: IEncoding) => {
    if (!encoding) {
        encoding = makeEncoding();
    }

    const encoded = text
        .toUpperCase()
        .split('')
        .map((char) => {
            return encoding[char] ? encoding[char] : char;
        })
        .join('');

    return { encodedText: encoded, encodingKey: encoding }
}

export const Output = ({ selectedText, hideKey }: IProps) => {
    const { encodedText, encodingKey } = selectedText ? encodeText(selectedText) : { encodedText: null, encodingKey: null };

    if (!selectedText) {
        return <p>No text selected</p>
    }

    if (!encodedText) {
        return <p>Text could not be encoded</p>
    }

    return (
        <div>
            {!hideKey ? (
                <div className='p-4 bg-gray-800 rounded-md m-4'>
                    <p>{selectedText}</p>
                </div>
            ) : null
            }
            <div className='border-2 border-gray-500 rounded-md p-4 m-4'>
                {!hideKey ? (
                    <div id='key' className='flex border-b-2 border-gray-500 p-4 items-center justify-center'>
                        {Object.entries(encodingKey)
                            .map(([key, value], index) =>
                                <div key={`keychar${index}`} className='flex flex-col items-center justify-center mt-4'>
                                    <div className="w-5 h-lh">{codableCharacters.includes(key) ? '_' : key}</div>
                                    <div className="w-5 h-lh">{codableCharacters.includes(value) ? value : ' '}</div>
                                </div>
                            )}
                    </div>
                ) : null
                }
                <div id='puzzle' className='flex p-4 flex-wrap'>
                    {[...encodedText].map((char, index) => {
                        return (
                            <div key={`puzzlechar${index}`} className='flex flex-col items-center justify-center mt-4 border-b-2 border-gray-500'>
                                <div className="w-5 h-lh">{codableCharacters.includes(char) ? '_' : char}</div>
                                <div className="w-5 h-lh">{codableCharacters.includes(char) ? char : ' '}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

