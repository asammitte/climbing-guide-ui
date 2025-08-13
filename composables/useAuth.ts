import { useTokenStore } from '@/stores/tokenStore'
import { useUserStore } from '@/stores/userStore'
import type { ISessionResponse } from '~/types/users/ISessionResponse'

export const useAuth = () => {
	const authStatus = useState<'loading' | 'authenticated' | 'unauthenticated'>('auth:status', () => 'loading')

	const status = computed({
		get() {
			return authStatus.value
		},
		set(val) {
			authStatus.value = val
		},
	})

  async function signIn(username: string, password: string) {
		try {
			await $fetch('/api/auth/login', {
				body: {
          username: username,
          password: password
        },
				method: 'POST',
			})
      await getSession()
		} catch (err: any) {
			status.value = 'unauthenticated'
			throw new Error(err.response._data.message)
		}
	}

  async function socialLogin(provider: 'GOOGLE' | 'FACEBOOK', credential: string) {
		try {
			await $fetch('/api/auth/social-login', {
				body: {
          provider: provider,
          accessToken: credential
        },
				method: 'POST',
			})
      await getSession()
		} catch (err: any) {
			status.value = 'unauthenticated'
			throw new Error(err.response._data.message)
		}
	}

  async function signUp(email: string, username: string, password: string) {
		try {
			await $fetch('/api/auth/register', {
				body: {
          email: email,
          username: username,
          password: password
        },
				method: 'POST',
			})
      await getSession()
		} catch (err: any) {
			status.value = 'unauthenticated'
			throw new Error(err.response._data.message)
		}
	}

	const getSession = async (): Promise<ISessionResponse | void> => {
		try {
      // const { $api } = useNuxtApp()
			// const user = await $api.auth.me()

      const user = await $fetch<ISessionResponse>('/api/auth/me', { method: 'GET' })

			const store = useUserStore()
			store.setUser(user)
			status.value = 'authenticated'

			return user
		} catch (err: any) {
			status.value = 'unauthenticated'
			const code = err.response.status
			if (code === 401) {
				return refresh()
			}
			throw new Error(err.response._data.message)
		}
	}

	async function refresh() {
		try {
			const response: any = await $fetch('/api/auth/refresh',
				{
					credentials: 'include',
					method: 'POST',
				},
			)
			status.value = 'authenticated'
			const store = useTokenStore()
			store.setAccessToken(response.data)
		} catch (err: any) {
			throw new Error(err.response._data.message)
		}
	}

	return {
		// accessToken,
		getSession,
    signUp,
		signIn,
    socialLogin,
		refresh,
		status,
	}
}
