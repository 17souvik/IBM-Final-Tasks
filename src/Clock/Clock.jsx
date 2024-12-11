import React from 'react';
import ReactDOM from 'react-dom';
import "./Clock.css";

function Clock() {
  const [time, setTime] = React.useState(new Date());
  const [activeTab, setActiveTab] = React.useState('clock');
  const [stopwatchTime, setStopwatchTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [alarmTime, setAlarmTime] = React.useState('');
  const [selectedDays, setSelectedDays] = React.useState([]);
  const [alarms, setAlarms] = React.useState([]);
  const [alarmSet, setAlarmSet] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleTheme = () => {
      setDarkMode(!darkMode);
  };

  const createBeep = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.5;
      
      oscillator.start();
      setTimeout(() => {
          oscillator.stop();
      }, 500);
  };

  React.useEffect(() => {
      const timer = setInterval(() => {
          const newTime = new Date();
          setTime(newTime);
          
          if (alarmSet && alarms.length > 0) {
              alarms.forEach(alarm => {
                  const [alarmHours, alarmMinutes] = alarm.time.split(':');
                  const currentDay = newTime.getDay();
                  
                  if (
                      alarm.active &&
                      alarm.day === currentDay &&
                      newTime.getHours() === parseInt(alarmHours) &&
                      newTime.getMinutes() === parseInt(alarmMinutes) &&
                      newTime.getSeconds() === 0
                  ) {
                      createBeep();
                  }
              });
          }
      }, 1000);

      return () => clearInterval(timer);
  }, [alarms, alarmSet]);

  React.useEffect(() => {
      let interval;
      if (isRunning) {
          interval = setInterval(() => {
              setStopwatchTime(prev => prev + 10);
          }, 10);
      }
      return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
      });
  };

  const formatDate = (date) => {
      return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  const formatStopwatch = (ms) => {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      const milliseconds = Math.floor((ms % 1000) / 10);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const toggleDay = (dayIndex) => {
      setSelectedDays(prev => 
          prev.includes(dayIndex) 
              ? prev.filter(d => d !== dayIndex)
              : [...prev, dayIndex]
      );
  };

  const setAlarm = () => {
      if (alarmTime && selectedDays.length > 0) {
          const newAlarms = selectedDays.map(dayIndex => ({
              time: alarmTime,
              day: dayIndex,
              active: true
          }));
          
          setAlarms(prev => [...prev, ...newAlarms]);
          setAlarmSet(true);
          alert(`Alarm set successfully for ${selectedDays.map(day => weekDays[day].slice(0,3)).join(', ')} at ${alarmTime}!`);
          
          setSelectedDays([]);
          setAlarmTime('');
      } else {
          alert('Please select both time and at least one day for the alarm');
      }
  };

  const renderContent = () => {
      switch(activeTab) {
          case 'clock':
              return (
                  <div className="clock">
                      <div className="time">{formatTime(time)}</div>
                      <div className="date">{formatDate(time)}</div>
                  </div>
              );
          case 'stopwatch':
              return (
                  <div className="clock">
                      <div className="stopwatch">
                          <div className="stopwatch-display">{formatStopwatch(stopwatchTime)}</div>
                          <div className="stopwatch-controls">
                              {!isRunning ? (
                                  <button onClick={() => setIsRunning(true)}>Start</button>
                              ) : (
                                  <button onClick={() => setIsRunning(false)}>Stop</button>
                              )}
                              <button onClick={() => setStopwatchTime(0)}>Reset</button>
                          </div>
                      </div>
                  </div>
              );
          case 'alarm':
              return (
                  <div className="clock">
                      <div className="alarm">
                          <div className="time">{formatTime(time)}</div>
                          <input 
                              type="time" 
                              value={alarmTime} 
                              onChange={(e) => setAlarmTime(e.target.value)}
                          />
                          <div className="weekday-selector">
                              {weekDays.map((day, index) => (
                                  <button
                                      key={day}
                                      className={`weekday-button ${selectedDays.includes(index) ? 'selected' : ''}`}
                                      onClick={() => toggleDay(index)}
                                  >
                                      {day.slice(0, 3)}
                                  </button>
                              ))}
                          </div>
                          <button 
                              className="alarm-button"
                              onClick={setAlarm}
                          >
                              Set Alarm
                          </button>
                          
                          {alarms.length > 0 && (
                              <div className="current-alarms">
                                  <h3>Current Alarms:</h3>
                                  {alarms.map((alarm, index) => (
                                      <div key={index} className="alarm-item">
                                          {weekDays[alarm.day]} at {alarm.time}
                                          <button 
                                              onClick={() => {
                                                  setAlarms(prev => prev.filter((_, i) => i !== index));
                                                  if (alarms.length === 1) setAlarmSet(false);
                                              }}
                                          >
                                              Delete
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              );
      }
  };

  return (
      <div className={`clock-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <div className="menu">
              <div className="menu-items">
                  <div 
                      className={`menu-item ${activeTab === 'clock' ? 'active' : ''}`}
                      onClick={() => setActiveTab('clock')}
                  >
                      Clock
                  </div>
                  <div 
                      className={`menu-item ${activeTab === 'stopwatch' ? 'active' : ''}`}
                      onClick={() => setActiveTab('stopwatch')}
                  >
                      Stop Watch
                  </div>
                  <div 
                      className={`menu-item ${activeTab === 'alarm' ? 'active' : ''}`}
                      onClick={() => setActiveTab('alarm')}
                  >
                      Alarm
                  </div>
              </div>
              <button className="theme-toggle" onClick={toggleTheme}>
                  {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
          </div>
          {renderContent()}
      </div>
  );
};

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);

export default Clock;