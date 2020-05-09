export const api = {
  public: {
    postAuthLogin: 'api/auth/login',
    postAuthRegister: 'api/auth/register',
    postAuthLogout: 'api/auth/logout',
    postAuthForgot: 'api/auth/forgot-password',
    getAuthRefresh: 'api/auth/refresh'
  },
  private: {
    getUsersMe: 'api/users/me',
    getHouseholds: 'api/households',

    getHouseholdsById: householdId =>
      `api/households/${householdId}`,

    /** Add a device to household */
    putHouseholdsDevice: householdId =>
      `api/households/${householdId}/device`,

    getSensorsTimeseries: (sensorId, from, to, step) =>
      `api/sensors/timeseries/${sensorId}?from=${from}&to=${to}&step=${step}`
  }
}
