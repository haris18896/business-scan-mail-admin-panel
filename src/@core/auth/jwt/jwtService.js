import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    axios.interceptors.request.use(
      config => {
        const accessToken = this.getToken()
        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return config
      },
      error => Promise.reject(error)
    )

    axios.interceptors.response.use(
      response => response,
      error => {
        const { response } = error
        if (response && response.status === 406) {
          localStorage.removeItem('accessToken')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken()
    })
  }

  login(data) {
    return axios.post(this.jwtConfig.loginEndpoint, data)
  }

  getStats() {
    return axios.get(this.jwtConfig.getStatsEndPoint)
  }

  fetchProfile() {
    return axios.get(this.jwtConfig.fetchProfileEndPoint)
  }

  updateProfile(data) {
    return axios.put(this.jwtConfig.updateAdminProfile, data)
  }

  updatePassword(data) {
    return axios.put(this.jwtConfig.updatePasswordEndPoint, data)
  }

  getEmailsList(exportId, page) {
    const endpoint = `${this.jwtConfig.getEmailsListEndPoint}?exportId=${exportId}&page=${page}`

    return axios.get(endpoint)
  }

  getEmailsFilter(data) {
    const endpoint = `${this.jwtConfig.getEmailsSearchFilterEndPoint}`
    return axios.post(endpoint, data, { timeout: 0 })
  }

  clearSearchData() {
    return axios.delete(this.jwtConfig.clearSearchDataEndPoint)
  }

  deleteEmails(data) {
    const endpoint = `${this.jwtConfig.deleteEmailsEndPoint}`
    return axios.post(endpoint, data)
  }

  getAttachment(data) {
    const endpoint = `${this.jwtConfig.getAttachmentEndPoint}`
    return axios.post(endpoint, data)
  }
}
