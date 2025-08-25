interface IProps {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    chapters: string[]
    value: string
    className?: string
}

export const ChapterSelector = ({ onChange, chapters, value, className }: IProps) => {
    return (
        <div className='flex flex-col'>
            <label className='self-start mx-2' htmlFor='chapter'>Chapter: </label>
            <select
                className={className ?? ''}
                onChange={onChange}
                value={value}>
                <option value=''>Select a chapter</option>
                {chapters.map((chapter) => {
                    return <option key={chapter} value={chapter}>{chapter}</option>
                })}
            </select >
        </div>
    )
}
