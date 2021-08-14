import './App.css';
import 'dayjs/locale/ja'
import dayjs from 'dayjs'
import {useState, useEffect} from 'react'
import ProgressBar from "@ramonak/react-progress-bar";
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)
dayjs.locale('ja')

function ExpectancyTimer({id, remainingSecs}) {
  const days = Math.floor(remainingSecs / 86400)
  const hours = Math.floor(remainingSecs % 86400 / 3600)
  const minutes = Math.floor(remainingSecs % 86400 % 3600 / 60)
  const seconds = Math.floor(remainingSecs % 86400 % 3600 % 60)

  return (
    <div id={id}>
      {days}日
      {hours}時間
      {minutes}分
      {seconds}秒
    </div>
  )
}


function App() {
  const [remainingSecs, setRemainingSecs] = useState(0)
  const [ageAtDeath, setAgeAtDeath] = useState(localStorage.getItem('ageAtDeath') || 80)
  const [birthday, setBirthday] = useState(localStorage.getItem('birthday'))
  useEffect(() => {
    const interval = setInterval(() => {
      if (birthday && ageAtDeath) {
        const dieAt = dayjs(birthday).add(ageAtDeath, 'year')
        setRemainingSecs(dieAt.diff(Date.now(), 'second'))
      }
    }, 200)
    return () => clearInterval(interval)
  }, [birthday, ageAtDeath])

  const handleBirthdayChange = (ev) => {
    setBirthday(dayjs(ev.target.value))
    localStorage.setItem('birthday', ev.target.value)
  }
  const handleAgeAtDeath = (ev) => {
    setAgeAtDeath(ev.target.value)
    localStorage.setItem('ageAtDeath', ev.target.value)
  }

  const dieAt = dayjs(birthday).add(ageAtDeath, 'year')
  const lifespanSecs = dieAt.diff(birthday, 'second')
  const progressSecs = lifespanSecs - remainingSecs
  const progress = Math.round(progressSecs / lifespanSecs * 100)


  return (
    <div className="App">
      <div>
        {remainingSecs > 0 && <ExpectancyTimer id="remaining-time" remainingSecs={remainingSecs}/>}
        {remainingSecs === 0 && <div id="remaining-time">残された時間は...</div>}
        {remainingSecs < 0 && <div id="remaining-time">成仏してください</div>}
      </div>
      <div style={{marginTop: '30px'}}>
        あなたの誕生日: <input type="date" onChange={handleBirthdayChange} defaultValue={birthday}/>
      </div>
      <div>
        {birthday && <span>寿命(年齢): <input type="number" min="1" value={ageAtDeath} onChange={handleAgeAtDeath}/></span>}
      </div>
      {remainingSecs > 0 && <div id="remaining-time-progress">
        <ProgressBar  completed={progress} bgColor={"limegreen"} height={"50px"}/>
      </div>}
    </div>
  );
}

export default App;
