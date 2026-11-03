export const environment = {
    production: true,
    apiUrl: 'api/employees',
    authMeUrl: '/api/auth/me',

    auth: {
        authority: 'http://localhost:8080/realms/employee-crud',
        clientId: 'employee-spa',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
    }
};
