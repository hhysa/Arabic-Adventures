import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Progress,
  emptyProgress,
  parseProgress,
  completeLesson,
  rewardQuiz,
  totalStars,
  progressStorageKey,
} from './progress-model';
export { streak } from './progress-model';

const Context = createContext({
  ...emptyProgress,
  stars: 0,
  ready: false,
  error: '',
  complete: (_id: string) => {},
  reward: () => {},
});
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    AsyncStorage.getItem(progressStorageKey)
      .then((raw) => {
        if (raw) setState(parseProgress(raw));
      })
      .catch(() => setError('Your saved progress could not be loaded.'))
      .finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (!ready) return;
    // Serialize writes so a slower old save cannot overwrite newer progress.
    writes.current = writes.current
      .then(() =>
        AsyncStorage.setItem(progressStorageKey, JSON.stringify(state)),
      )
      .catch(() => setError('Progress could not be saved on this device.'));
  }, [state, ready]);
  function complete(id: string) {
    if (ready) setState((previous) => completeLesson(previous, id));
  }
  function reward() {
    if (ready) setState((previous) => rewardQuiz(previous));
  }
  return (
    <Context.Provider
      value={{
        ...state,
        stars: totalStars(state),
        ready,
        error,
        complete,
        reward,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useProgress = () => useContext(Context);
