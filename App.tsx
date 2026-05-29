import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './contexts/LanguageContext';
import SplashScreen from './screens/SplashScreen';
import LanguageScreen from './screens/LanguageScreen';
import NameScreen from './screens/NameScreen';
import OnboardingFlow from './screens/OnboardingFlow';
import PlacementQuizScreen from './screens/PlacementQuizScreen';
import MainTabs from './screens/MainTabs';
import { UserLevel } from './utils/questionPicker';
import { loadState, saveState } from './utils/storage';

type Screen = 'loading' | 'language' | 'splash' | 'name' | 'onboarding' | 'placement' | 'main';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loading');
  const [userName, setUserName] = useState('');
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [streak, setStreak] = useState(1);
  const [xp, setXP] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quizDoneToday, setQuizDoneToday] = useState(false);

  useEffect(() => {
    loadState().then(saved => {
      if (saved) {
        setUserName(saved.userName);
        setUserLevel(saved.userLevel);
        setUserGoals(saved.userGoals);
        setStreak(saved.streak);
        setXP(saved.xp);
        setTotalQuestions(saved.totalQuestions);
        setLastPlayedDate(saved.lastPlayedDate);
        setCompletedLessons(saved.completedLessons);
        setQuizDoneToday(saved.quizDoneToday);
        setScreen('main');
      } else {
        setScreen('language');
      }
    });
  }, []);

  if (screen === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F0F0F', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#10B981" />
      </View>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'language':
        return <LanguageScreen onContinue={() => setScreen('splash')} />;

      case 'splash':
        return <SplashScreen onStart={() => setScreen('name')} />;

      case 'name':
        return (
          <NameScreen
            onContinue={(name) => {
              setUserName(name);
              saveState({ userName: name });
              setScreen('onboarding');
            }}
          />
        );

      case 'onboarding':
        return (
          <OnboardingFlow
            userName={userName}
            onComplete={(goals) => {
              setUserGoals(goals);
              saveState({ userGoals: goals });
              setScreen('placement');
            }}
          />
        );

      case 'placement':
        return (
          <PlacementQuizScreen
            userName={userName}
            onComplete={(level) => {
              setUserLevel(level);
              saveState({ userLevel: level, onboardingDone: true });
              setScreen('main');
            }}
          />
        );

      case 'main':
        return (
          <MainTabs
            userName={userName}
            userLevel={userLevel}
            userGoals={userGoals}
            streak={streak}
            xp={xp}
            totalQuestions={totalQuestions}
            lastPlayedDate={lastPlayedDate}
            completedLessons={completedLessons}
            quizDoneToday={quizDoneToday}
            onStreakUpdate={setStreak}
            onXPUpdate={setXP}
            onQuestionsUpdate={setTotalQuestions}
            onLevelChange={(l) => { setUserLevel(l); saveState({ userLevel: l }); }}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        {renderScreen()}
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
