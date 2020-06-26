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

    getSensorsTimeseries: (sensorId, start, finish, step = '1 hour', avg = true, min = true, max = true) =>
      `api/sensors/timeseries/v2/${sensorId}?start=${start}&finish=${finish}` +
        `${step ? `&step=${step}` : ''}` +
        `${avg ? `&avg=${avg}` : ''}` +
        `${min ? `&min=${min}` : ''}` +
        `${max ? `&max=${max}` : ''}`
  }
}
