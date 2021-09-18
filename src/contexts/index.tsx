import NoticeContext from '@/contexts/notice'
import UserContext from '@/contexts/user'
import DarkModeContext from '@/contexts/dark_mode'
import SearchContext from '@/components/Search/context'
import AppContext from '@/contexts/firebase/app'
import FirestoreContext from '@/contexts/firebase/firestore'
import FirestoreLiteContext from '@/contexts/firebase/firestore_lite'
import MessagingContext from '@/contexts/firebase/messaging'
import AnalyticsContext from '@/contexts/firebase/analytics'
import AuthContext from '@/contexts/firebase/auth'

import { useNoticeProvider } from '@/hooks/notice'
import { useDarkModeProvider } from '@/hooks/dark_mode'
import {
  useSafeLogEvent,
  useStateAnalytics,
  useInitializeAnalytics,
  useAnalytics
} from '@/hooks/firebase/analytics'
import { useHash } from '@/hooks/hash'
import { useProviderUser, useUser } from '@/hooks/user'
import {
  useInitializeFirebaseApp,
  useStateFirebaseApp,
  useFirebaseApp
} from '@/hooks/firebase/app'
import { useStateFirestore } from '@/hooks/firebase/firestore'
import {
  useInitializeFirestoreLite,
  useStateFirebaseLite
} from '@/hooks/firebase/firestore_lite'
import {
  useStateMessaging,
  useInitializeMessaging
} from '@/hooks/firebase/messaging'
import { useStateAuth } from '@/hooks/firebase/auth'
import { useAsyncEffect } from 'use-async-effect'

import type { FC, ReactNode } from 'react'

const ProvideSearchContext: FC = ({ children }) => {
  const { safeLogEvent } = useSafeLogEvent()
  const [isShowSearch, changeHash] = useHash('#search')

  const loggedChangeHash = (
    val: Parameters<typeof changeHash>[0]
  ): ReturnType<typeof changeHash> => {
    changeHash(val)
    const action = val ? 'show' : 'hide'
    safeLogEvent((analytics, logEvent) =>
      logEvent(analytics, 'select_content', {
        content_type: 'search',
        action
      })
    )
  }
  return (
    <SearchContext.Provider value={[isShowSearch, loggedChangeHash]}>
      {children}
    </SearchContext.Provider>
  )
}

const InitializerContext: FC<{ children: ReactNode }> = ({ children }) => {
  useInitializeFirebaseApp()
  const app = useFirebaseApp()
  useInitializeAnalytics(app)
  useInitializeFirestoreLite(app)
  useInitializeMessaging(app)

  const analytics = useAnalytics()
  const user = useUser()

  useAsyncEffect(async () => {
    if (!analytics || !user.uid) return

    const { setUserId } = await import('firebase/analytics')
    setUserId(analytics, user.uid)
  }, [analytics, user.uid])

  return <>{children}</>
}

const Index: FC = ({ children }) => {
  const [user, changeUser] = useProviderUser()
  const notice = useNoticeProvider()
  const darkMode = useDarkModeProvider()
  const app = useStateFirebaseApp()
  const firestoreLite = useStateFirebaseLite()
  const firestore = useStateFirestore()
  const messaging = useStateMessaging()
  const auth = useStateAuth()
  const analytics = useStateAnalytics()

  return (
    <UserContext.Provider value={[user, changeUser]}>
      <AppContext.Provider value={app}>
        <FirestoreLiteContext.Provider value={firestoreLite}>
          <MessagingContext.Provider value={messaging}>
            <AnalyticsContext.Provider value={analytics}>
              <FirestoreContext.Provider value={firestore}>
                <NoticeContext.Provider value={notice}>
                  <DarkModeContext.Provider value={darkMode}>
                    <ProvideSearchContext>
                      <AuthContext.Provider value={auth}>
                        <InitializerContext>{children}</InitializerContext>
                      </AuthContext.Provider>
                    </ProvideSearchContext>
                  </DarkModeContext.Provider>
                </NoticeContext.Provider>
              </FirestoreContext.Provider>
            </AnalyticsContext.Provider>
          </MessagingContext.Provider>
        </FirestoreLiteContext.Provider>
      </AppContext.Provider>
    </UserContext.Provider>
  )
}

export default Index
