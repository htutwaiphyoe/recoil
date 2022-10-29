import {atom, useRecoilState, useRecoilValue} from 'recoil'

const darkModeAtom = atom({
    key: 'darkMode',
    default: false,
})

const Switch = () => {
    const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeAtom)
    return <input type="checkbox" checked={isDarkMode} onChange={(e) => setIsDarkMode(e.target.checked)} />
}

const Button = () => {
    const isDarkMode = useRecoilValue(darkModeAtom)
    const style = isDarkMode ? {backgroundColor: 'black', color: 'white'} : {backgroundColor: 'white', color: 'black'}
    return <button style={style}>Switch Dark Mode</button>
}

const Atoms = () => {
    return (
        <div>
            <div>
                <Switch />
            </div>
            <div>
                <Button />
            </div>
        </div>
    )
}
export default Atoms
